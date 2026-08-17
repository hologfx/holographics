<template lang="pug">
	span {{ timeString }}
</template>

<script>
export default {
	data() {
		return {
			timeString: "00:00:00",
			dateString: "000 ",
			week: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
		}
	},
	mounted() {
		setInterval(this.updateTime, 1000)
	},
	methods: {
		updateTime() {
			const cd = new Date()

			let timeString = ""
			let dateString = ""

			timeString += ` ${cd
				.getHours()
				.toString()
				.padStart(2, "0")}:`
			timeString += `${cd
				.getMinutes()
				.toString()
				.padStart(2, "0")}:`
			timeString += `${cd
				.getSeconds()
				.toString()
				.padStart(2, "0")}`

			dateString += this.week[cd.getDay()]

			dateString += ` ${cd.getFullYear().toString()}-`
			dateString += `${(cd.getMonth() + 1).toString().padStart(2, "0")}-`
			dateString += `${cd
				.getDate()
				.toString()
				.padStart(2, "0")}`

			this.dateString = dateString
			this.timeString = timeString
		}
	}
}
</script>
