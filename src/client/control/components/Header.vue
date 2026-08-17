<template lang="pug">
.container-fluid.header(:class="debug.appMode.development ? 'active' : ''")
	.row.py-4
		.col-9.d-flex
			img.align-self-end(src="/client/public/img/Holographics_logo.png" class="d-lg-none" width="100px")
			img.align-self-end(src="/client/public/img/Holographics_logo.svg" style="margin-bottom: -1rem" class="d-none d-lg-inline" width="450px")
			span.align-self-end.badge.badge-danger.mr-2 v{{ version }}
			span.align-self-end.mr-2.badge.badge-warning(v-if="updates.newerVersionAvailable") A new version is available
		.col-3.text-right.d-flex.justify-content-end
			#connection.mr-4.mt-2(v-if="!connected")
				el-popover(
					placement="bottom"
					width="300"
					trigger="hover")
					p Connection lost, try refreshing
					i.fas.fa-link(slot="reference")
			#clock.date.mr-4.mt-2.d-none.d-md-block
				Clock
			StateStatus(:saving="true").align-self-end

</template>

<script>
import StateStatus from "@/components/StateStatus"
import { mapState } from "vuex"
import Clock from "@/components/general/clock"

export default {
	components: {
		StateStatus,
		Clock
	},
	computed: {
		...mapState(["connected", "debug", "updates"]),
		version() {
			return this.$store.state.status.version || ""
		}
	}
}
</script>

<style lang="scss"></style>
