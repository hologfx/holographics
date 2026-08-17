<template lang="pug">
div
	el-date-picker(
  :value="value"
  @input="$emit('input', $event)"
  type="datetime"
  placeholder="Select date and time"
)
</template>

<script>
export default {
	props: ["prop", "value"]
}
</script>
