const assert = require("assert")
const {
	bgraToUYVY,
	bgraToARGB,
	premultiplyBGRA,
	bgraToAtemYUVA
} = require("../src/server/lib/pixelconvert")

// Build a 2x1 BGRA frame (one UYVY pair) from a single BGRA pixel.
const pair = (b, g, r, a = 255) => Buffer.from([b, g, r, a, b, g, r, a])

describe("pixelconvert", () => {
	describe("bgraToUYVY", () => {
		const near = (actual, expected, tol = 2) =>
			assert(Math.abs(actual - expected) <= tol, `${actual} != ~${expected}`)

		it("packs UYVY as U Y0 V Y1 with the right length", () => {
			const out = bgraToUYVY(2, 1, pair(0, 0, 0))
			assert.strictEqual(out.length, 2 * 1 * 2)
		})

		it("white -> Y~235, U/V~128", () => {
			const [u, y, v] = bgraToUYVY(2, 1, pair(255, 255, 255))
			near(y, 235)
			near(u, 128)
			near(v, 128)
		})

		it("black -> Y~16, U/V~128", () => {
			const [u, y, v] = bgraToUYVY(2, 1, pair(0, 0, 0))
			near(y, 16)
			near(u, 128)
			near(v, 128)
		})

		it("mid-grey -> U=V=128 (no chroma)", () => {
			const [u, , v] = bgraToUYVY(2, 1, pair(128, 128, 128))
			near(u, 128)
			near(v, 128)
		})

		it("pure red -> positive Cr (V > 128)", () => {
			const [u, , v] = bgraToUYVY(2, 1, pair(0, 0, 255))
			assert(v > 150, `expected V>150, got ${v}`)
			assert(u < 128, `expected U<128, got ${u}`)
		})
	})

	describe("bgraToARGB", () => {
		it("reorders B,G,R,A -> A,R,G,B", () => {
			const out = bgraToARGB(1, 1, Buffer.from([10, 20, 30, 40]))
			assert.deepStrictEqual([...out], [40, 30, 20, 10])
		})

		it("output length is w*h*4", () => {
			assert.strictEqual(bgraToARGB(4, 4, Buffer.alloc(64)).length, 64)
		})
	})

	describe("premultiplyBGRA", () => {
		it("leaves opaque pixels unchanged", () => {
			const out = premultiplyBGRA(1, 1, Buffer.from([10, 20, 30, 255]))
			assert.deepStrictEqual([...out], [10, 20, 30, 255])
		})

		it("zeroes RGB of fully transparent pixels (white -> black)", () => {
			const out = premultiplyBGRA(1, 1, Buffer.from([255, 255, 255, 0]))
			assert.deepStrictEqual([...out], [0, 0, 0, 0])
		})

		it("scales RGB by alpha for semi-transparent pixels", () => {
			const out = premultiplyBGRA(1, 1, Buffer.from([200, 100, 50, 128]))
			// 128/255 ~= 0.502
			assert.deepStrictEqual([...out], [100, 50, 25, 128])
		})
	})

	// Characterisation tests — pin the packed-format behaviour, not a rewrite.
	describe("bgraToAtemYUVA", () => {
		// One UYVY pair (2px) per 8 output bytes.
		const pair = (b, g, r, a = 255) => Buffer.from([b, g, r, a, b, g, r, a])

		it("output length is w*h*4", () => {
			assert.strictEqual(bgraToAtemYUVA(2, 1, pair(0, 0, 0)).length, 8)
			assert.strictEqual(bgraToAtemYUVA(4, 4, Buffer.alloc(64)).length, 64)
		})

		it("is deterministic for identical input", () => {
			const a = bgraToAtemYUVA(2, 1, pair(120, 80, 200))
			const b = bgraToAtemYUVA(2, 1, pair(120, 80, 200))
			assert.deepStrictEqual([...a], [...b])
		})

		it("black opaque -> luma at studio-swing floor (~16, 10-bit ~64)", () => {
			// y1 occupies bits across out[2] (low 2 bits) and out[3] (8 bits).
			const out = bgraToAtemYUVA(2, 1, pair(0, 0, 0))
			const y1 = ((out[2] & 0x03) << 8) | out[3]
			assert(Math.abs(y1 - 64) <= 4, `expected 10-bit luma ~64, got ${y1}`)
		})

		it("white opaque -> luma near studio-swing ceiling (~940)", () => {
			const out = bgraToAtemYUVA(2, 1, pair(255, 255, 255))
			const y1 = ((out[2] & 0x03) << 8) | out[3]
			assert(Math.abs(y1 - 940) <= 6, `expected 10-bit luma ~940, got ${y1}`)
		})
	})
})
