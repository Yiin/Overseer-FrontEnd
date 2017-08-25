<template>
  <div class="column" :style="{ width }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'column',

  props: ['width']
}
</script>