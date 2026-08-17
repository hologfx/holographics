<template lang="pug">
router-link(:to='page').list-group-item.list-group-item-action.d-flex.justify-content-between
	div
		i.fas.fa-fw.mt-1.mr-2(:class="fa_icon", v-if='icon')
		slot
	div(v-if="pro")
		span.badge.badge-secondary
			| PRO
</template>

<script>
export default {
	props: ["page", "icon", "pro"],
	computed: {
		fa_icon() {
			return "fa-" + this.icon
		}
	}
}
</script>

<style lang="scss">
</style>
