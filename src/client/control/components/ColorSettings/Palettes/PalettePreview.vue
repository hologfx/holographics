<template lang="pug">
.d-flex(v-if="palette.length > 0")
  .p-3.flex-fill(:style="{ background: palette[0] }") 1
  .p-3.flex-fill(:style="{ background: palette[1] }") 2
  .p-3.flex-fill(:style="{ background: palette[2] }") 3
  .p-3.flex-fill(:style="{ background: palette[3] }") 4
  .p-3.flex-fill(:style="{ background: palette[4] }") 5
</template>

<script>
export default {
	props: ["palette"]
}
</script>

<style lang="scss" scoped>
.d-flex > .flex-fill {
	color: white;
	font-weight: bold;
	text-align: center;
}
</style>
