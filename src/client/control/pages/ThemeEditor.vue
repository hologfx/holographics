<template lang="pug">
  .editor
    .d-flex.mb-2
      h3(:class="{ modified }") {{openTheme}}
        ValidationBadge.ml-2(:status="validationStatus" :error="themeError")
        a.badge.btn.btn-warning.btn-sm.text-light.ml-2(v-if="!isActiveTheme" @click="$store.dispatch('updateState', { style: { activeTheme: openTheme } });") Activate this theme
    .d-flex.mb-2
      el-select(v-model="openTheme" filterable placeholder="Open" @change="open($event)").mr-1
        el-option(v-for="theme in themes" :key="theme.filename" :label="theme.filename" :value="theme.filename")
      el-input#filename.mr-1(
        type="text"
        placeholder="Filename"
        v-model="newfilename"
        @blur="sanitizefilename"
        @input="modified = true")
      ConfirmButton.btn.btn-danger.mr-1(
        @perform="delete_theme"
        v-if=`isModified && isDefault`
        ) Revert to default
      ConfirmButton.btn.btn-danger.mr-1(
        @perform="delete_theme"
        v-if=`!isDefault`
        ) Delete
      button.btn.btn-danger.mr-1(v-if="modified == true", @click="discard") Discard
      button.btn.btn-success(:disabled="modified == false", @click="save_theme") Save
    hr
    .d-flex.mb-2
      //- ELEMENTS
      el-select.mr-1(placeholder="Elements" value="" @change="insertBlock($event)")
        el-option(v-for="element in elements" :value="element" :key="element")
      //- HEADERS
      el-select.mr-1(placeholder="Headers" value="" @change="insertBlock($event)")
        el-option(v-for="header in headers" :value="header" :key="header")
      //- BLOCKS
      el-select.mr-1(placeholder="Blocks" value="" @change="insertBlock($event)")
        el-option(v-for="block in blocks" :value="block" :key="block")
      //- VARIABLES
      el-select.mr-1(placeholder="Variables" value="" @change="insert($event)")
        el-option(v-for="colorvariable in colorvariables" :value="colorvariable" :key="colorvariable")
          ColorPicker.p-2(:colorvariable="colorvariable") {{colorvariable}}
        el-option(v-for="sizevariable in sizevariables" :value="sizevariable" :key="sizevariable") {{sizevariable}}
      //- FONTS
      el-select.mr-1(placeholder="Fonts" value="" @change="insertGoogleFont($event)" filterable :default-first-option="true")
        template(v-for="fontFamily in fonts" :fontFamily="fontFamily")
          el-option(v-for=`font, index in fontFamily` :key="font.family+index.toString()" :value="font" :font="font")
            span(:style="{ 'font-family': font.family, 'font-weight': font.weight, 'font-style': font.style }")
              | {{ font.family }} - {{ font.weight }} - {{ font.style }}
      //- SYSTEM FONTS
      el-popover(
      placement="bottom"
      width="300"
      trigger="hover")
        strong Note: 
        | font must be installed on all systems running Holographics or a renderer browser window!
        span.badge.badge-light.ml-2.p-1(v-if="themeError" slot="reference")
        el-select.mr-1(slot="reference" placeholder="System Fonts" value="" @change="insertFont($event)" filterable :default-first-option="true")
          el-option(v-for=`font in systemfonts` :key="font" :value="font" :font="font")
            span(:style="{ 'font-family': font }") {{font}}
      
    .row
      .col-md-12
        Ace(ref="ace")

</template>

<script>
import Ace from "@/components/ThemeEditor/Ace"

import ColorPicker from "@/components/ThemeEditor/ColorPicker"
import ValidationBadge from "@/components/ThemeEditor/ValidationBadge"
import ConfirmButton from "@/components/general/ConfirmButton"

import Holographics from "../lib/holographics-client"

import _ from "lodash"

import { Timer } from "@/util/utils"

import { mapState, mapGetters } from "vuex"
const timer = new Timer(400)

const fonts = require("../../public/google_fonts/google_fonts.json")

export default {
	name: "ThemeEditor",
	components: {
		Ace,
		ColorPicker,
		ValidationBadge,
		ConfirmButton
	},
	data() {
		return {
			openTheme: "",
			theme: {},
			themeError: "",
			newfilename: "",
			validating: false,
			modified: false,
			modified_since_last_validation: false,
			elements: [".widget"],
			headers: ["h2", "h3", "h4"],
			blocks: ["span", "p", "i"],
			fonts,
			systemfonts: [],
			colorvariables: [
				"$primary_color",
				"$secondary_color",
				"$background_a",
				"$background_b",
				"$canvas_bg",
				"$text_a",
				"$text_b"
			],
			sizevariables: ["$font_size", "$global_padding", "$widget_padding"]
		}
	},
	mounted: function() {
		this.$store.dispatch("getThemes").then(() => {
			this.open(this.style.activeTheme)
			this.$refs.ace.editor.on("change", () => {
				this.modified = true
				this.modified_since_last_validation = true
				this.themeError = ""

				timer.update()
				timer.removeAllListeners("timer-finished")
				timer.once("timer-finished", () => {
					this.validate()
				})
			})

			this.$refs.ace.editor.commands.addCommand({
				name: "save",
				bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
				exec: editor => {
					this.save_theme()
				}
			})
		})
		Holographics.fonts.get().then(fonts => {
			// Filter fonts starting with .
			this.systemfonts = fonts.filter(
				itemPath => !/(^|\/)\.[^\/\.]/g.test(itemPath)
			)
		})
	},
	beforeRouteLeave(to, from, next) {
		if (this.modified) {
			const answer = window.confirm(
				"Do you really want to leave? You have unsaved changes!"
			)
			if (answer) {
				next()
			} else {
				next(false)
				return
			}
		}
		next()
	},
	computed: {
		validationStatus() {
			if (this.modified_since_last_validation) return "pending"
			if (this.themeError === "" && !this.modified_since_last_validation)
				return "valid"
			if (this.themeError !== "") return "invalid"
			return "pending"
		},
		isModified() {
			return _.get(this, "theme.originality.modified")
		},
		isDefault() {
			return _.get(this, "theme.originality.default")
		},
		isActiveTheme() {
			return this.style.activeTheme === this.openTheme
		},
		...mapGetters(["getThemeByFilename"]),
		...mapState(["themes", "style"])
	},
	methods: {
		open(filename) {
			if (!this.$refs.ace) return
			this.$refs.ace.setContents(this.getThemeByFilename(filename).contents)
			this.modified = false
			this.openTheme = filename
			this.newfilename = filename
			this.theme = this.getThemeByFilename(this.openTheme)
		},
		insertFont(font) {
			this.insert("font-family: '" + font + "';\n")
		},
		insertGoogleFont(font) {
			this.insert("font-family: '" + font.family + "';\n")
			this.insert("font-style: " + font.style + ";\n")
			this.insert("font-weight: " + font.weight + ";\n")
		},
		insertBlock(block) {
			this.insert(block + " {\n\t\n}")
			this.$refs.ace.editor.navigateLeft(2)
		},
		insert(text) {
			this.$refs.ace.editor.session.insert(
				this.$refs.ace.editor.getCursorPosition(),
				text
			)
			this.$refs.ace.editor.focus()
		},
		validate() {
			// Since we're compiling now we're no longer in modified state
			this.modified_since_last_validation = false
			Holographics.themes
				.validate({ data: { contents: this.$refs.ace.editor.getValue() } })
				.then(response => {
					if (response.error) this.themeError = response.error.message
				})
		},
		sanitizefilename() {
			if (!this.newfilename.includes(".styl")) this.newfilename += ".styl"
		},
		discard() {
			this.open(this.openTheme)
		},
		save_theme() {
			this.$store
				.dispatch("updateTheme", {
					contents: this.$refs.ace.editor.getValue(),
					filename: this.newfilename
				})
				.then(() => {
					this.modified = false
					this.openTheme = this.newfilename
					this.newfilename = this.newfilename
					this.$store.dispatch("getThemes").then(() => {
						this.theme = this.getThemeByFilename(this.newfilename)
						// this.open(this.newfilename)
					})
				})
		},
		delete_theme() {
			this.$store.dispatch("removeTheme", this.openTheme).then(() => {
				this.$store.dispatch("getThemes").then(() => {
					this.open(this.style.activeTheme)
				})
			})
		}
	}
}
</script>

<style lang="scss">
.modified {
	font-style: italic;
}
</style>
