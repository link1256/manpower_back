<template>
  <button class="AllCenter btn smallmodalCancelBtn checkBtn">
    <img src="@/assets/images/Check.svg" alt="" />
    {{ name }}
  </button>
</template>
<script>
export default {
  props: {
    name: {
      default: '更新',
      type: String
    }
  }
}
</script>
