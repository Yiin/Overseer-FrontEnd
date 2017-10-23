<template>
  <div></div>
</template>

<script>
export default {
  computed: {
    products() {
      return this.$store.getters['documents/products']
    }
  }
}
</script>