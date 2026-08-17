<template lang="pug">
  div
    .mb-3.d-flex.flex-wrap
      button.btn.btn-outline-primary.m-1.flex-fill(type="primary" plain @click="randomPresetPalette") Generate Palette
      button.btn.btn-outline-warning.m-1.flex-fill(type="warning" plain @click="clearActivePalette" v-if="activePalette.length > 0") Clear Palette
    .mb-3(v-if="activePalette.length > 0")
      h4 Active Palette
      PalettePreview(:palette="activePalette")
    h4 Palette Library
    el-button.btn-block(type="primary" v-if="!creating" @click="creating = true") Create Palette
    PresetDropdown(
      v-if="!creating && !editing && palettes.length > 0"
      :presets="palettes"
      @activate="activatePalette",
      @edit="startEditing",
      @remove="removePalette"
      ).mb-3 Palette Presets
    PaletteForm.mt-3(v-if="creating" @finished="createPalette" @closeForm="creating = false" :palette="{ colors: activePalette }") Create
    PaletteForm.mt-3(v-if="editing" @finished="updatePalette" @closeForm="editing = false" :palette="editing") Update
</template>

<script>
import PresetDropdown from "@/components/general/PresetDropdown"
import PaletteForm from "./PaletteForm"
import PalettePreview from "./PalettePreview"

import { mapState, mapActions, mapGetters } from "vuex"
import colorPresets from "@/util/colors.json"

export default {
	components: {
		PresetDropdown,
		PaletteForm,
		PalettePreview
	},
	data() {
		return {
			creating: false,
			editing: false
		}
	},
	computed: {
		...mapState(["activePalette", "palettes"]),
		...mapGetters(["getPaletteById"])
	},
	methods: {
		startEditing(palette) {
			this.editing = this.getPaletteById(palette.id)
		},
		randomPresetPalette() {
			this.$store.dispatch("updateState", {
				activePalette:
					colorPresets[Math.floor(Math.random() * colorPresets.length)]
			})
		},
		clearActivePalette() {
			this.$store.dispatch("setState", {
				activePalette: []
			})
		},
		...mapActions([
			"createPalette",
			"activatePalette",
			"removePalette",
			"updatePalette"
		])
	}
}
</script>
