/**
 * Generates src/client/public/THIRD-PARTY-LICENSES.md — the full attribution bundle for
 * everything Holographics redistributes: the npm packages that ship inside the packaged
 * app / client bundle, and the font families committed under src/client/public.
 *
 * Output lands in src/client/public so webpack's existing CopyPlugin ships it with the
 * app (dist/client/public) and serves it over HTTP. Run via `npm run build:notices`.
 *
 * ponytail: plain fs walk instead of a license-checker dependency; the only non-stdlib
 * module is ttfinfo, already installed as a production dependency via system-font-families.
 */

const fs = require("fs")
const path = require("path")
const ttfinfo = require("ttfinfo")

const ROOT = path.resolve(__dirname, "..")
const FONT_DIR = path.join(ROOT, "src/client/public/google_fonts")
const TEXTS = path.join(__dirname, "license-texts")
const OUT = path.join(ROOT, "src/client/public/THIRD-PARTY-LICENSES.md")

/**
 * devDependencies webpack inlines into the client bundle. They are not production
 * dependencies, but they are redistributed, so they need attribution all the same.
 */
const CLIENT_BUNDLED = [
	"@fortawesome/fontawesome-free",
	"bootstrap",
	"brace",
	"element-ui",
	"gsap",
	"holographics-client-sdk",
	"jquery",
	"mousetrap",
	"popper.js",
	"vue",
	"vue-markdown",
	"vue-router",
	"vue-socket.io",
	"vuedraggable",
	"vuex"
]

const MIT_TEXT = `Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

const ISC_TEXT = `Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`

const unresolved = []

/** Node-style lookup: <fromDir>/node_modules/<name>, then walk up to the repo root. */
function resolvePkgDir(name, fromDir) {
	let dir = fromDir
	for (;;) {
		const candidate = path.join(dir, "node_modules", name)
		if (fs.existsSync(path.join(candidate, "package.json"))) return candidate
		if (dir === ROOT) return null
		const up = path.dirname(dir)
		if (up === dir) return null
		dir = up
	}
}

function readPkg(dir) {
	return JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"))
}

/**
 * Walks the installed dependency graph from a set of seed package names. peerDependencies
 * are deliberately not followed: electron-builder-notarize peer-depends on the whole
 * electron-builder toolchain, which is build-time only and never ends up in the app.
 */
function closure(seeds) {
	const found = new Map()
	const visit = (name, fromDir) => {
		const dir = resolvePkgDir(name, fromDir)
		if (!dir) {
			unresolved.push(name)
			return
		}
		if (found.has(dir)) return
		const pkg = readPkg(dir)
		found.set(dir, pkg)
		for (const dep of Object.keys(pkg.dependencies || {})) visit(dep, dir)
		for (const dep of Object.keys(pkg.optionalDependencies || {})) {
			if (resolvePkgDir(dep, dir)) visit(dep, dir)
		}
	}
	for (const seed of seeds) visit(seed, ROOT)
	return found
}

function spdx(pkg) {
	if (typeof pkg.license === "string") return pkg.license
	if (pkg.license && pkg.license.type) return pkg.license.type
	if (Array.isArray(pkg.licenses)) return pkg.licenses.map(l => l.type || l).join(" OR ")
	if (pkg.licenses) return pkg.licenses.type || String(pkg.licenses)
	return null
}

function authorName(pkg) {
	const a = pkg.author
	if (!a) return null
	return typeof a === "string" ? a.replace(/\s*[<(].*$/, "").trim() : a.name || null
}

/**
 * Verbatim upstream license text. ~20 shipped packages ship none at all, so fall back to
 * the canonical text for their declared SPDX id with a copyright line built from the
 * package author — the notice MIT and ISC actually require.
 */
function licenseText(dir, pkg) {
	const file = fs
		.readdirSync(dir)
		.filter(f => /^(licen[cs]e|copying)/i.test(f))
		.filter(f => fs.statSync(path.join(dir, f)).isFile())
		.sort()[0]
	if (file) return fs.readFileSync(path.join(dir, file), "utf8").trim()

	const id = spdx(pkg)
	const holder = authorName(pkg) || `the ${pkg.name} contributors`
	if (id === "MIT" || id === "MIT/X11") return `Copyright (c) ${holder}\n\n${MIT_TEXT}`
	if (id === "ISC") return `Copyright (c) ${holder}\n\n${ISC_TEXT}`
	if (id) {
		// A declared id that is not an SPDX expression means proprietary terms hosted
		// elsewhere (GSAP) — NOTICE.md carries the prose those need.
		const proprietary = !/^[\w.+-]+( (AND|OR|WITH) [\w.+-]+)*$/.test(id.replace(/[()]/g, ""))
		return [
			`Copyright (c) ${holder}.`,
			`Upstream ships no license file. Declared license: ${id.replace(/\.$/, "")}`,
			proprietary ? "Not an open-source license — see NOTICE.md." : null
		]
			.filter(Boolean)
			.join("\n")
	}
	return `Upstream declares no license and ships no license file. Copyright (c) ${holder}.`
}

function packageSections() {
	const rootPkg = readPkg(ROOT)
	const pkgs = closure([...Object.keys(rootPkg.dependencies), ...CLIENT_BUNDLED])

	// One entry per name@version — the same package can be installed at several depths.
	const byId = new Map()
	for (const [dir, pkg] of pkgs) {
		const id = `${pkg.name}@${pkg.version}`
		if (!byId.has(id)) byId.set(id, { pkg, text: licenseText(dir, pkg) })
	}

	const ids = [...byId.keys()].sort((a, b) => a.localeCompare(b))
	const body = ids.map(id => {
		const { pkg, text } = byId.get(id)
		const url = pkg.homepage || (pkg.repository && (pkg.repository.url || pkg.repository))
		return [
			`## ${id}`,
			"",
			`License: ${spdx(pkg) || "not declared"}`,
			url ? `Homepage: ${String(url).replace(/^git\+|\.git$/g, "")}` : null,
			"",
			"```",
			text,
			"```"
		]
			.filter(l => l !== null)
			.join("\n")
	})

	return { count: ids.length, body: body.join("\n\n") }
}

/**
 * Per-family copyright and license read straight out of each bundled TTF's name table
 * (record 0 = copyright, 13/14 = license), so the attribution matches the exact font
 * files shipped rather than a hand-maintained list.
 */
function fontSection() {
	const families = new Map()
	for (const file of fs.readdirSync(FONT_DIR).sort()) {
		if (!file.endsWith(".ttf")) continue
		const family = file.split("_")[0].replace(/\+/g, " ")
		if (families.has(family)) continue
		let name
		try {
			name = ttfinfo.getSync(path.join(FONT_DIR, file)).tables.name
		} catch (e) {
			unresolved.push(`font ${file}`)
			continue
		}
		const copyright = (name["0"] || "")
			.replace(/\s+/g, " ")
			.replace(/\|/g, "\\|")
			.trim()
		const declared = `${name["13"] || ""} ${name["14"] || ""}`
		const license = /apache/i.test(declared)
			? "Apache-2.0"
			: /ubuntu font licen/i.test(copyright)
				? "Ubuntu Font Licence 1.0"
				: "OFL-1.1"
		families.set(family, { copyright, license })
	}

	const rows = [...families.keys()]
		.sort((a, b) => a.localeCompare(b))
		.map(f => `| ${f} | ${families.get(f).copyright || "—"} | ${families.get(f).license} |`)

	const texts = ["OFL-1.1", "UBUNTU-FONT-LICENCE-1.0", "APACHE-2.0"].map(
		n => `### ${n}\n\n\`\`\`\n${fs.readFileSync(path.join(TEXTS, `${n}.txt`), "utf8").trim()}\n\`\`\``
	)

	return {
		count: families.size,
		body: [
			"The font families below are bundled under `src/client/public/google_fonts/`.",
			"Copyright and license are read from each font file's own name table.",
			"",
			"| Family | Copyright | License |",
			"| --- | --- | --- |",
			...rows,
			"",
			"Font license texts follow in full.",
			"",
			...texts
		].join("\n")
	}
}

const packages = packageSections()
const fonts = fontSection()

const doc = `# Third-party licenses

Generated by \`npm run build:notices\` — do not edit by hand.

Holographics itself is licensed under the GNU AGPL-3.0 (see \`LICENSE.md\`). This file
collects the copyright notices and license texts of the third-party software and fonts
Holographics redistributes. Curated notices for components needing more than a license
text — including GSAP, which is **not** covered by the AGPL grant — are in \`NOTICE.md\`.

- ${packages.count} npm packages (production dependencies plus the devDependencies webpack
  inlines into the client bundle)
- ${fonts.count} bundled font families

# Fonts

${fonts.body}

# npm packages

${packages.body}
`

fs.writeFileSync(OUT, doc)
console.log(
	`Wrote ${path.relative(ROOT, OUT)}: ${packages.count} packages, ${fonts.count} font families.`
)
if (unresolved.length) {
	console.warn(`WARNING: could not resolve: ${[...new Set(unresolved)].sort().join(", ")}`)
	process.exitCode = 1
}
