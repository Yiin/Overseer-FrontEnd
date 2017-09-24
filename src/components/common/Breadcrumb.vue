<template>
  <div class="breadcrumb">
    <div @click="home" class="breadcrumb__path">
      <i class="fa fa-home"></i>
    </div>
    <div v-for="(item, index) in path"
         class="breadcrumb__path" :class="{ 'breadcrumb__path--active': index === path.length - 1 }"
    >{{ item }}</div>
  </div>
</template>

<script>
  import { OVERVIEW } from '@/router/routes'

  export default {
    name: 'breadcrumb',

    props: [
      'path'
    ],

    methods: {
      home() {
        this.$router.push({
          name: OVERVIEW
        })
      }
    }
  }
</script>

<style lang="scss">
  .breadcrumb {
    padding: 12px 0 4px;
    margin-bottom: 20px;
    color: $color-mine-shaft;
    font-size: 18px;
    user-select: none;
    visibility: hidden;

    &__path {
      display: inline;
      text-transform: capitalize;
      &:first-child {
        display: inline-block;
        color: $color-main;
      }
      &+&:before {
        padding: 0 5px;
        color: #ccc;
        content: "/\00a0";
      }
    }
  }


</style>