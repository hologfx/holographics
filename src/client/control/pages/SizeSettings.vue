<template lang="pug">
#settings.mt-3
  .container-fluid
    .row
      .col-md-12
        h2 Size Settings
        p.lead These are 'global' size settings. You can override them per widget.
        h4 Auto-reposition widgets
        el-radio(v-model="widget_repositioning" :label="true" border) Yes
        el-radio(v-model="widget_repositioning" :label="false" border) No
        h4 Distance between widgets
        el-slider(v-model="widget_offset" show-input :min="0" :max="40")
        h4 Render Edge Margin
        el-slider(v-model="global_padding" show-input :min="0" :max="80")
        h4 Widget Padding
        el-slider(v-model="widget_padding" show-input :min="0" :max="40")
        h4 Font Size
        el-slider(v-model="font_size" show-input :min="1" :max="15")
        h4 Preview
        div.exampleContainer(:style="exampleContainer")
          div.exampleWidget(:style="exampleWidget")
            h2 Widget title
            span Shorter text
</template>

<script>
import { mapActions } from "vuex"

export default {
	data() {
		return {
			initializing: true
		}
	},
	methods: {
		...mapActions(["updateState"])
	},
	mounted() {
		this.$nextTick(() => {
			this.initializing = false
		})
	},
	computed: {
		exampleWidget() {
			return {
				"padding-top": `calc(1vh * ${this.widget_padding} * ${
					this.font_size
				} / 4)`,
				"padding-bottom": `calc(1vh * ${this.widget_padding} * ${
					this.font_size
				} / 4)`,
				"padding-left": `calc(1vw * ${this.widget_padding} * ${
					this.font_size
				} / 4)`,
				"padding-right": `calc(1vw * ${this.widget_padding} * ${
					this.font_size
				} / 4)`
			}
		},
		exampleContainer() {
			return {
				"font-size": `calc(1vmin * ${this.font_size})`,
				padding: `${this.global_padding}px`
			}
		},
		global_padding: {
			get() {
				return Number(this.$store.state.style.global_padding)
			},
			set(global_padding) {
				if (!this.initializing)
					this.$store.dispatch("updateStyle", { global_padding })
			}
		},
		widget_repositioning: {
			get() {
				return this.$store.state.style.widget_repositioning
			},
			set(widget_repositioning) {
				this.$store.dispatch("updateStyle", { widget_repositioning })
			}
		},
		widget_offset: {
			get() {
				return Number(this.$store.state.style.widget_offset)
			},
			set(widget_offset) {
				if (!this.initializing)
					this.$store.dispatch("updateStyle", { widget_offset })
			}
		},
		widget_padding: {
			get() {
				return Number(this.$store.state.style.widget_padding)
			},
			set(widget_padding) {
				if (!this.initializing)
					this.$store.dispatch("updateStyle", { widget_padding })
			}
		},
		font_size: {
			get() {
				return Number(this.$store.state.style.font_size)
			},
			set(font_size) {
				if (!this.initializing)
					this.$store.dispatch("updateStyle", { font_size })
			}
		}
	}
}
</script>

<style lang="scss">
@import "~bootstrap/scss/functions";
@import "../assets/scss/_bootstrap_variables";

.exampleContainer {
	width: 100%;
	height: 20vh;
	overflow: hidden;
	background: #ccc;
	border-radius: 5px;
	box-shadow: inset 0px 0px 4px 0px rgba(0, 0, 0, 0.4);
}
.exampleWidget {
	background: white;
	border: 2px solid rgba(0, 0, 0, 0.5);
	display: inline-block;
	min-height: 0;
	min-width: 0;
	box-sizing: border-box;
	h2 {
		font-size: 1.5em;
	}
	h2,
	span,
	o {
		background: $blue;
		color: transparent;
	}
}
</style>
