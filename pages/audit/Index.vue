<template>
  <div>
    <div class="sbaseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.AuditManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="1"
      ></BaseBreadcrumbs>
      <div class="auditsearch">
        <v-container>
          <v-row>
            <v-col style="max-width: 170px;">
              <span class="searchspan">統計單位</span>
            </v-col>
            <v-col style="max-width: 300px;">
              <v-radio-group
                v-model="unitselect"
                :row="true"
                @change="datetypechange"
              >
                <v-radio :value="0" label="年"></v-radio>
                <v-radio :value="1" label="月"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col style="max-width: 170px;">
              <span class="searchspan">搜尋時間</span>
            </v-col>
            <v-col style="max-width: 300px;">
              <v-select
                v-model="startDate"
                :items="dates"
                :hide-details="true"
                background-color="white"
                solo
              ></v-select>
            </v-col>
            <v-col class="AllCenter" style="max-width: 100px;">至</v-col>
            <v-col style="max-width: 300px;">
              <v-select
                v-model="endDate"
                :items="dates"
                :hide-details="true"
                background-color="white"
                solo
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col style="max-width: 170px;">
              <span class="searchspan">查詢模組</span>
            </v-col>
            <v-col style="max-width: 300px;">
              <v-select
                v-model="selectModel"
                :items="models"
                :hide-details="true"
                background-color="white"
                solo
                @change="ModelOnChange"
              ></v-select>
            </v-col>
            <v-col style="max-width: 170px;">
              <span class="searchspan">項目</span>
            </v-col>
            <v-col style="max-width: 300px;">
              <v-select
                v-model="selectProject"
                :items="projects"
                :hide-details="true"
                background-color="white"
                solo
              ></v-select>
            </v-col>
            <v-col style="max-width: 100px;"></v-col>
            <v-col style="max-width: 300px;">
              <SearchBtn
                :name="'開始搜尋'"
                @click.native="SearchRecord"
              ></SearchBtn>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <v-container class="tableview">
      <v-row>
        <v-col>
          <span class="viewnumber">總瀏覽次數: {{ TotalViews }}</span
          ><br />
          <span class="viewnumber">下載次數(表): {{ DownloadTables }}</span
          ><br />
          <span class="viewnumber">下載次數(圖): {{ DownloadViews }}</span>
        </v-col>
        <v-col class="RightBottom">
          <ExportBtn
            :name="'匯出清單'"
            @downloadclick2="downloadfile"
          ></ExportBtn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :id="'table'"
            :headers="headers"
            :items="items"
            :page.sync="pagination.page"
            :items-per-page="pagination.itemsPerPage"
            hide-default-footer
            class="TableStyle2 elevation-3"
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
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import BaseBreadcrumbs from '@/components/audit/Breadcrumbs.vue'
import SearchBtn from '@/components/button/searchbtn.vue'
import ExportBtn from '@/components/button/exportbtn.vue'
import Pagination from '@/components/table/Pagination.vue'
export default {
  components: {
    BaseBreadcrumbs,
    SearchBtn,
    Pagination,
    ExportBtn
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '稽核管理',
      unitselect: 0,
      dates: [],
      startDate: '-1',
      endDate: '-1',
      selectModel: '-1',
      selectProject: '-1',
      models: [],
      projects: [{ value: '-1', text: '全選' }],
      projectdatas: [],
      TotalViews: 0,
      DownloadTables: 0,
      DownloadViews: 0,
      OldestDate: '',
      NewestDate: '',
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 20
      },
      headers: [
        {
          text: '搜尋時間',
          value: 'time',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '瀏覽次數',
          value: 'browsecount',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '下載次數(表)',
          value: 'downloadtable',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '下載次數(圖)',
          value: 'downloadchart',
          align: 'center',
          width: '25%',
          sortable: false
        }
      ],
      items: [],
      itemdatas: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    },
    getData() {
      const vm = this
      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify({ op: 'GetAuditIndex' }))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data

            const models = data.Models
            const mitems = []
            const mdefault = { value: '-1', text: '全選' }
            mitems.push(mdefault)
            for (let i = 0; i < models.length; i++) {
              const option = {}
              option.value = models[i].FunctionName
              option.text = models[i].FunctionName
              mitems.push(option)
            }
            vm.models = mitems

            const combines = data.Combines
            const citems = []
            const cdefault = { value: '-1', text: '全選', FunctionName: '-1' }
            citems.push(cdefault)
            for (let i = 0; i < combines.length; i++) {
              const option = {}
              option.value = combines[i].StatisticItem
              option.text = combines[i].StatisticItem
              option.FunctionName = combines[i].FunctionName
              citems.push(option)
            }
            vm.projectdatas = citems

            const countlist = data.Countlists
            const datas = []
            for (let i = 0; i < countlist.length; i++) {
              const option = {}
              option.Time = countlist[i].Time.split('T')[0]
              option.StatisticItem = countlist[i].StatisticItem
              option.FunctionName = countlist[i].FunctionName
              option.BrowseCount = countlist[i].BrowseCount
              option.DownloadChart = countlist[i].DownloadChart
              option.DownloadTable = countlist[i].DownloadTable
              datas.push(option)
            }
            vm.itemdatas = datas

            const newd = data.NewestDate[0].Column1.split('T')[0]
            const oldd = data.OldestDate[0].Column1.split('T')[0]
            vm.NewestDate = newd
            vm.OldestDate = oldd

            vm.SetYearSelect()
          }
        })
    },
    SetYearSelect() {
      const newd = this.NewestDate
      const oldd = this.OldestDate

      const newy = newd.split('-')[0]
      const oldy = oldd.split('-')[0]

      const ary = []
      for (let i = parseInt(oldy); i <= parseInt(newy); i++) {
        const option = {}
        option.value = i.toString()
        option.text = i.toString()
        ary.push(option)
      }
      this.dates = ary
      this.startDate = this.dates[0].value
      this.endDate = this.dates[this.dates.length - 1].value
    },
    SetMonthSelect() {
      const newd = this.NewestDate
      const oldd = this.OldestDate

      const newa = newd.split('-')
      const olda = oldd.split('-')

      const newy = newa[0]
      const oldy = olda[0]
      const newm = newa[1]
      const oldm = olda[1]

      const ary = []
      for (let i = parseInt(oldy); i <= parseInt(newy); i++) {
        for (let j = 1; j <= 12; j++) {
          if (i === parseInt(oldy) && j < oldm) {
            continue
          } else if (i === parseInt(newy) && j > newm) {
            continue
          } else {
            const option = {}
            option.text = i.toString() + '/' + j.toString()
            option.value = i.toString() + '-' + j.toString()
            ary.push(option)
          }
        }
      }
      this.dates = ary
      this.startDate = this.dates[0].value
      this.endDate = this.dates[this.dates.length - 1].value
    },
    datetypechange() {
      if (this.unitselect === 0) this.SetYearSelect()
      else this.SetMonthSelect()
    },
    SearchRecord() {
      const vm = this
      let ary = vm.itemdatas
      const tmp = []
      let views = 0
      let tables = 0
      let charts = 0
      if (vm.selectModel !== '-1') {
        ary = ary.filter((l) => l.FunctionName === vm.selectModel)
      }

      if (vm.selectProject !== '-1') {
        ary = ary.filter((l) => l.StatisticItem === vm.selectProject)
      }

      if (vm.unitselect === 0) {
        const startyear = parseInt(vm.startDate)
        const endyear = parseInt(vm.endDate)
        for (let i = startyear; i <= endyear; i++) {
          const opt = {}
          opt.time = i + '年'
          opt.browsecount = 0
          opt.downloadtable = 0
          opt.downloadchart = 0

          for (let j = 0; j < ary.length; j++) {
            const year = vm.getYear(ary[j].Time)
            if (year === i) {
              opt.browsecount += ary[j].BrowseCount
              opt.downloadtable += ary[j].DownloadTable
              opt.downloadchart += ary[j].DownloadChart

              views += ary[j].BrowseCount
              tables += ary[j].DownloadTable
              charts += ary[j].DownloadChart
            }
          }
          tmp.push(opt)
        }
      } else if (vm.unitselect === 1) {
        const start = vm.getYearMonth(vm.startDate)
        const end = vm.getYearMonth(vm.endDate)

        const syear = start.year
        const smonth = start.month
        const eyear = end.year
        const emonth = end.month

        for (let i = syear; i <= eyear; i++) {
          for (let j = 1; j <= 12; j++) {
            if (i === syear && j < smonth) {
              continue
            } else if (i === eyear && j > emonth) {
              continue
            } else {
              const opt = {}
              opt.time = i + '年' + '/' + j + '月'
              opt.browsecount = 0
              opt.downloadtable = 0
              opt.downloadchart = 0
              for (let k = 0; k < ary.length; k++) {
                const ddate = vm.getYearMonth(ary[k].Time)
                if (ddate.year === i && ddate.month === j) {
                  opt.browsecount += ary[k].BrowseCount
                  opt.downloadtable += ary[k].DownloadTable
                  opt.downloadchart += ary[k].DownloadChart

                  views += ary[k].BrowseCount
                  tables += ary[k].DownloadTable
                  charts += ary[k].DownloadChart
                }
              }
              tmp.push(opt)
            }
          }
        }
      }

      vm.items = tmp
      vm.TotalViews = views
      vm.DownloadTables = tables
      vm.DownloadViews = charts
    },
    getYear(date) {
      const da = date.split('-')
      if (da.length > 1) {
        return parseInt(da[0])
      }
      return -1
    },
    getYearMonth(date) {
      const da = date.split('-')
      if (da.length > 1) {
        return { year: parseInt(da[0]), month: parseInt(da[1]) }
      }
      return { year: -1, month: -1 }
    },
    downloadfile(opt) {
      const type = opt
      const vm = this
      const form = new FormData()

      const tar = document.getElementById('table')
      const thead = tar.getElementsByTagName('thead')[0]

      const trs = thead.getElementsByTagName('tr')
      const result = []
      for (let i = 0; i < trs.length; i++) {
        const ths = trs[i].getElementsByTagName('th')
        const ppt = {}
        ppt.ths = []
        for (let j = 0; j < ths.length; j++) {
          const ts = ths[j]
          const opt = {}
          opt.rowspan = 1
          opt.colspan = 1
          opt.className = ts.className
          opt.value = ts.innerHTML.replace('<span>', '').replace('</span>', '')
          ppt.ths.push(opt)
        }
        result.push(ppt)
      }

      const result2 = []
      const d = vm.items
      for (let i = 0; i < d.length; i++) {
        const ppt = {}
        ppt.ths = []

        const opt = {}
        opt.rowspan = 1
        opt.colspan = 1
        opt.className = ''
        opt.value = d[i].time
        ppt.ths.push(opt)

        const opt2 = {}
        opt2.rowspan = 1
        opt2.colspan = 1
        opt2.className = ''
        opt2.value = d[i].browsecount
        ppt.ths.push(opt2)

        const opt3 = {}
        opt3.rowspan = 1
        opt3.colspan = 1
        opt3.className = ''
        opt3.value = d[i].downloadtable
        ppt.ths.push(opt3)

        const opt4 = {}
        opt4.rowspan = 1
        opt4.colspan = 1
        opt4.className = ''
        opt4.value = d[i].downloadchart
        ppt.ths.push(opt4)

        result2.push(ppt)
      }

      const otb = {}
      otb.thead = result
      otb.tbody = result2

      const target = JSON.stringify(otb)
      form.set('html', target)
      form.set('title', '就業及失業統計資料查詢系統瀏覽及下載次數表')
      form.set('type', type)
      form.set('totalviews', vm.TotalViews)
      form.set('downloadtable', vm.DownloadTables)
      form.set('downloadviews', vm.DownloadViews)

      axios({
        method: 'post',
        url: vm.RequetURL.ajaxurl,
        data: qs.stringify({ op: 'SetExportLog' })
      }).then((Response) => {
        if (typeof Response === 'object' && Response.status === 200) {
        }
      })

      axios({
        method: 'post',
        url: vm.RequetURL.exporturl2,
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((Response) => {
        if (typeof Response === 'object' && Response.status === 200) {
          const link = document.createElement('a')
          link.href = vm.RequetURL.tabledownload + Response.data
          link.click()
        }
      })
    },
    getExcelJString() {
      const vm = this
      const tary = []
      const items = vm.items

      for (let i = 0; i < items.length; i++) {
        const obj = {}
        obj.time = items[i].time
        obj.browsecount = items[i].browsecount
        obj.downloadtable = items[i].downloadtable
        obj.downloadchart = items[i].downloadchart

        tary.push(obj)
      }
      let jstring = JSON.stringify(tary)

      jstring = jstring
        .replace(/time/g, '搜尋時間')
        .replace(/browsecount/g, '瀏覽次數')
        .replace(/downloadtable/g, '下載次數(表)')
        .replace(/downloadchart/g, '下載次數(圖)')

      return jstring
    },
    ModelOnChange() {
      const vm = this
      if (vm.selectModel !== '-1') {
        vm.projects = vm.projectdatas.filter(
          (l) => l.FunctionName === vm.selectModel || l.FunctionName === '-1'
        )
      } else {
        vm.projects = [{ value: '-1', text: '全選' }]
      }
      vm.selectProject = '-1'
    }
  }
}
</script>
<style lang="scss" scoped>
.sbaseheader {
  width: 100%;
  background-color: #dae8f4;
  height: 200px;
}
.searchspan {
  color: #344059;
  font-size: 18px;
}
.viewnumber {
  color: #344059;
  font-size: 18px;
}
.tableview {
  max-height: calc(100vh - 255px);
  overflow: auto;
}
</style>
