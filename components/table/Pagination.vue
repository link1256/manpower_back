<template>
  <v-col class="DFlexAndVCenter">
    <!--<div>
      <span class="BoldText GreenText">共</span>
      <span class="BoldText" style="color:red">{{ length }}</span>
      <span class="BoldText GreenText">筆</span>
    </div>-->
    <div style="margin-left:auto">
      <v-pagination v-model="inPage" :length="pagecount"></v-pagination>
    </div>
  </v-col>
</template>
<script>
export default {
  props: {
    length: {
      default: 0,
      type: Number
    },
    page: {
      default: 0,
      type: Number
    },
    pagecount: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      inPage: 1
    }
  },
  watch: {
    inPage() {
      const vm = this
      vm.$parent.setpage(this.inPage)
    }
  }
}
</script>
