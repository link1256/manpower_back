<template>
  <button class="AllCenter btn smallmodalCancelBtn crossBtn">
    <img src="@/assets/images/Cross.svg" alt="" />
    {{ name }}
  </button>
</template>
<script>
export default {
  props: {
    name: {
      default: '取消',
      type: String
    }
  }
}
</script>
