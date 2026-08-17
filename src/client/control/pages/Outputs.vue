<template lang="pug">
#settings.mt-3
	.container-fluid
		.row
			.col-md-12
				h2 Outputs
				.dropdown.mb-3
					button#dropdownMenuButton.btn.btn-secondary.dropdown-toggle(type='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false')
						| Add Output
					.dropdown-menu(aria-labelledby='dropdownMenuButton')
						a.dropdown-item(@click="createOutputType('BlackmagicAtemMediaPlayer')" v-if="!outputs.find(output => output.type === 'BlackmagicAtemMediaPlayer')") Blackmagic Atem Media Player
						a.dropdown-item(@click="createOutputType('UltraStudioHD')" v-if="!outputs.find(output => output.type === 'UltraStudioHD')") Blackmagic Decklink Output
						a.dropdown-item(@click="createOutputType('PNGfile')" v-if="!outputs.find(output => output.type === 'PNGfile')") PNG file
				.card-columns
					Output(v-for="output in outputs", :key="output.id" :output="output" :outputModule="getOutputModule(output.type)")
				
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import Output from "@/components/Outputs/Output"

export default {
	components: {
		Output
	},
	computed: {
		...mapState(["outputs"]),
		...mapGetters(["getOutputModule"])
	},
	methods: {
		...mapActions(["createOutput", "updateOutput", "removeOutput"]),
		createOutputType(type) {
			this.createOutput({
				data: { type }
			})
		}
	}
}
</script>
