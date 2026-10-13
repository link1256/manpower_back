<template>
  <v-col class="basecol">
    <div>
      <span
        v-for="item in breadcrumbstext"
        :key="item.Index"
        class="BoldText"
        >{{ item }}</span
      >
    </div>
  </v-col>
</template>
<script>
export default {
  props: {
    headertitle: {
      default: '',
      type: String
    },
    greentext: {
      default: '',
      type: String
    },
    breadcrumbstext: {
      default: null,
      type: Array
    }
  }
}
</script>
<style lang="scss" scoped>
.basecol {
  display: flex;
  align-items: flex-end;
  height: 60px;
  color: #344059;
  font-size: 24px;
  font-weight: 800;
}
</style>
