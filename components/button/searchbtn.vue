<template>
  <button class="AllCenter btn medianmodalCancelBtn listaddBtn">
    <img src="@/assets/images/SearchIcon.svg" alt="" />
    {{ name }}
  </button>
</template>
<script>
export default {
  props: {
    name: {
      default: '開始搜尋',
      type: String
    }
  }
}
</script>
