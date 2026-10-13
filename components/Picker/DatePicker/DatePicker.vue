<template>
  <v-date-picker
    v-model="value"
    :header-date-format="toROCDate"
    :year-format="toROCYear"
    locale="zh-TW"
  ></v-date-picker>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    value: ''
  }),
  methods: {
    /**
     * @param {number} year
     */
    toROCYear(year) {
      return year ? year - 1911 : ''
    },
    /**
     * @param {string} date
     */
    toROCDate(date) {
      const [year, month, day] = date.split('-')
      const monthStr = month ? `${month}月` : ''
      const dayStr = day ? `${month}日` : ''
      return `${this.toROCYear(year)}年${monthStr}${dayStr}`
    }
  }
})
</script>
