<template>
  <div>
    <div class="baseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.BackUpManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="11"
      ></BaseBreadcrumbs>
    </div>
    <v-container>
      <v-row>
        <v-col>
          <v-radio-group v-model="backcycle">
            <v-radio :value="1" label="每日 24:00 進行備份"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-radio-group v-model="backcycle">
            <v-radio :value="2" label="自行設定"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="tcol2 AllRight">
          <span>1. 週期</span>
        </v-col>
        <v-col class="scol">
          <v-select
            v-model="cycle"
            :items="cycleitems"
            :disabled="backcycle === 2 ? false : true"
            background-color="white"
            solo
            hide-details
            @change="cyclechange"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="tcol2 AllRight">
          <span>2. 週期點</span>
        </v-col>
        <v-col class="scol">
          <v-select
            v-model="cycle2"
            :items="cycleitems2"
            :disabled="backcycle === 2 ? false : true"
            background-color="white"
            solo
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="tcol2 AllRight">
          <span>3. 時間</span>
        </v-col>
        <v-col class="scol">
          <v-select
            v-model="times"
            :items="timesitems"
            :disabled="backcycle === 2 ? false : true"
            background-color="white"
            solo
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="tcol2 AllRight">
          <span>4.保留備份數量</span>
        </v-col>
        <v-col class="scol">
          <v-text-field
            v-model="count"
            :max="60"
            :min="0"
            type="number"
            background-color="white"
            solo
            hide-details
            @keyup="countrules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <Checkbtn
            :name="'更新'"
            :issmall="true"
            style="margin-right: 10px;"
            @click.native="updateSet"
          ></Checkbtn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import Checkbtn from '@/components/button/checkbtn.vue'
import BaseBreadcrumbs from '@/components/backup/Breadcrumbs.vue'
export default {
  components: {
    Checkbtn,
    BaseBreadcrumbs
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '',
      backcycle: 1,
      cycle: 'week',
      cycleitems: [
        { text: '週', value: 'week' },
        { text: '月', value: 'month' }
      ],
      weekdata: [
        { text: '星期一', value: 1 },
        { text: '星期二', value: 2 },
        { text: '星期三', value: 3 },
        { text: '星期四', value: 4 },
        { text: '星期五', value: 5 },
        { text: '星期六', value: 6 },
        { text: '星期日', value: 7 }
      ],
      monthdata: [
        { text: '1號', value: 1 },
        { text: '2號', value: 2 },
        { text: '3號', value: 3 },
        { text: '4號', value: 4 },
        { text: '5號', value: 5 },
        { text: '6號', value: 6 },
        { text: '7號', value: 7 },
        { text: '8號', value: 8 },
        { text: '9號', value: 9 },
        { text: '10號', value: 10 },
        { text: '11號', value: 11 },
        { text: '12號', value: 12 },
        { text: '13號', value: 13 },
        { text: '14號', value: 14 },
        { text: '15號', value: 15 },
        { text: '16號', value: 16 },
        { text: '17號', value: 17 },
        { text: '18號', value: 18 },
        { text: '19號', value: 19 },
        { text: '20號', value: 20 },
        { text: '21號', value: 21 },
        { text: '22號', value: 22 },
        { text: '23號', value: 23 },
        { text: '24號', value: 24 },
        { text: '25號', value: 25 },
        { text: '26號', value: 26 },
        { text: '27號', value: 27 },
        { text: '28號', value: 28 },
        { text: '29號', value: 29 },
        { text: '30號', value: 30 },
        { text: '31號', value: 31 }
      ],
      cycle2: 1,
      cycleitems2: [],
      times: 1,
      timesitems: [
        { text: '01:00', value: 1 },
        { text: '02:00', value: 2 },
        { text: '03:00', value: 3 },
        { text: '04:00', value: 4 },
        { text: '05:00', value: 5 },
        { text: '06:00', value: 6 },
        { text: '07:00', value: 7 },
        { text: '08:00', value: 8 },
        { text: '09:00', value: 9 },
        { text: '10:00', value: 10 },
        { text: '11:00', value: 11 },
        { text: '12:00', value: 12 },
        { text: '13:00', value: 13 },
        { text: '14:00', value: 14 },
        { text: '15:00', value: 15 },
        { text: '16:00', value: 16 },
        { text: '17:00', value: 17 },
        { text: '18:00', value: 18 },
        { text: '19:00', value: 19 },
        { text: '20:00', value: 20 },
        { text: '21:00', value: 21 },
        { text: '22:00', value: 22 },
        { text: '23:00', value: 23 },
        { text: '24:00', value: 24 }
      ],
      count: 10,
      countitems: [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '5', value: 5 },
        { text: '6', value: 6 },
        { text: '7', value: 7 },
        { text: '8', value: 8 },
        { text: '9', value: 9 },
        { text: '10', value: 10 },
        { text: '11', value: 11 },
        { text: '12', value: 12 },
        { text: '13', value: 13 },
        { text: '14', value: 14 },
        { text: '15', value: 15 }
      ]
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    getdata() {
      const vm = this
      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify({ op: 'GetBackDBData' }))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data[0]
            if (data.dtype !== 'daylily') {
              vm.backcycle = 2
              vm.cycle = data.dtype
              vm.cyclechange()
              vm.cycle2 = data.valdate
              vm.times = data.h
              vm.count = data.keep
            } else {
              vm.backcycle = 1
              vm.cyclechange()
              vm.count = data.keep
            }
          }
        })
    },
    updateSet() {
      const vm = this
      const data = {}
      data.op = 'UpdateBackDBData'
      if (vm.backcycle === 1) {
        data.valdate = ''
        data.dtype = 'daylily'
        data.h = '24'
        data.keep = vm.count
      } else if (vm.backcycle === 2) {
        data.dtype = vm.cycle
        data.valdate = vm.cycle2
        data.h = vm.times
        data.keep = vm.count
      }

      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify(data))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('備份管理設定成功！')
            } else {
              _SAlert.Error('管理設定時出現錯誤！')
            }
          }
        })
    },
    countrules() {
      if (this.count > 60) this.count = 60
      if (this.count < 0) this.count = 0
    },
    cyclechange() {
      const cycle = this.cycle
      if (cycle === 'week') {
        this.cycle2 = 1
        this.cycleitems2 = this.weekdata
      } else if (cycle === 'month') {
        this.cycle2 = 1
        this.cycleitems2 = this.monthdata
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tcol {
  width: 100px !important;
  max-width: 100px !important;
}
.scol {
  width: 250px !important;
  max-width: 250px !important;
}
.tcol2 {
  width: 150px !important;
  max-width: 150px !important;
}
.childrow {
  padding-left: 35px;
}
</style>
