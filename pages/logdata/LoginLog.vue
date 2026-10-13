<template>
  <div>
    <div class="baseheader">
      <BaseBreadcrumbs
        :reviewstep="$store.state.Utils.SystemCode.LeftFunctionCode.LogInRecord"
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="8"
      ></BaseBreadcrumbs>
      <v-container>
        <v-row>
          <v-col>
            <span class="titlespan">登入歷程</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="items"
              :page.sync="pagination.page"
              :items-per-page="pagination.itemsPerPage"
              hide-default-footer
              class="TableStyle elevation-3"
              @page-count="pagination.pageCount = $event"
            >
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <Pagination
              :length="items.length"
              :pagecount="pagination.pageCount"
            ></Pagination>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import BaseBreadcrumbs from '@/components/logdata/Breadcrumbs.vue'
import Pagination from '@/components/table/Pagination.vue'
export default {
  components: {
    BaseBreadcrumbs,
    Pagination
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '登入紀錄',
      items: [],
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10
      },
      headers: [
        { text: '編號', value: 'Sno', align: 'center', width: '25%' },
        {
          text: '帳號',
          value: 'Account',
          align: 'center',
          width: '35%',
          sortable: false
        },
        {
          text: '登入時間',
          value: 'LoginTime',
          align: 'center',
          width: '40%',
          sortable: false
        }
      ]
    }
  },
  mounted() {
    const vm = this
    axios
      .post(vm.RequetURL.ajaxurl, qs.stringify({ op: 'GetLoginLogList' }))
      .then(function(Response) {
        if (typeof Response === 'object' && Response.status === 200) {
          const data = Response.data
          vm.items = []
          for (let i = 0; i < data.length; i++) {
            const opt = {}
            opt.Sno = data[i].Sno
            opt.Account = data[i].Account
            opt.LoginTime = vm.compileDateTime(data[i].LoginTime)
            opt.LogoutTime = vm.compileDateTime(data[i].LogoutTime)
            vm.items.push(opt)
          }
        }
      })
  },
  methods: {
    compileDateTime(time) {
      if (!time) return

      const d = time.split('T')
      if (!d || d.length === 1) return ''

      const t = d[1].split(':')

      return d[0] + ' ' + t[0] + ':' + t[1]
    },
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    }
  }
}
</script>
<style lang="scss" scoped>
.titlespan {
  font-size: 18px;
  color: #344059;
  font-style: bold;
}

.titlespan2 {
  font-size: 24px;
  color: #344059;
  font-style: bold;
}
.titlespan3 {
  font-size: 16px;
  color: #6b6b6b;
  font-style: bold;
}
.statgroup {
  min-height: 200px !important;
  height: 200px !important;
}
.fade_cust {
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
}
.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  z-index: 101;
  top: calc(50% - 60px);
  left: calc(50% - 60px);
  position: absolute;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
