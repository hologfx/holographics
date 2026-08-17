// Pixel format converters for DeckLink output.
//
// Electron's nativeImage.toBitmap() is always 8-bit BGRA. DeckLink devices
// want different formats per display mode, and macadam does no conversion of
// its own, so we convert here before displayFrame().

const clamp = v => (v < 0 ? 0 : v > 255 ? 255 : v)

// BGRA (8-bit) -> UYVY (8-bit YUV 4:2:2). Byte order per pixel pair: U Y0 V Y1.
// BT.709 for HD (height >= 720), BT.601 below; studio swing (Y 16-235, C 16-240).
// U/V are sampled from the first pixel of each pair (nearest 4:2:2).
function bgraToUYVY(width, height, data) {
	const hd = height >= 720
	const KR = hd ? 0.2126 : 0.299
	const KB = hd ? 0.0722 : 0.114
	const KG = 1 - KR - KB

	// Fixed-point Q8 coefficients, precomputed once.
	const S = 256
	const yR = ((KR * 219 / 255) * S) | 0
	const yG = ((KG * 219 / 255) * S) | 0
	const yB = ((KB * 219 / 255) * S) | 0
	const uR = ((-0.5 * KR / (1 - KB) * 224 / 255) * S) | 0
	const uG = ((-0.5 * KG / (1 - KB) * 224 / 255) * S) | 0
	const uB = ((0.5 * 224 / 255) * S) | 0
	const vR = ((0.5 * 224 / 255) * S) | 0
	const vG = ((-0.5 * KG / (1 - KR) * 224 / 255) * S) | 0
	const vB = ((-0.5 * KB / (1 - KR) * 224 / 255) * S) | 0

	const yOff = 16 * S + S / 2 // + half for rounding on the >> 8
	const cOff = 128 * S + S / 2

	const out = Buffer.allocUnsafe(width * height * 2)
	const n = width * height
	let si = 0
	let di = 0
	for (let p = 0; p < n; p += 2) {
		const b1 = data[si], g1 = data[si + 1], r1 = data[si + 2]
		const b2 = data[si + 4], g2 = data[si + 5], r2 = data[si + 6]

		const y1 = (yOff + yR * r1 + yG * g1 + yB * b1) >> 8
		const y2 = (yOff + yR * r2 + yG * g2 + yB * b2) >> 8
		const u = (cOff + uR * r1 + uG * g1 + uB * b1) >> 8
		const v = (cOff + vR * r1 + vG * g1 + vB * b1) >> 8

		out[di] = clamp(u)
		out[di + 1] = clamp(y1)
		out[di + 2] = clamp(v)
		out[di + 3] = clamp(y2)

		si += 8
		di += 4
	}
	return out
}

// Premultiply (associate) the alpha into the RGB channels of a BGRA buffer.
// Electron renders with straight alpha (transparent areas keep their RGB, e.g.
// the white canvas_bg), but DeckLink keying expects premultiplied alpha, so
// without this transparent areas show up as a solid white fill.
function premultiplyBGRA(width, height, data) {
	const len = width * height * 4
	const out = Buffer.allocUnsafe(len)
	for (let i = 0; i < len; i += 4) {
		const a = data[i + 3]
		out[i] = (data[i] * a + 127) / 255 | 0 // B
		out[i + 1] = (data[i + 1] * a + 127) / 255 | 0 // G
		out[i + 2] = (data[i + 2] * a + 127) / 255 | 0 // R
		out[i + 3] = a
	}
	return out
}

// BGRA (8-bit) -> ARGB (8-bit). Plain byte reorder for DeckLinks that key in
// ARGB rather than BGRA.
function bgraToARGB(width, height, data) {
	const len = width * height * 4
	const out = Buffer.allocUnsafe(len)
	for (let i = 0; i < len; i += 4) {
		out[i] = data[i + 3] // A
		out[i + 1] = data[i + 2] // R
		out[i + 2] = data[i + 1] // G
		out[i + 3] = data[i] // B
	}
	return out
}

// BGRA (8-bit) -> the Blackmagic ATEM media-pool format: packed 10-bit YUVA
// 4:2:2:4, two pixels per 8 bytes. Used when uploading stills to the ATEM.
function bgraToAtemYUVA(width, height, data) {
	// BT.709 or BT.601
	const KR = height >= 720 ? 0.2126 : 0.299
	const KB = height >= 720 ? 0.0722 : 0.114
	const KG = 1 - KR - KB

	const KRi = 1 - KR
	const KBi = 1 - KB

	const YRange = 219
	const CbCrRange = 224
	const HalfCbCrRange = CbCrRange / 2

	const YOffset = 16 << 8
	const CbCrOffset = 128 << 8

	const KRoKBi = (KR / KBi) * HalfCbCrRange
	const KGoKBi = (KG / KBi) * HalfCbCrRange
	const KBoKRi = (KB / KRi) * HalfCbCrRange
	const KGoKRi = (KG / KRi) * HalfCbCrRange

	const buffer = Buffer.alloc(width * height * 4)
	let i = 0
	while (i < width * height * 4) {
		const r1 = data[i + 2]
		const g1 = data[i + 1]
		const b1 = data[i + 0]

		const r2 = data[i + 6]
		const g2 = data[i + 5]
		const b2 = data[i + 4]

		const a1 = ((data[i + 3] << 2) * 219) / 255 + (16 << 2)
		const a2 = ((data[i + 7] << 2) * 219) / 255 + (16 << 2)

		const y16a =
			YOffset + KR * YRange * r1 + KG * YRange * g1 + KB * YRange * b1
		const cb16 = CbCrOffset + (-KRoKBi * r1 - KGoKBi * g1 + HalfCbCrRange * b1)
		const y16b =
			YOffset + KR * YRange * r2 + KG * YRange * g2 + KB * YRange * b2
		const cr16 = CbCrOffset + (HalfCbCrRange * r1 - KGoKRi * g1 - KBoKRi * b1)

		const y1 = Math.round(y16a) >> 6
		const u1 = Math.round(cb16) >> 6
		const y2 = Math.round(y16b) >> 6
		const v2 = Math.round(cr16) >> 6

		buffer[i + 0] = a1 >> 4
		buffer[i + 1] = ((a1 & 0x0f) << 4) | (u1 >> 6)
		buffer[i + 2] = ((u1 & 0x3f) << 2) | (y1 >> 8)
		buffer[i + 3] = y1 & 0xff
		buffer[i + 4] = a2 >> 4
		buffer[i + 5] = ((a2 & 0x0f) << 4) | (v2 >> 6)
		buffer[i + 6] = ((v2 & 0x3f) << 2) | (y2 >> 8)
		buffer[i + 7] = y2 & 0xff
		i = i + 8
	}
	return buffer
}

module.exports = { bgraToUYVY, bgraToARGB, premultiplyBGRA, bgraToAtemYUVA }
