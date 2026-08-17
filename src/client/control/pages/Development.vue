<template lang="pug">
#settings.mt-3
  .container-fluid
    .row
      .col-md-12
        template(v-if="debug.appMode.development")
          h2 Development settings
          p Environment (caution)
          el-radio(v-model="environment" label="node" border) NODE
          el-radio(v-model="environment" label="electron" border) ELECTRON
          p Packed mode (caution)
          el-radio(v-model="packed" :label="false" border) NOT PACKED
          el-radio(v-model="packed" :label="true" border) PACKED
          p Development mode
          el-radio(v-model="development" :label="true" border) DEVELOPMENT
          el-radio(v-model="development" :label="false" border) PRODUCTION
          p Load assets from
          el-radio(v-model="assetsFolder" label="SOURCE" border) SOURCE
          el-radio(v-model="assetsFolder" label="USERDATA" border) USER DATA
        h2 Filter log
        p Level
        el-radio(v-model="level" label="1" border) LOW
        el-radio(v-model="level" label="2" border) MEDIUM
        el-radio(v-model="level" label="3" border) HIGH
        el-radio(v-model="level" label="" border) ALL
        p Type
        el-radio(v-model="type" label="DEFAULT" border) DEFAULT
        el-radio(v-model="type" label="INFO" border) INFO
        el-radio(v-model="type" label="ERROR" border) ERROR
        el-radio(v-model="type" label="WARNING" border) WARNING
        el-radio(v-model="type" label="SUCCESS" border) SUCCESS
        el-radio(v-model="type" label="" border) ALL
        h2 Log
        pre.debuglog.well
          span(v-for="entry, index in logEntriesFiltered" :key="index" :entry="entry" :class="entry.type") {{ entry | displayLogMessage }}
</template>

<script>
import Holographics from "../lib/holographics-client"
import moment from "moment"
import { mapState, mapActions } from "vuex"

export default {
	data() {
		return {
			level: "3",
			type: "",
			logEntries: []
		}
	},
	watch: {
		level() {
			this.getLog()
		},
		type() {
			this.getLog()
		}
	},
	mounted() {
		this.getLog()
	},
	computed: {
		...mapState(["debug", "settings"]),
		logEntriesFiltered() {
			const criteria = {}
			if (this.type !== "") criteria.type = this.type
			if (this.level !== "") criteria.level = Number(this.level)

			return this.logEntries
				.filter(function(obj) {
					return Object.keys(criteria).every(function(c) {
						return obj[c] == criteria[c]
					})
				})
				.reverse()
		},
		environment: {
			get() {
				return this.debug.appMode.environment
			},
			set(environment) {
				Holographics.debug.setAppMode({ data: { environment } })
				this.getInitialState()
			}
		},
		packed: {
			get() {
				return this.debug.appMode.packed
			},
			set(packed) {
				Holographics.debug.setAppMode({ data: { packed } })
				this.getInitialState()
			}
		},
		development: {
			get() {
				return this.debug.appMode.development
			},
			set(development) {
				Holographics.debug.setAppMode({ data: { development } })
				this.getInitialState()
			}
		},
		assetsFolder: {
			get() {
				return this.settings.assetsFolder
			},
			set(assetsFolder) {
				Holographics.settings.patch({
					data: { assetsFolder }
				})
				this.getInitialState()
			}
		}
	},
	sockets: {
		log(msg) {
			this.logEntries.push(msg)
		}
	},
	filters: {
		displayLogMessage(logEntry) {
			let logline = ""
			logline += `${moment(logEntry.timestamp).format("HH:mm:ss")}`
			logline += ` [${logEntry.lib.toUpperCase()}] `
			logline += logEntry.msg
			logline += ` (${logEntry.libPath})`
			logline += "\n"
			return logline
		}
	},
	methods: {
		...mapActions(["getInitialState"]),
		getLog() {
			this.$set(this, "logEntries", [])
			Holographics.log.get({ data: { limit: 100 } }).then(logEntries => {
				this.$set(this, "logEntries", logEntries)
			})
		}
	}
}
</script>
