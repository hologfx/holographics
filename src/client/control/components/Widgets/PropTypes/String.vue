<template lang="pug">
input.form-control(
  :placeholder="prop.description"
  :value="value"
  @blur="$emit('input', $event.target.value)"
  :name="prop.name")
</template>

<script>
export default {
	props: ["prop", "value"]
}
</script>
