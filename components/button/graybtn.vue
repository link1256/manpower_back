<template>
  <button class="AllCenter btn medianmodalCancelBtn grayBtn">
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
