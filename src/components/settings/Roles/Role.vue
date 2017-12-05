<template lang="pug">
  .roleList__item {{ role.getTitle() }}
</template>

<script>
export default {
  props: {
    role: {
      required: true
    }
  }
}
</script>