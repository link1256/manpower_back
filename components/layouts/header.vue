<template>
  <header>
    <div>
      <img class="headerlogo" src="@/assets/images/HeaderIcon.svg" alt="" />
      <img class="headerlogo2" src="@/assets/images/HeaderIcon2.svg" alt="" />
      <label
        style="font-size: 20px;color:#FFFFFF;margin-left:10px;font-style: normal; font-weight: 900; line-height: 47px; position: absolute;"
        >就業及失業統計資料 後台管理系統</label
      >
    </div>
    <div class="Logout">
      <label style="color: #ffffff; float: left;" for="">{{ LoginName }}</label>
      <div
        class="logouticon AllCenter"
        style="float: left; margin-left: 15px;"
        @click="LogOut"
      >
        <img src="@/assets/images/LogOut.svg" alt="" />
        <label style="color: #ffffff; cursor: pointer;" for="">登出</label>
      </div>
    </div>
  </header>
</template>
<script>
import qs from 'qs'
import { _SAlert } from '../../utils/sweetAlert2'
import axios from '~/plugins/axios'
export default {
  data() {
    return {
      LoginName: ''
    }
  },
  mounted() {
    this.LoginCheck()
  },
  methods: {
    LoginCheck() {
      const vm = this
      const ikey = this.$route.query.ticket
      axios
        .post(
          vm.RequetURL.loginurl,
          qs.stringify({ op: 'LoginCheck', ticket: ikey })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data.LoginStatus === 1) {
              if (data.LoginRoles === '') {
                _SAlert.Error('您沒有權限使用內網功能.')
                setTimeout(function() {
                  vm.LogOut()
                }, 1500)
              }
              if (data.Status === 0) {
                _SAlert.Error('您帳號已被停用.請聯絡系統管理員設定.')
                setTimeout(function() {
                  vm.LogOut()
                }, 1500)
              }
              vm.NowLogin.LoginName = data.LoginName
              vm.NowLogin.LoginAccount = data.LoginAccount
              vm.NowLogin.LeftMenuRoles = data.LoginRoles
              vm.LoginName = data.LoginName
              vm.$emit('setloginover', true)
            } else if (data.LoginStatus === 0) {
              _SAlert.Error('找不到您的帳號.如欲使用請聯絡系統管理員.')
              setTimeout(function() {
                vm.LogOut()
              }, 1500)
            } else if (data.LoginStatus === 2) {
              window.location = 'https://ebasnew.ebas.gov.tw/'
            } else {
              _SAlert.Error('系統發生錯誤.請聯絡管理員.')
              setTimeout(function() {
                vm.LogOut()
              }, 1500)
            }
          }
        })
    },
    LogOut() {
      const vm = this
      axios
        .post(vm.RequetURL.loginurl, qs.stringify({ op: 'Logout' }))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            window.location = vm.RequetURL.fronturl2
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.Logout {
  width: 200px;
  margin-top: 15px;
  right: 0px;
  top: 0px;
  color: #ffffff;
  position: absolute;
}
.logouticon {
  cursor: pointer;
}
</style>
