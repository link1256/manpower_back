<template>
  <v-menu offset-y>
    <template #activator="{ on }">
      <button class="AllCenter btn medianmodalCancelBtn exportBtn" v-on="on">
        <img src="@/assets/images/Export.svg" alt="" />
        {{ name }}
      </button>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in ditems"
        :key="index"
        @click="itemclick(index)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  props: {
    name: {
      default: '匯出清單',
      type: String
    },
    items: {
      default: new Array(0),
      type: Array
    }
  },
  data() {
    return {
      ditems: []
    }
  },
  mounted() {
    if (this.items.length === 0) {
      this.ditems = [
        {
          title: '下載Excel'
        },
        {
          title: '下載Ods'
        }
      ]
    } else {
      this.ditems = this.items
    }
  },
  methods: {
    itemclick(idx) {
      if (idx === 0) {
        this.$emit('downloadclick2', 'excel')
      } else if (idx === 1) {
        this.$emit('downloadclick2', 'ods')
      }
    }
  }
}
</script>
