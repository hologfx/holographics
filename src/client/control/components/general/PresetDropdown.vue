<template lang="pug">
.btn-group.btn-block
  el-button.btn-block.dropdown-toggle(type='warning', plain, data-toggle='dropdown', aria-haspopup='true', aria-expanded='false')
    slot
    .dropdown-menu.btn-block
        button.dropdown-item(@click="$emit('activate', preset)" v-for="preset in presets" :preset="preset" :key="preset.id") {{preset.name}}
          button.float-sm-right.btn.btn-sm.btn-outline-danger.fa.fa-trash(@click.stop="$emit('remove', preset)")
          button.float-sm-right.btn.btn-sm.btn-outline-warning.fa.fa-edit.mr-1(@click.stop="$emit('edit', preset)")
</template>

<script>
export default {
	props: ["presets", "name"]
}
</script>
