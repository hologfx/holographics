<template lang="pug">
  .position
    label.form-control-label Widget wrapping
    .input-group.mb-3
      el-radio-group(:value="widget_wrapping || mergedStyle.widget_wrapping" @input="$emit('update:widget_wrapping', $event)")
        el-radio-button(:label="true") Enable
        el-radio-button(:label="false") Disable

</template>

<script>
export default {
	props: ["mergedStyle", "widget_wrapping"],
	computed: {}
}
</script>

<style lang="scss">
</style>
