<template>
  <v-select
    v-model="value"
    :label="label"
    :items="options"
    background-color="white"
    solo
    @change="onChange"
  ></v-select>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: '林管處'
    },
    rules: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    value: null,
    // 請重構成由 api 取資料
    options: [
      {
        text: '局本部',
        value: '00'
      },
      {
        text: '羅東處',
        value: '01'
      },
      {
        text: '新竹',
        value: '02'
      },
      {
        text: '東勢',
        value: '03'
      },
      {
        text: '南投',
        value: '04'
      },
      {
        text: '嘉義',
        value: '05'
      },
      {
        text: '屏東',
        value: '06'
      },
      {
        text: '台東',
        value: '07'
      },
      {
        text: '花蓮',
        value: '08'
      },
      {
        text: '阿文處',
        value: '0A'
      }
    ]
  }),
  methods: {
    onChange() {
      this.$emit('input', this.value)
    }
  }
})
</script>
