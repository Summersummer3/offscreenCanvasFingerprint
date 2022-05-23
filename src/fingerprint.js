export default async () => {
	function offscreenCanvasRender() {
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
	
		return osc1;
	}

	function nativeFuncCheck(object, func) {
		return object[func].toString().indexOf("[native code]") != -1 ? "1" : "0";
	}

	function webGlRenderingContextFunctions(gl) {
		let funcRes = "";
	
		const functions = [
			'viewport',
			'vertexAttribPointer',
			'vertexAttrib4fv',
			'vertexAttrib4f',
			'vertexAttrib3fv',
			'vertexAttrib3f',
			'vertexAttrib2fv',
			'vertexAttrib2f',
			'vertexAttrib1fv',
			'vertexAttrib1f',
			'validateProgram',
			'useProgram',
			'uniformMatrix4fv',
			'uniformMatrix3fv',
			'uniformMatrix2fv',
			'uniform4iv',
			'uniform4i',
			'uniform4fv',
			'uniform4f',
			'uniform3iv',
			'uniform3i',
			'uniform3fv',
			'uniform3f',
			'uniform2iv',
			'uniform2i',
			'uniform2fv',
			'uniform2f',
			'uniform1iv',
			'uniform1i',
			'uniform1fv',
			'uniform1f',
			'texSubImage2D',
			'texParameteri',
			'texParameterf',
			'texImage2D',
			'stencilOpSeparate',
			'stencilOp',
			'stencilMaskSeparate',
			'stencilMask',
			'stencilFuncSeparate',
			'stencilFunc',
			'shaderSource',
			'scissor',
			'sampleCoverage',
			'renderbufferStorage',
			'readPixels',
			'polygonOffset',
			'pixelStorei',
			'linkProgram',
			'lineWidth',
			'isTexture',
			'isShader',
			'isRenderbuffer',
			'isProgram',
			'isFramebuffer',
			'isEnabled',
			'isContextLost',
			'isBuffer',
			'hint',
			'getVertexAttribOffset',
			'getVertexAttrib',
			'getUniformLocation',
			'getUniform',
			'getTexParameter',
			'getSupportedExtensions',
			'getShaderSource',
			'getShaderPrecisionFormat',
			'getShaderParameter',
			'getShaderInfoLog',
			'getRenderbufferParameter',
			'getProgramParameter',
			'getProgramInfoLog',
			'getParameter',
			'getFramebufferAttachmentParameter',
			'getExtension',
			'getError',
			'getContextAttributes',
			'getBufferParameter',
			'getAttribLocation',
			'getAttachedShaders',
			'getActiveUniform',
			'getActiveAttrib',
			'generateMipmap',
			'frontFace',
			'framebufferTexture2D',
			'framebufferRenderbuffer',
			'flush',
			'finish',
			'enableVertexAttribArray',
			'enable',
			'drawElements',
			'drawArrays',
			'disableVertexAttribArray',
			'disable',
			'detachShader',
			'depthRange',
			'depthMask',
			'depthFunc',
			'deleteTexture',
			'deleteShader',
			'deleteRenderbuffer',
			'deleteProgram',
			'deleteFramebuffer',
			'deleteBuffer',
			'cullFace',
			'createTexture',
			'createShader',
			'createRenderbuffer',
			'createProgram',
			'createFramebuffer',
			'createBuffer',
			'copyTexSubImage2D',
			'copyTexImage2D',
			'compressedTexSubImage2D',
			'compressedTexImage2D',
			'compileShader',
			'colorMask',
			'clearStencil',
			'clearDepth',
			'clearColor',
			'clear',
			'checkFramebufferStatus',
			'bufferSubData',
			'bufferData',
			'blendFuncSeparate',
			'blendFunc',
			'blendEquationSeparate',
			'blendEquation',
			'blendColor',
			'bindTexture',
			'bindRenderbuffer',
			'bindFramebuffer',
			'bindBuffer',
			'bindAttribLocation',
			'attachShader',
			'activeTexture'
		];
	
		for (let i = 0; i < functions.length; i++) {
			funcRes += nativeFuncCheck(gl, functions[i]);
		}
	
		return funcRes;
	}

	function webGlExtensions(gl) {
		let res = []
		// 1. GPU info
		const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
		res.push(gl.getParameter(debugInfo["UNMASKED_VENDOR_WEBGL"]));
		res.push(gl.getParameter(debugInfo["UNMASKED_RENDERER_WEBGL"]));

		// 2. Some native functions check
		const loseCtx = gl.getExtension("WEBGL_lose_context");
		const drawBufs = gl.getExtension("WEBGL_draw_buffers");
		let funcRes = nativeFuncCheck(loseCtx, "loseContext") + nativeFuncCheck(loseCtx, "restoreContext") + nativeFuncCheck(drawBufs, "drawBuffersWEBGL");
		res.push(funcRes);

		// 3. Some numeric value
		let sum = 0;
		for (let num1 in drawBufs) {
			if (typeof drawBufs[num1] === "number")
				sum += drawBufs[num1];
		}
		const s3tc_srgb = gl.getExtension("WEBGL_compressed_texture_s3tc_srgb")
		for (let num2 in s3tc_srgb) {
			if (typeof s3tc_srgb[num2] === "number")
				sum += s3tc_srgb[num2];
		}

		res.push("" + sum);
		return res;
	}

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

	console.log("fp collecting...")

	let keys = []
	// 2d canvas from fingerprintjs
	if (typeof OffscreenCanvas == 'undefined') {
		self.postMessage({
			res: 'unsupported',
		})
		return; 
	}

	let osc1 = offscreenCanvasRender();

	// webgl
	const osc2 = new OffscreenCanvas(256, 256);
	const gl = osc2.getContext('webgl');
	// Check webglRendererContext functions
	keys.push(webGlRenderingContextFunctions(gl));
	keys = keys.concat(webGlExtensions(gl));
	// TODO: Add more attributes of webgl

	osc1.convertToBlob().then(
		blob => {
			return blob.text();
		}
	).then(
		text => {
			keys.push(text);
			console.log(keys);
			const fp = murmurhash3(keys.join('##'), 31);
			console.log("fp:", fp);
			self.postMessage({
				res: fp,
			});
		}
	)
}