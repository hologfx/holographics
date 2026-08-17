<template lang="pug">
  span.badge(:class="classes")
    | {{indication}}
    el-popover(
      placement="top-start"
      width="600"
      trigger="hover"
      v-if="error")
        .error
        h4 Error
        pre {{error}}
        span.badge.badge-light.ml-2.p-1(v-if="error" slot="reference")
          i.fas.fa-question-circle.fa-fw.text-muted
</template>

<script>
export default {
	name: "ValidationBadge",
	props: ["status", "error"],
	computed: {
		classes: function() {
			if (this.status === "valid") {
				return "badge-success"
			} else if (this.status === "invalid") {
				return "badge-danger"
			} else {
				return "badge-secondary"
			}
		},
		indication: function() {
			if (this.status === "valid") {
				return "Valid"
			} else if (this.status === "invalid") {
				return "Invalid"
			} else {
				return "Pending"
			}
		}
	}
}
</script>
