<template lang="pug">
#settings.mt-3
	.container-fluid
		.row
			.col-lg-9
				div.mb-3
					.category(v-for="category in categories" :category="category" :key="category")
						h3 {{ category }}
						.card-columns
							WidgetModule(v-for="widgetModule in filterWidgets(category)", :widgetModule="widgetModule", :key="widgetModule.slug", @click="createWidget(widgetModule)")
			.col-lg-3
				.alert.alert-info.mb-3
					p.mb-3 Widgets are core to how Holographics displays information. They are simple JavaScript, Vue, HTML and CSS files. You can open the source files to see how they work and customize them to your needs. Changes refresh instantly.
					button.btn.btn-secondary.mb-3.mr-2(@click.prevent="$socket.emit('open-dir', './widgets')" v-if="debug.appMode.environment == 'electron'") Open widgets directory
					p.mb-3 Sometimes after an update, not all default widgets can be safely overwritten. If this happens, use this button to reset all widgets back to defaults.
					el-popover.mb-3.mr-2(
						placement="top"
						width="300"
						trigger="hover")
						p Resetting your widgets will discard any changes you may have made to default widgets.
						ConfirmButton.btn.btn-danger(@perform="reset_widgets" slot="reference") Reset default widgets
</template>

<script>
import { mapState, mapActions } from "vuex"
import WidgetModule from "@/components/Widgets/WidgetModule"
import ConfirmButton from "@/components/general/ConfirmButton"

export default {
	components: {
		WidgetModule,
		ConfirmButton
	},
	methods: {
		...mapActions(["createWidget", "reset_widgets"]),
		filterWidgets(category) {
			return this.widgetModules.filter(
				widgetModule => widgetModule.category === category
			)
		}
	},
	computed: {
		...mapState(["widgetModules", "debug"]),
		categories() {
			return new Set(
				this.widgetModules.map(widgetModule => widgetModule.category)
			)
		}
	}
}
</script>

<style lang="scss"></style>
