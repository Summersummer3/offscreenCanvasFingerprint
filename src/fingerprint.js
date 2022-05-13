export default async () => {
	console.log("fp collecting...")

	let keys = []
	// 2d canvas from fingerprintjs
	if (typeof OffscreenCanvas == 'undefined') {
		self.postMessage({
			res: 'unsupported',
		})
		return; 
	}

	const osc1 = new OffscreenCanvas(512, 512);
	let ctx;
	try {
		// canvas 2d is not support in Firefox old version
		ctx = osc1.getContext('2d');
	} catch (e) {
		self.postMessage({
			res: 'unsupported',
		})
		return; 
	}
	
	ctx.textBaseline = "top";
	ctx.fillStyle = "#f60";
	ctx.fillRect(125,1,62,20);

	// Replace fillText to other functions (firefox offscreencanvas not support)
	// Draw some lines
	ctx.beginPath();
	ctx.moveTo(50, 140);
	ctx.lineTo(150, 60);
	ctx.lineTo(250, 140);
	ctx.closePath();
	ctx.stroke();

	// Draw a curve
	ctx.fillStyle = "#FF0000"
	ctx.bezierCurveTo(50, 140, 150, 60, 250, 140);
	ctx.stroke();

	// Draw some pixels
	const imageData = ctx.createImageData(50, 50)
	for (let i = 0; i < imageData.data.length; i += (4 * 11)) {
		// Modify pixel data
		imageData.data[i + 0] = 190;  // R value
		imageData.data[i + 1] = 0;    // G value
		imageData.data[i + 2] = 210;  // B value
		imageData.data[i + 3] = 255;  // A value
	}
	ctx.putImageData(imageData, 150, 60);

	// webgl
	const osc2 = new OffscreenCanvas(256, 256);
	const gl = osc2.getContext('webgl');
	const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
	keys.push(gl.getParameter(debugInfo["UNMASKED_VENDOR_WEBGL"]));
	keys.push(gl.getParameter(debugInfo["UNMASKED_RENDERER_WEBGL"]));
	// TODO: Add more attributes of webgl

	function murmurhash3(key, seed) {
		var remainder, bytes, h1, h1b, c1, c2, k1, i;
	
		remainder = key.length & 3; // key.length % 4
		bytes = key.length - remainder;
		h1 = seed;
		c1 = 0xcc9e2d51;
		c2 = 0x1b873593;
		i = 0;
	
		while (i < bytes) {
			k1 =
				((key.charCodeAt(i) & 0xff)) |
				((key.charCodeAt(++i) & 0xff) << 8) |
				((key.charCodeAt(++i) & 0xff) << 16) |
				((key.charCodeAt(++i) & 0xff) << 24);
			++i;
	
			k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
			k1 = (k1 << 15) | (k1 >>> 17);
			k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
	
			h1 ^= k1;
			h1 = (h1 << 13) | (h1 >>> 19);
			h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
			h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
		}
	
		k1 = 0;
	
		switch (remainder) {
			case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
			case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
			case 1: k1 ^= (key.charCodeAt(i) & 0xff);
	
				k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
				k1 = (k1 << 15) | (k1 >>> 17);
				k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
				h1 ^= k1;
		}
	
		h1 ^= key.length;
	
		h1 ^= h1 >>> 16;
		h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= h1 >>> 13;
		h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
		h1 ^= h1 >>> 16;
	
		return h1 >>> 0;
	}

	osc1.convertToBlob().then(
		blob => {
			return blob.text();
		}
	).then(
		text => {
			keys.push(text);
			const fp = murmurhash3(keys.join('###'), 31);
			console.log("fp:", fp);
			self.postMessage({
				res: fp,
			});
		}
	)
}