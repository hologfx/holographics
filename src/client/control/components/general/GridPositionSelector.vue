<template lang="pug">
.grid-radio
	a.fa.fa-arrow-up.fa-rotate--45(@click="setPosition('top', 'left')" :class="hasActiveClass('topleft')")
	a.fa.fa-arrow-up(@click="setPosition('top', 'center')" :class="hasActiveClass('topcenter')")
	a.fa.fa-arrow-up.fa-rotate-45(@click="setPosition('top', 'right')" :class="hasActiveClass('topright')")
	a.fa.fa-arrow-left(@click="setPosition('center', 'left')" :class="hasActiveClass('centerleft')")
	a.fa.fa-circle(@click="setPosition('center', 'center')" :class="hasActiveClass('centercenter')")
	a.fa.fa-arrow-right(@click="setPosition('center', 'right')" :class="hasActiveClass('centerright')")
	a.fa.fa-arrow-down.fa-rotate-45(@click="setPosition('bottom', 'left')" :class="hasActiveClass('bottomleft')")
	a.fa.fa-arrow-down(@click="setPosition('bottom', 'center')" :class="hasActiveClass('bottomcenter')")
	a.fa.fa-arrow-down.fa-rotate--45(@click="setPosition('bottom', 'right')" :class="hasActiveClass('bottomright')")
</template>

<script>
export default {
	props: ["horizontal_position", "vertical_position"],
	methods: {
		setPosition(vertical_position, horizontal_position) {
			this.$emit("change-horizontal", horizontal_position)
			this.$emit("change-vertical", vertical_position)
		},
		hasActiveClass(position) {
			return this.activePosition === position ? "active" : ""
		}
	},
	computed: {
		activePosition() {
			return `${this.vertical_position}${this.horizontal_position}`
		}
	}
}
</script>

<style lang="scss">
// Icon rotations for widget positioning
.fa-rotate--45:before {
	-ms-transform: rotate(-45deg); /* Internet Explorer 9 */
	-webkit-transform: rotate(-45deg); /* Chrome, Safari, Opera */
	transform: rotate(-45deg); /* Standard syntax */
}
.fa-rotate-45:before {
	-ms-transform: rotate(45deg); /* Internet Explorer 9 */
	-webkit-transform: rotate(45deg); /* Chrome, Safari, Opera */
	transform: rotate(45deg); /* Standard syntax */
}

.grid-radio {
	display: grid;
	align-content: left;
	grid-template-columns: repeat(3, 3em [col-start]);
	grid-template-rows: repeat(3, 3em [col-start]);
	border: 1px solid #dcdfe6;
	border-radius: 0.25rem;

	a {
		align-self: stretch;
		justify-self: stretch;
		text-align: center;
		vertical-align: middle;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	a:before {
		vertical-align: middle;
	}

	// First row
	a:nth-child(1),
	a:nth-child(2),
	a:nth-child(3) {
		border-bottom: 1px solid #dcdfe6;
	}
	// Second row
	a:nth-child(4),
	a:nth-child(5),
	a:nth-child(6) {
		border-bottom: 1px solid #dcdfe6;
	}

	// First column
	a:nth-child(3n -2) {
		border-right: 1px solid #dcdfe6;
	}
	// Middle column
	a:nth-child(3n -1) {
		border-right: 1px solid #dcdfe6;
	}

	a.active {
		background-color: #409eff;
		border-color: #409eff;
		&:before {
			color: white;
		}
	}
}
</style>
