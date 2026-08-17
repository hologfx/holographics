<template lang="pug">
#settings.mt-3
  .container-fluid
    .row
      .col-md-12
        h2 Settings
        div.mb-5
          el-popover.mr-2(
            placement="top"
            width="300"
            trigger="hover")
            p Resetting your config will reset styles, application settings, the active theme and any widgets and entries you may have added.
            ConfirmButton.btn.btn-danger(@perform="reset_config" slot="reference") Revert Config
        div.mb-5
          h3 Logging mode
          el-radio(v-model="loggingmode" label="LOW" border) No debug functions
          el-radio(v-model="loggingmode" label="MEDIUM" border) More information
          el-radio(v-model="loggingmode" label="HIGH" border) Tell me everything
        div.mb-5
          h3 OSC Address
          p See <a href="https://github.com/hologfx/holographics" target="_blank">OSC documentation</a>
          MainMenuAddress.w-50(:href="OSCAddress" :browserButton="false")
        div(v-if="debug.appMode.packed && debug.appMode.environment !== 'electron'")
          h3 Port
          p Containerized instances always start on port 3000.
        div(v-else)
          h3 Port
          p Holographics will always try to initialize with the port you specify (or the default, 3000), but if the port is occupied it will automatically increment by 80 until a free port is found.
          p
            strong Restart required.
          el-radio(v-model="port" label="80" border) 80
          el-radio(v-model="port" label="3000" border) 3000
          el-radio(v-model="port" label="4000" border) 4000
          el-radio(v-model="port" label="5000" border) 5000
          //- el-radio(v-model="port" label="6000" border) 6000 | Port 6000 not allowed
          el-radio(v-model="port" label="7000" border) 7000
</template>

<script>
import ConfirmButton from "@/components/general/ConfirmButton"
import MainMenuAddress from "@/components/MainMenu/MainMenuAddress"
import { mapState, mapActions } from "vuex"

export default {
	data: function() {
		return {}
	},
	components: {
		MainMenuAddress,
		ConfirmButton
	},
	computed: {
		...mapState(["debug", "status"]),
		OSCAddress() {
			if (this.status) {
				return `${this.status.ip}:27015`
			} else {
				return `127.0.0.1:27015`
			}
		},
		loggingmode: {
			get() {
				return this.$store.state.settings.logging.level
			},
			set(loggingmode) {
				this.$store.dispatch("updateSetting", {
					logging: { level: loggingmode }
				})
			}
		},
		port: {
			get() {
				return this.$store.state.settings.port.toString()
			},
			set(port) {
				this.$store.dispatch("updateSetting", { port })
			}
		}
	},
	methods: {
		...mapActions(["reset_config"])
	}
}
</script>
