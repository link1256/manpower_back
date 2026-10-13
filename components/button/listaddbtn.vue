<template>
  <button class="AllCenter btn medianmodalCancelBtn listaddBtn">
    <img src="@/assets/images/ListAddIcon.svg" alt="" />
    {{ name }}
  </button>
</template>
<script>
export default {
  props: {
    name: {
      default: '新增群組',
      type: String
    }
  }
}
</script>
