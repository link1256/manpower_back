<template>
  <div>
    <div class="baseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.SeasonDateManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="2"
      ></BaseBreadcrumbs>
      <v-container>
        <v-row>
          <v-col class="AllLeft">
            <ListAddBtn
              :name="'更新資料'"
              :issmall="true"
              @click.native="UpdateDataDialog"
            ></ListAddBtn>
            <graybtn
              :name="'日期設定'"
              :issmall="true"
              style="margin-left: 10px;"
              @click.native="dateset = true"
            ></graybtn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="titlespan">更新歷程</span>
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
        <v-row v-if="pagination.pageCount != 1">
          <Pagination
            :length="items.length"
            :pagecount="pagination.pageCount"
          ></Pagination>
        </v-row>
        <v-dialog v-model="dateset" max-width="500">
          <div class="modal-content">
            <v-container>
              <v-row>
                <v-col class="AllCenter">
                  <span class="titlespan2">季節查詢</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter">
                  <span class="titlespan">前台資料顯示至</span>
                  <v-select
                    v-model="myear"
                    :items="myearitems"
                    style="max-width: 150px;"
                    background-color="white"
                    solo
                    hide-details
                    @change="setmonthday"
                  ></v-select>
                  <span class="titlespan">年</span>
                  <v-select
                    v-model="mmonth"
                    :items="mmonthitems"
                    style="max-width: 150px;"
                    background-color="white"
                    solo
                    hide-details
                  ></v-select>
                  <span class="titlespan">月</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter">
                  <Checkbtn
                    :name="'更新'"
                    :issmall="true"
                    style="margin-right: 10px;"
                    @click.native="UpdateDateSet"
                  ></Checkbtn>
                  <Crossbtn
                    :name="'取消'"
                    :issmall="true"
                    @click.native="dateset = false"
                  ></Crossbtn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-dialog>
        <v-dialog v-model="updatedata" max-width="500">
          <div class="modal-content">
            <v-container>
              <v-row>
                <v-col class="AllCenter">
                  <span class="titlespan2">更新資料</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter" style="max-width: 150px;">
                  <span class="titlespan">資料起迄時間</span>
                </v-col>
                <v-col>
                  <v-radio-group v-model="datetype" class="statgroup">
                    <v-row>
                      <v-col>
                        <v-radio :value="1" label="全部更新"></v-radio>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        style="max-width: 50px; width: 50px; padding-top: 30px;"
                      >
                        <v-radio :value="2"></v-radio>
                      </v-col>
                      <v-col>
                        <v-row>
                          <v-col class="AllCenter">
                            <v-select
                              v-model="startyear"
                              :items="dateitems"
                              style="max-width: 100px;"
                              background-color="white"
                              solo
                              hide-details
                            ></v-select>
                            <v-select
                              v-model="startmonth"
                              :items="monthitems"
                              style="max-width: 100px;"
                              background-color="white"
                              solo
                              hide-details
                            ></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="AllCenter">
                            <v-select
                              v-model="endyear"
                              :items="dateitems"
                              style="max-width: 100px;"
                              background-color="white"
                              solo
                              hide-details
                            ></v-select>
                            <v-select
                              v-model="endmonth"
                              :items="monthitems"
                              style="max-width: 100px;"
                              background-color="white"
                              solo
                              hide-details
                            ></v-select>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter" style="max-width: 150px;">
                  <span class="titlespan">選擇檔案</span>
                </v-col>
                <v-col class="AllCenter">
                  <v-file-input
                    :key="fkey"
                    v-model="uploadfile"
                    accept=".txt"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter">
                  <Checkbtn
                    :name="'更新'"
                    :issmall="true"
                    style="margin-right: 10px;"
                    @click.native="UpdateTable"
                  ></Checkbtn>
                  <Crossbtn
                    :name="'取消'"
                    :issmall="true"
                    @click.native="updatedata = false"
                  ></Crossbtn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-dialog>
        <div v-if="loader" class="fade_cust"></div>
        <div v-if="loader" class="loader"></div>
      </v-container>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import Checkbtn from '~/components/button/checkbtn.vue'
import Crossbtn from '~/components/button/crossbtn.vue'
import ListAddBtn from '~/components/button/listaddbtn.vue'
import BaseBreadcrumbs from '@/components/information/Breadcrumbs.vue'
import Pagination from '@/components/table/Pagination.vue'
import graybtn from '~/components/button/graybtn.vue'
export default {
  components: {
    BaseBreadcrumbs,
    ListAddBtn,
    Pagination,
    Checkbtn,
    Crossbtn,
    graybtn
  },
  layout: 'BackStage',
  data() {
    return {
      loader: false,
      GUUID: null,
      HeaderTitle: '季節調整',
      layout: 'Unemployedrate_Adjust',
      dateset: false,
      updatedata: false,
      datetype: 1,
      items: [],
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10
      },
      myear: 1,
      myearitems: [],
      mmonth: 1,
      mmonthitems: [],
      headers: [
        { text: '編號', value: 'sno', align: 'center', width: '20%' },
        {
          text: '更新統計期',
          value: 'infodate',
          align: 'center',
          width: '30%',
          sortable: false
        },
        {
          text: '更新日期',
          value: 'DateTime',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '更新人員',
          value: 'Account',
          align: 'center',
          width: '25%',
          sortable: false
        }
      ],
      startyear: 1,
      endyear: 1,
      startmonth: 1,
      endmonth: 12,
      dateitems: [],
      monthitems: [
        { text: '1月', value: 1 },
        { text: '2月', value: 2 },
        { text: '3月', value: 3 },
        { text: '4月', value: 4 },
        { text: '5月', value: 5 },
        { text: '6月', value: 6 },
        { text: '7月', value: 7 },
        { text: '8月', value: 8 },
        { text: '9月', value: 9 },
        { text: '10月', value: 10 },
        { text: '11月', value: 11 },
        { text: '12月', value: 12 }
      ],
      uploadfile: [],
      maxyear: null,
      maxmonth: null,
      fkey: 0
    }
  },
  mounted() {
    const vm = this

    vm.getBaseData()
    vm.getsetdatarange()
    vm.GUUID = vm.getUUID()
    setInterval(function() {
      vm.getUploadSchedule()
    }, 2000)
  },
  methods: {
    getUUID() {
      let d = Date.now()
      if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
      ) {
        d += performance.now() // use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
    },
    getUploadSchedule() {
      const vm = this
      const formData = new FormData()
      formData.append('op', 'GetUploadSchedule')
      formData.append('GUUID', vm.GUUID)

      axios
        .post(vm.RequetURL.uploadurl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('更新資料庫成功！')
              const formData2 = new FormData()
              formData2.append('op', 'ClearApplication')
              formData2.append('GUUID', vm.GUUID)
              axios.post(vm.RequetURL.uploadurl, formData2, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              vm.getBaseData()
              vm.loader = false
            } else if (data === 'ERROR') {
              _SAlert.Error('更新資料庫時出現錯誤！')
              const formData2 = new FormData()
              formData2.append('op', 'ClearApplication')
              formData2.append('GUUID', vm.GUUID)
              axios.post(vm.RequetURL.uploadurl, formData2, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              vm.loader = false
            }
          }
        })
    },
    getsetdatarange() {
      const today = new Date()
      const yyyy = today.getFullYear()

      for (let i = 1978; i <= yyyy; i++) {
        const opt = {}
        opt.value = i
        opt.text = i - 1911 + '年'
        this.dateitems.push(opt)
      }
      this.startyear = this.dateitems[0].value
      this.endyear = this.dateitems[this.dateitems.length - 1].value
    },
    compileDateTime(time) {
      const d = time.split('T')
      const t = d[1].split(':')

      return d[0] + ' ' + t[0] + ':' + t[1]
    },
    getBaseData() {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({ op: 'getBaseData', type: '4' })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            vm.myear = parseInt(data.year)
            vm.maxyear = parseInt(data.showyears.maxyear) - 1911
            vm.mmonth = parseInt(data.month)
            vm.maxmonth = parseInt(data.maxmonth)
            const table = data.table
            vm.items = []
            for (let i = 0; i < table.length; i++) {
              const opt = {}
              opt.sno = table[i].Sno
              opt.datalayout = table[i].DataType
              opt.infodate = table[i].DateStart + ' - ' + table[i].DateEnd
              opt.DateTime = vm.compileDateTime(table[i].DateTime)
              opt.Account = table[i].Account
              vm.items.push(opt)
            }
            vm.setmonthday()
          }
        })
    },
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    },
    setmonthday() {
      const today = new Date()
      const yyyy = today.getFullYear()

      this.myearitems = []
      for (let i = 1978; i <= yyyy; i++) {
        const opt = {}
        opt.value = i - 1911
        opt.text = i - 1911
        this.myearitems.push(opt)
      }
      if (this.myear === 1)
        this.myear = this.myearitems[this.myearitems.length - 1].value

      this.mmonthitems = []
      if (this.myear !== this.maxyear) {
        for (let i = 1; i <= 12; i++) {
          const obj = {}
          obj.text = i
          obj.value = i
          this.mmonthitems.push(obj)
        }
      } else {
        for (let i = 1; i <= this.maxmonth; i++) {
          const obj = {}
          obj.text = i
          obj.value = i
          this.mmonthitems.push(obj)
        }
      }
    },
    UpdateDataDialog() {
      this.fkey = this.fkey + 1
      this.uploadfile = []
      this.startyear = this.dateitems[0].value
      this.endyear = this.dateitems[this.dateitems.length - 1].value
      this.updatedata = true
    },
    UpdateDateSet() {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'setShowDay',
            type: '4',
            year: vm.myear,
            month: vm.mmonth
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('變更成功！')
              vm.dateset = false
            }
          }
        })
    },
    UpdateTable() {
      const vm = this
      const formData = new FormData()

      formData.append('op', 'UploadFiled')
      formData.append('GUUID', this.GUUID)
      formData.append('files', this.uploadfile)
      formData.append('type', '4')
      formData.append('table', this.layout)
      formData.append('datetype', this.datetype)
      formData.append('startdate', this.startyear + '/' + this.startmonth)
      formData.append('enddate', this.endyear + '/' + this.endmonth)
      formData.append('updatename', this.NowLogin.LoginName)
      formData.append('updateaccount', this.NowLogin.LoginAccount)

      axios
        .post(vm.RequetURL.uploadurl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              vm.updatedata = false
              vm.loader = true
            } else {
              _SAlert.Error('上傳檔案時發生錯誤.')
            }
          }
        })
    }
  }
}
</script>
<style lang="scss" scope>
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
