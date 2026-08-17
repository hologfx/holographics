<template lang="pug">
  div
    template(
      v-for="action in actions"
      )
      label.form-control-label(style="display:block") {{action.description}}
      component.mb-2(
        :is="action.type"
        :key="action.name"
        :widget="widget"
        :action="action")
</template>

<script>
import Button from "./ActionTypes/Button"

export default {
	props: ["actions", "widget"],
	components: {
		Button
	}
}
</script>
