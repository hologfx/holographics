<template lang="pug">
div(v-if="readyToRender")
	Header
	.container-fluid#lsp
		.row
			#menubar.col-md-4.col-lg-3.col-xl-3
				MainMenu
			.col-md-8.col-lg-9.col-xl-9
				router-view(:key="$route.fullPath")
</template>

<script>
import { mapGetters, mapState } from "vuex"

// Components
import Header from "@/components/Header"
import MainMenu from "@/components/MainMenu"

import Holographics from "./lib/holographics-client"

export default {
	name: "app",
	components: {
		Header,
		MainMenu
	},
	watch: {
		readyToRender(ready) {
			if (ready) {
				this.$router.push({ name: "Updates" })
			}
		}
	},
	beforeMount() {
		Holographics.on(
			"request",
			({ serviceName, methodName, id, data, eventName }) => {
				console.log(`Requesting ${eventName}`)
				this.$store.commit("commitStatus", true)
			}
		)
		Holographics.on("error", error => {
			console.log(error)
			if (error.message) {
				this.$message.error(error.message)
			} else {
				this.$message.error("An unknown error has occured")
			}
		})
		Holographics.on("response", () => {
			this.$store.commit("commitStatus", false)
		})
	},
	computed: {
		...mapState(["debug"]),
		...mapGetters(["readyToRender"])
	}
}
</script>

<style lang="scss"></style>
