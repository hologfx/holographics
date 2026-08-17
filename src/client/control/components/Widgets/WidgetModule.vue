<template lang="pug">
a.card.bg-light.themeselector(@click="$emit('click')")
	.card-header
		i.fa.fa-fw.mt-1.mr-2(:class="'fa-' + widgetModule.icon")
		| {{widgetModule.name || widgetModule.slug}}
		span.ml-1.badge.badge-danger(v-if="widgetModule.error") Invalid widget
	.card-body
		p.card-text(v-html="widgetModule.description")
</template>

<script>
export default {
	props: ["widgetModule"]
}
</script>
