# Category images

Category icons for the Home page are loaded from this folder.

- **Row 1:** Categories.png, Kurti.png, Western.png, Saree.png, Men.png, Electronics.png
- **Row 2:** Home Tex.png, Jewellery.png, Beauty.png, Footwear.png, Accessories.png, SPorts.png

Every tile but Categories.png is drawn by `scripts/proto-catalog-art.mjs`
(`CATEGORY_TILES`) and written here by `node scripts/proto-synthetic-images.mjs --draw`,
under the names the bundle asks for (2026-10-03: they were photographs of models
and products). Change the drawing there, not the file.
