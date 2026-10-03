// Encodes a folder of PNG frames into an H.264 MP4 for the case pages, with
// AVFoundation only (this machine has no ffmpeg).
//
//   swift scripts/frames-to-mp4.swift <frames-dir> <out.mp4> [fps=30] [bitrate=1400000]
//   swift scripts/frames-to-mp4.swift --info <file.mp4> [first.png last.png]
//
// Frames are taken in file-name order; every frame shows for 1/fps, so N
// frames make N/fps seconds. H.264 High, CABAC, a keyframe every 30 frames,
// BT.709 tags, and the moov atom up front (shouldOptimizeForNetworkUse) so the
// browser can start playing before the file has finished loading.
// --info prints duration, size and frame count, and with two paths writes the
// clip's first and last frames there as PNG, to compare with the poster.

import AVFoundation
import CoreGraphics
import CoreVideo
import Foundation
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
  FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
  exit(1)
}

func loadImage(_ url: URL) -> CGImage {
  guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
    let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
  else { fail("cannot read \(url.path)") }
  return image
}

func writePNG(_ image: CGImage, to url: URL) {
  guard let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)
  else { fail("cannot write \(url.path)") }
  CGImageDestinationAddImage(dest, image, nil)
  if !CGImageDestinationFinalize(dest) { fail("cannot write \(url.path)") }
}

func cgImage(_ pixels: CVPixelBuffer) -> CGImage {
  CVPixelBufferLockBaseAddress(pixels, .readOnly)
  defer { CVPixelBufferUnlockBaseAddress(pixels, .readOnly) }
  guard let context = CGContext(
    data: CVPixelBufferGetBaseAddress(pixels), width: CVPixelBufferGetWidth(pixels),
    height: CVPixelBufferGetHeight(pixels), bitsPerComponent: 8,
    bytesPerRow: CVPixelBufferGetBytesPerRow(pixels), space: CGColorSpace(name: CGColorSpace.sRGB)!,
    bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue),
    let image = context.makeImage()
  else { fail("cannot convert a decoded frame") }
  return image
}

// true when the moov atom comes before mdat (playback can start while loading)
func moovFirst(_ path: String) -> Bool {
  guard let data = FileManager.default.contents(atPath: path) else { return false }
  var offset = 0
  while offset + 8 <= data.count {
    let size = data[offset..<offset + 4].reduce(0) { $0 << 8 | Int($1) }
    let type = String(bytes: data[offset + 4..<offset + 8], encoding: .ascii) ?? ""
    if type == "moov" { return true }
    if type == "mdat" { return false }
    if size < 8 { return false }
    offset += size
  }
  return false
}

func info(_ path: String, _ firstOut: String?, _ lastOut: String?) {
  let asset = AVURLAsset(url: URL(fileURLWithPath: path))
  let semaphore = DispatchSemaphore(value: 0)
  Task {
    do {
      guard let track = try await asset.loadTracks(withMediaType: .video).first else { fail("no video track") }
      let duration = try await asset.load(.duration)
      let size = try await track.load(.naturalSize)
      let rate = try await track.load(.nominalFrameRate)
      let bitrate = try await track.load(.estimatedDataRate)
      // count decoded frames, keeping the first and the last
      let reader = try AVAssetReader(asset: asset)
      let output = AVAssetReaderTrackOutput(
        track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
      reader.add(output)
      if !reader.startReading() { fail("cannot read: \(String(describing: reader.error))") }
      var frames = 0
      var first: CGImage?, last: CVPixelBuffer?
      while let sample = output.copyNextSampleBuffer() {
        guard let pixels = CMSampleBufferGetImageBuffer(sample) else { continue }
        if first == nil { first = cgImage(pixels) }  // copy now: the reader recycles its buffers
        last = pixels
        frames += 1
      }
      let bytes = (try? FileManager.default.attributesOfItem(atPath: path)[.size] as? Int) ?? 0
      print(String(format: "duration %.3f s, %dx%d, %.2f fps, %d frames, %.0f kbit/s, %d bytes, moov first: %@",
        duration.seconds, Int(size.width), Int(size.height), rate, frames, bitrate / 1000, bytes,
        moovFirst(path) ? "yes" : "no"))
      if let firstOut, let lastOut, let first, let last {
        writePNG(first, to: URL(fileURLWithPath: firstOut))
        writePNG(cgImage(last), to: URL(fileURLWithPath: lastOut))
        print("first frame -> \(firstOut), last frame -> \(lastOut)")
      }
    } catch { fail("\(error)") }
    semaphore.signal()
  }
  semaphore.wait()
}

let args = Array(CommandLine.arguments.dropFirst())
if args.first == "--info" {
  guard args.count >= 2 else { fail("usage: --info <file.mp4> [first.png last.png]") }
  info(args[1], args.count > 3 ? args[2] : nil, args.count > 3 ? args[3] : nil)
  exit(0)
}
guard args.count >= 2 else { fail("usage: swift frames-to-mp4.swift <frames-dir> <out.mp4> [fps] [bitrate]") }
let dir = URL(fileURLWithPath: args[0])
let outURL = URL(fileURLWithPath: args[1])
let fps = Int32(args.count > 2 ? Int(args[2]) ?? 30 : 30)
let bitrate = args.count > 3 ? Int(args[3]) ?? 1_400_000 : 1_400_000

let files = ((try? FileManager.default.contentsOfDirectory(at: dir, includingPropertiesForKeys: nil)) ?? [])
  .filter { $0.pathExtension.lowercased() == "png" }
  .sorted { $0.lastPathComponent < $1.lastPathComponent }
if files.isEmpty { fail("no PNG frames in \(dir.path)") }
let firstImage = loadImage(files[0])
let width = firstImage.width, height = firstImage.height

try? FileManager.default.removeItem(at: outURL)
let writer: AVAssetWriter
do { writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4) } catch { fail("\(error)") }
writer.shouldOptimizeForNetworkUse = true

let settings: [String: Any] = [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoColorPropertiesKey: [
    AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
    AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
    AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
  ],
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: bitrate,
    AVVideoMaxKeyFrameIntervalKey: 30,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoH264EntropyModeKey: AVVideoH264EntropyModeCABAC,
    AVVideoExpectedSourceFrameRateKey: fps,
    AVVideoAllowFrameReorderingKey: true,
  ],
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
  assetWriterInput: input,
  sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height,
    kCVPixelBufferCGImageCompatibilityKey as String: true,
    kCVPixelBufferCGBitmapContextCompatibilityKey as String: true,
  ])
if !writer.canAdd(input) { fail("cannot add the video input") }
writer.add(input)
if !writer.startWriting() { fail("\(String(describing: writer.error))") }
writer.startSession(atSourceTime: .zero)

let srgb = CGColorSpace(name: CGColorSpace.sRGB)!
for (index, file) in files.enumerated() {
  let image = index == 0 ? firstImage : loadImage(file)
  if image.width != width || image.height != height { fail("\(file.lastPathComponent) is not \(width)x\(height)") }
  while !input.isReadyForMoreMediaData { usleep(2000) }
  guard let pool = adaptor.pixelBufferPool else { fail("no pixel buffer pool") }
  var buffer: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, pool, &buffer)
  guard let pixels = buffer else { fail("cannot allocate a pixel buffer") }
  CVBufferSetAttachment(pixels, kCVImageBufferColorPrimariesKey, kCVImageBufferColorPrimaries_ITU_R_709_2, .shouldPropagate)
  CVBufferSetAttachment(pixels, kCVImageBufferTransferFunctionKey, kCVImageBufferTransferFunction_ITU_R_709_2, .shouldPropagate)
  CVBufferSetAttachment(pixels, kCVImageBufferYCbCrMatrixKey, kCVImageBufferYCbCrMatrix_ITU_R_709_2, .shouldPropagate)
  CVPixelBufferLockBaseAddress(pixels, [])
  guard let context = CGContext(
    data: CVPixelBufferGetBaseAddress(pixels), width: width, height: height, bitsPerComponent: 8,
    bytesPerRow: CVPixelBufferGetBytesPerRow(pixels), space: srgb,
    bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
  else { fail("cannot draw into the pixel buffer") }
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  CVPixelBufferUnlockBaseAddress(pixels, [])
  if !adaptor.append(pixels, withPresentationTime: CMTime(value: Int64(index), timescale: fps)) {
    fail("append failed at frame \(index): \(String(describing: writer.error))")
  }
}
input.markAsFinished()
writer.endSession(atSourceTime: CMTime(value: Int64(files.count), timescale: fps))
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
if writer.status != .completed { fail("writing failed: \(String(describing: writer.error))") }
let bytes = (try? FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
print("wrote \(outURL.path): \(files.count) frames, \(width)x\(height), \(fps) fps, \(bytes) bytes")
