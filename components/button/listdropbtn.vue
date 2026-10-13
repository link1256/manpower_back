<template>
  <v-menu offset-y>
    <template #activator="{ on }">
      <button class="AllCenter btn medianmodalCancelBtn listaddBtn" v-on="on">
        <img src="@/assets/images/ListAddIcon.svg" alt="" />
        {{ name }}
      </button>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in ditmes"
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
      default: '新增套版',
      type: String
    },
    items: {
      default: null,
      type: Array
    }
  },
  data() {
    return {
      ditmes: []
    }
  },
  mounted() {
    if (!this.items) {
      this.ditmes = [
        {
          title: '全新套版'
        },
        {
          title: '既有套版'
        }
      ]
    }
  },
  methods: {
    itemclick(idx) {
      if (idx === 0) {
        this.$emit('listdropclick', 'addnewlayout')
      } else if (idx === 1) {
        this.$emit('listdropclick', 'addlayouthas')
      }
    }
  }
}
</script>
