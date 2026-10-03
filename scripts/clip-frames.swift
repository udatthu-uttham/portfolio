// Writes every frame of a clip as an sRGB PNG, decoded the way macOS and iOS
// show it — for scripts/clip-edges.mjs, which reads each frame's edge colours.
//
//   swiftc -O scripts/clip-frames.swift -o <bin> && <bin> <clip.mp4> <out-dir>
//
// Why not read the frames in the browser: a <canvas> handed a playing <video>
// in Chromium returns darker colours than the video shows on a Mac (the clips
// are tagged BT.709, and the canvas skips the conversion the display applies:
// the splash's purple reads #6524fd in a canvas and shows as #7028fc, the
// colour of its own still). AVFoundation applies the same conversion the
// display does, so its frames, drawn into sRGB, match what is on screen.
//
// Prints one line per frame to stdout: "<index> <seconds>", the frame's
// presentation time, which the caller turns into the clip's colour timeline.
import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: clip-frames <clip.mp4> <out-dir>\n".data(using: .utf8)!)
  exit(2)
}
let asset = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let out = URL(fileURLWithPath: args[2], isDirectory: true)
guard let track = asset.tracks(withMediaType: .video).first else {
  FileHandle.standardError.write("no video track in \(args[1])\n".data(using: .utf8)!)
  exit(1)
}

// every frame's presentation time, from the decoded samples themselves
let reader = try AVAssetReader(asset: asset)
let samples = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(samples)
reader.startReading()
var times: [CMTime] = []
while let buffer = samples.copyNextSampleBuffer() {
  if CMSampleBufferGetNumSamples(buffer) > 0 { times.append(CMSampleBufferGetPresentationTimeStamp(buffer)) }
}
times.sort { CMTimeCompare($0, $1) < 0 }

let frames = AVAssetImageGenerator(asset: asset)
frames.requestedTimeToleranceBefore = .zero
frames.requestedTimeToleranceAfter = .zero
frames.appliesPreferredTrackTransform = true
let srgb = CGColorSpace(name: CGColorSpace.sRGB)!

for (index, time) in times.enumerated() {
  let image = try frames.copyCGImage(at: time, actualTime: nil)
  let width = image.width
  let height = image.height
  // drawn into an sRGB context, so ColorSync converts from the clip's own
  // colour space (BT.709) exactly as it does for the screen
  guard let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4, space: srgb, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { exit(1) }
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  guard let frame = context.makeImage() else { exit(1) }
  let file = out.appendingPathComponent(String(format: "frame-%04d.png", index))
  guard let destination = CGImageDestinationCreateWithURL(file as CFURL, UTType.png.identifier as CFString, 1, nil) else { exit(1) }
  CGImageDestinationAddImage(destination, frame, nil)
  CGImageDestinationFinalize(destination)
  print(index, String(format: "%.4f", CMTimeGetSeconds(time)))
}
