<template>
  <v-navigation-drawer
    v-model="Show"
    :disable-resize-watcher="true"
    :hide-overlay="true"
    :stateless="true"
    width="239"
    style="position: absolute; top:54px; overflow: initial; z-index: 10;"
  >
    <div class="leftdrawer">
      <div
        v-if="Announcement"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[18].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(18)"
        >
          <img src="@/assets/images/AuditIcon.svg" alt="" />
          <span>訊息公告</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[18].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in AnnouncementChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="AccountManage"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[0].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(0)"
        >
          <img src="@/assets/images/AccountIcon.svg" alt="" />
          <span>帳號管理</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[0].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in AccountManageChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="AuditManage"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[1].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(1)"
        >
          <img src="@/assets/images/AuditIcon.svg" alt="" />
          <span>稽核管理</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[1].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in AuditManageChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="Infomaintain"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[2].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(2)"
        >
          <img src="@/assets/images/InfoMaintainIcon.svg" alt="" />
          <span>資料維護</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[2].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in InfomaintainChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="LogDataManage"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[8].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(8)"
        >
          <img src="@/assets/images/InfoMaintainIcon.svg" alt="" />
          <span>存取紀錄</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[8].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in LogDataManagementChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="BackUp"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[11].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(11)"
        >
          <img src="@/assets/images/AuditIcon.svg" alt="" />
          <span>備份管理</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[11].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in BackUpChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="FrontShow"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[12].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(12)"
        >
          <img src="@/assets/images/AuditIcon.svg" alt="" />
          <span>資料查詢</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[12].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in FrontChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="YearReportShow"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[14].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(14)"
        >
          <img src="@/assets/images/AuditIcon.svg" alt="" />
          <span>年報資料</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[14].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in YearReportChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover leftnfter"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="YearReportShow"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[19].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(19)"
        >
          <img src="@/assets/images/AuditIcon.svg" alt="" />
          <span>代碼管理</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[19].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in CodeChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover leftnfter"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="StatShow"
        :class="{
          activeBackground: $store.state.Utils.Menu.Menu.MenuArray[20].Show
        }"
      >
        <div
          class="leftmenuparent leftmenuitem lefthover"
          @click="SlideMenu(20)"
        >
          <img src="@/assets/images/AuditIcon.svg" alt="" />
          <span>統計互動管理</span>
        </div>
        <div
          v-if="$store.state.Utils.Menu.Menu.MenuArray[20].Show"
          class="leftmenuitemChild"
        >
          <div
            v-for="(item, Index) in CodeChild"
            :key="Index"
            :class="{
              leftActive:
                $store.state.Utils.Menu.Menu.MenuArray[item.FunctionCode].Click
            }"
            class="leftmenuitem lefthover leftnfter"
            @click="InPage(item.FunctionCode)"
          >
            <span>{{ item.FunctionName }}</span>
          </div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    login: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Show: true,
      Announcement: true,
      AccountManage: false,
      AuditManage: false,
      Infomaintain: false,
      LogDataManage: false,
      BackUp: false,
      YearReportShow: false,
      FrontShow: true,
      StatShow: false,
      AnnouncementChild: [],
      AccountManageChild: [
        {
          FunctionName: '使用者管理',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .UserManagement
        },
        {
          FunctionName: '權限群組管理',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .AuthorityManagement
        }
      ],
      AuditManageChild: [],
      InfomaintainChild: [
        {
          FunctionName: '臺灣地區',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .TaiwanDataManagement
        },
        {
          FunctionName: '縣市資料',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .CityDataManagement
        },
        {
          FunctionName: '縣市重要指標',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .MonthlyDateManagement
        },
        {
          FunctionName: '季節調整',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .SeasonDateManagement
        }
      ],
      LogDataManagementChild: [
        {
          FunctionName: '登入紀錄',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .LogInRecord
        },
        {
          FunctionName: '操作紀錄',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .EditRecord
        }
      ],
      YearReportChild: [
        {
          FunctionName: '資料維護',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .YearReportDataMaintain
        },
        {
          FunctionName: '套版維護',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .YearReportSettingLayout
        },
        {
          FunctionName: '分類管理',
          FunctionCode: this.$store.state.Utils.SystemCode.LeftFunctionCode
            .YearReportSettingClasses
        }
      ],
      BackUpChild: [],
      FrontChild: [],
      CodeChild: [],
      StatChild: []
    }
  },
  watch: {
    show() {
      const vm = this
      vm.Show = vm.show
    },
    login() {
      if (this.login === false) return
      const roles = this.NowLogin.LeftMenuRoles
      if (roles !== '') {
        const ar = roles.split(',')

        for (let i = 0; i < ar.length; i++) {
          if (ar[i] === '1') {
            this.AccountManage = true
          } else if (ar[i] === '2') {
            this.AuditManage = true
            this.YearReportShow = true
          } else if (ar[i] === '3') {
            this.Infomaintain = true
          } else if (ar[i] === '4') {
            this.LogDataManage = true
          } else if (ar[i] === '5') {
            this.BackUp = true
          } else if (ar[i] === '7') {
            this.StatShow = true
          }
        }
      }
    }
  },
  methods: {
    InPage(_PageID) {
      const vm = this
      vm.DefaultVuex()
      const SystemCodeObj = vm.$store.state.Utils.SystemCode.LeftFunctionCode
      const vuexArray = vm.CopyArr(vm.$store.state.Utils.Menu.Menu.MenuArray)
      vm.$set(vuexArray[_PageID], 'Click', true)
      vm.CommitVuex(vuexArray)
      switch (_PageID) {
        case SystemCodeObj.UserManagement:
          vm.$router.push({
            path: '/account/UserManagement'
          })
          break
        case SystemCodeObj.AuthorityManagement:
          vm.$router.push({
            path: '/account/AuthorityManagement'
          })
          break
        case SystemCodeObj.AuditManagement:
          vm.$router.push({
            path: '/audit/Index'
          })
          break
        case SystemCodeObj.TaiwanDataManagement:
          vm.$router.push({
            path: '/infomaintain/SetTaiwanData'
          })
          break
        case SystemCodeObj.CityDataManagement:
          vm.$router.push({
            path: '/infomaintain/SetCityData'
          })
          break
        case SystemCodeObj.MonthlyDateManagement:
          vm.$router.push({
            path: '/infomaintain/SetMonthlyData'
          })
          break
        case SystemCodeObj.SeasonDateManagement:
          vm.$router.push({
            path: '/infomaintain/SetSeasonData'
          })
          break
        case SystemCodeObj.LogInRecord:
          vm.$router.push({
            path: '/logdata/LoginLog'
          })
          break
        case SystemCodeObj.EditRecord:
          vm.$router.push({
            path: '/logdata/EditLog'
          })
          break
        case SystemCodeObj.BackUpManagement:
          vm.$router.push({
            path: '/backup/setBackUp'
          })
          break
        case SystemCodeObj.YearReportDataMaintain:
          vm.$router.push({
            path: '/yearreport/DataMaintain'
          })
          break
        case SystemCodeObj.YearReportSettingLayout:
          vm.$router.push({
            path: '/yearreport/SettingLayout'
          })
          break
        case SystemCodeObj.YearReportSettingClasses:
          vm.$router.push({
            path: '/yearreport/SettingClasses'
          })
          break
        case SystemCodeObj.FrontUrl:
          window.location = this.RequetURL.fronturl
          break
        case SystemCodeObj.AnnouncementManagement:
          vm.$router.push({
            path: '/announcement/Index'
          })
          break
        case SystemCodeObj.CodeManagement:
          vm.$router.push({
            path: '/codemanage/Index'
          })
          break
        case SystemCodeObj.StatManagement:
          vm.$router.push({
            path: '/statmanage/Index'
          })
          break
      }
    },
    CopyArr(arr) {
      return arr.map((e) => {
        if (typeof e === 'object') {
          return Object.assign({}, e)
        } else {
          return e
        }
      })
    },
    DefaultVuex() {
      const vm = this
      const vuexArray = vm.CopyArr(vm.$store.state.Utils.Menu.Menu.MenuArray)
      for (let i = 0; i < vuexArray.length; i++) {
        if (vuexArray[i].IsParents) {
          vm.$set(vuexArray[i], 'Show', false)
        }
        vm.$set(vuexArray[i], 'Click', false)
      }
      vm.CommitVuex(vuexArray)
    },
    CommitVuex(_Array) {
      const vm = this
      vm.$store.commit('Utils/Menu/SET_MENUSTYLE', _Array)
    },
    SlideMenu(_Index) {
      const vm = this
      const vuexArray = vm.CopyArr(vm.$store.state.Utils.Menu.Menu.MenuArray)
      const menuObj = vuexArray[_Index]
      if (menuObj.Show) {
        vm.$set(vuexArray[_Index], 'Show', false)
      } else {
        for (let i = 0; i < vuexArray.length; i++) {
          if (vuexArray[i].IsParents) {
            vm.$set(vuexArray[i], 'Show', false)
          }
        }
        vm.$set(vuexArray[_Index], 'Show', true)
      }
      vm.$store.commit('Utils/Menu/SET_MENUSTYLE', vuexArray)

      if (_Index === 1) {
        setTimeout(function() {
          const SystemCodeObj =
            vm.$store.state.Utils.SystemCode.LeftFunctionCode
          vm.InPage(SystemCodeObj.AuditManagement)
        }, 500)
      } else if (_Index === 11) {
        setTimeout(function() {
          const SystemCodeObj =
            vm.$store.state.Utils.SystemCode.LeftFunctionCode
          vm.InPage(SystemCodeObj.BackUpManagement)
        }, 500)
      } else if (_Index === 12) {
        setTimeout(function() {
          const SystemCodeObj =
            vm.$store.state.Utils.SystemCode.LeftFunctionCode
          vm.InPage(SystemCodeObj.FrontUrl)
        }, 500)
      } else if (_Index === 18) {
        setTimeout(function() {
          const SystemCodeObj =
            vm.$store.state.Utils.SystemCode.LeftFunctionCode
          vm.InPage(SystemCodeObj.AnnouncementManagement)
        }, 500)
      } else if (_Index === 19) {
        setTimeout(function() {
          const SystemCodeObj =
            vm.$store.state.Utils.SystemCode.LeftFunctionCode
          vm.InPage(SystemCodeObj.CodeManagement)
        }, 500)
      } else if (_Index === 20) {
        setTimeout(function() {
          const SystemCodeObj =
            vm.$store.state.Utils.SystemCode.LeftFunctionCode
          vm.InPage(SystemCodeObj.StatManagement)
        }, 500)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.theme--light .v-navigation-drawer {
  background-color: #e1e1e1;
}
</style>
