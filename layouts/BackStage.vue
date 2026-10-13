<template>
  <v-app dark>
    <HeaderDiv @setloginover="setloginover"></HeaderDiv>
    <leftMenu :show="true"></leftMenu>
    <main>
      <div :class="{ colmarginleft: MerginLeft }">
        <leftMenu
          :show="Show"
          :login="Login"
          @SetMarginLeft="SetMarginLeft"
        ></leftMenu>
        <div class="PageDefault">
          <nuxt />
        </div>
      </div>
    </main>
  </v-app>
</template>
<script>
import HeaderDiv from '~/components/layouts/header.vue'
import leftMenu from '~/components/layouts/leftMenu.vue'
export default {
  components: {
    HeaderDiv,
    leftMenu
  },
  data() {
    return {
      MerginLeft: true,
      loginover: false
    }
  },
  computed: {
    Show: {
      get() {
        const vm = this
        if (vm.MerginLeft) {
          return true
        }
        return false
      }
    },
    Login: {
      get() {
        return this.loginover
      }
    }
  },
  methods: {
    ShowMenu() {
      this.MerginLeft = true
    },
    SetMarginLeft(_IsMergin) {
      this.MerginLeft = _IsMergin
    },
    setloginover(opt) {
      this.loginover = opt
    }
  }
}
</script>
