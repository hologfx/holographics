<template lang="pug">
.card
	.card-header
		div {{ outputModule.name }}
		div.badge(:class="badgeType" v-if="output.currentStatus") {{ output.currentStatusMessage }}
	.card-body
		.small.text-muted.mb-3(v-if="outputModule.slug === 'BlackmagicAtemMediaPlayer'")
			| ⚠ Test Atem Media Player output with your model before production — device and firmware behaviour varies. In the worst case it can crash the Atem, requiring a power cycle to recover.
		
		template(v-if="!outputModule.providesVideoFormat")
			label.form-control-label(style="display:block") Select your resolution
			ResolutionPicker(:prop="output" :value="`${output.width}x${output.height}`" @input="updateResolution($event)")
			label.form-control-label(style="display:block" v-if="outputModule.renders.stream") Select your Framerate
			FrameratePicker(:prop="output" :value="output.framerate" @input="updateOutput({ id: output.id, data: { framerate: Number($event) }})" v-if="outputModule.renders.stream")
		Props(:props="outputModule.props", :prop_values="output.props", :submittable="false", v-if="outputModule.props.length > 0" @change="updateOutput({ id: output.id, data: { props: $event }})")

		.decklink-signal.mt-3.mb-1(v-if="output.signalFormat")
			.d-flex.justify-content-between
				span.text-muted Signal
				span
					| {{ output.width }}×{{ output.height }} @ {{ output.framerate }}fps
					span.badge.ml-2(:class="fpsBadge" v-if="output.rendering.stream") {{ output.rendering.fps }} fps
			.d-flex.justify-content-between
				span.text-muted Format
				span.text-right {{ output.signalFormat }}
			.d-flex.justify-content-between
				span.text-muted Keying
				span {{ keyingLabel }}
			.d-flex.justify-content-between(v-if="output.rendering.stream")
				span.text-muted Frames
				span {{ output.rendering.current }}
			.small.text-muted.mt-1(v-if="isOpaque") Non-keyed output is opaque — set the Render Background colour for a clean fill.

		.output-info.mt-3.mb-1(v-if="outputModule.slug === 'PNGfile'")
			.d-flex.justify-content-between
				span.text-muted Destination
				span.text-right.text-truncate(style="max-width: 60%") {{ output.props.destination || '—' }}
			.d-flex.justify-content-between(v-if="output.lastRenderCount")
				span.text-muted Last render
				span {{ output.lastRenderCount }} file(s)

		.output-info.mt-3.mb-1(v-if="outputModule.slug === 'BlackmagicAtemMediaPlayer'")
			.d-flex.justify-content-between
				span.text-muted Device
				span {{ output.AtemProductIdentifier || 'Not connected' }}
			.d-flex.justify-content-between(v-if="output.AtemMaxMediaPoolSize")
				span.text-muted Media pool
				span {{ atemPoolInfo }}
		//- pre {{ outputModule }}
	.card-footer
		button.btn.btn-outline-success.mb-3(v-if="output.refreshable" @click="refresh()") Refresh
		
		div.mb-3(v-if="outputModule.renders.stream")
			button.btn.btn-danger(v-if="output.rendering.stream" @click="stopRender()") Stop output
			button.btn.btn-success(v-else @click="renderStream()") Start output
		
		div
			button.btn.btn-danger(v-if="output.rendering.stills" @click="stopRender()") Cancel output
			el-progress.mb-3(:percentage="percentage" v-if="output.rendering.stills")
		
		div
			ConfirmButton.btn.btn-outline-danger(@perform="removeOutput(output.id)") Delete
</template>

<script>
import ConfirmButton from "@/components/general/ConfirmButton"

import Props from "@/components/Widgets/Props"
import ResolutionPicker from "@/components/Widgets/PropTypes/ResolutionPicker"
import FrameratePicker from "@/components/Widgets/PropTypes/FrameratePicker"

import Holographics from "../../lib/holographics-client"

import { mapActions } from "vuex"

export default {
	props: ["output", "outputModule"],
	data() {
		return {
			outputProps: [
				{
					name: "resolution",
					description: "Select your resolution",
					type: "ResolutionPicker"
				}
			]
		}
	},
	components: {
		ConfirmButton,
		ResolutionPicker,
		FrameratePicker,
		Props
	},
	computed: {
		percentage() {
			return Number(
				(
					(this.output.rendering.current / this.output.rendering.total) *
					100
				).toFixed(1) || 0
			)
		},
		badgeType() {
			if (this.output.currentStatus === "STATUS_OK") return "badge-success"
			if (this.output.currentStatus === "STATUS_WARNING") return "badge-warning"
			if (this.output.currentStatus === "STATUS_ERROR") return "badge-danger"
			return "badge-default"
		},
		fpsBadge() {
			return this.output.rendering.fps >= Math.round(this.output.framerate) - 1
				? "badge-success"
				: "badge-warning"
		},
		keyingLabel() {
			const labels = { internal: "Internal", external: "External" }
			return labels[this.output.props.keying] || "None"
		},
		isOpaque() {
			return !this.output.props.keying || this.output.props.keying === "none"
		},
		atemPoolInfo() {
			return `${this.output.AtemMaxMediaPoolSize} stills · target #${this.output
				.props.upload_to_still}`
		}
	},
	methods: {
		...mapActions(["updateOutput", "removeOutput"]),
		updateResolution(resString) {
			const split = resString.split("x")
			this.updateOutput({
				id: this.output.id,
				data: {
					width: Number(split[0]),
					height: Number(split[1])
				}
			})
		},
		refresh() {
			Holographics.outputs.refresh({ id: this.output.id })
		},
		renderStream() {
			Holographics.outputs.renderStream({ id: this.output.id })
		},
		stopRender() {
			Holographics.outputs.stopRender({ id: this.output.id })
		}
	}
}
</script>
