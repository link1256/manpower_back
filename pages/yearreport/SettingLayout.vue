<template>
  <div>
    <div class="sbaseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.CityDataManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="14"
      ></BaseBreadcrumbs>
      <div class="layoutsearch">
        <v-container>
          <v-row>
            <v-col class="AllCenter" style="max-width: 330px;">
              <span
                class="searchspan"
                style="margin-right: 10px; min-width: 60px;"
                >表編號:
              </span>
              <v-combobox
                v-model="SearchTableNo"
                :items="tablenoitem"
                :hide-details="true"
                background-color="white"
                solo
                style="max-width: 250px;"
              >
              </v-combobox>
            </v-col>
            <v-col class="AllCenter" style="max-width: 450px;">
              <span class="searchspan" style="margin-right: 10px;"
                >主表名稱:
              </span>
              <v-text-field
                v-model="SearchTableName"
                :hide-details="true"
                class="innerShadow"
                background-color="white"
                solo
              ></v-text-field>
            </v-col>
            <v-col class="AllCenter" style="max-width: 350px;">
              <SearchBtn
                :name="'開始搜尋'"
                @click.native="SearchTable"
              ></SearchBtn>
              <crosscancel
                :name="'重設條件'"
                style="margin-left: 15px;"
                @click.native="Reset"
              ></crosscancel>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-container>
        <v-row>
          <v-col class="AllLeft">
            <ListDropBtn
              :name="'新增套版'"
              :issmall="true"
              @listdropclick="listdropclick"
              @click.native="dopen"
            ></ListDropBtn>
            <ListAddBtn
              :name="'插入套版'"
              :issmall="true"
              style="margin-left: 10px;"
              @click.native="listdropclick('pluglayout')"
            ></ListAddBtn>
            <graybtn
              v-if="false"
              :name="'排序設定'"
              :issmall="true"
              style="margin-left: 10px;"
              @click.native="OpenSortLayout"
            ></graybtn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="titlespan">資料歷程</span>
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
              <template #[`item.Management`]="{ item }">
                <img
                  class="EditIcon"
                  src="@/assets/images/EditIcon.svg"
                  alt=""
                  @click="EditTheForm(item.Sno)"
                />
              </template>
              <template #[`item.DownloadLayout`]="{ item }">
                <img
                  v-if="item.IsUpload === 1"
                  class="DeleteIcon"
                  src="@/assets/images/Downloadfile.svg"
                  alt=""
                  @click="
                    DownloadLayout(item.Sno, item.IsUpload, item.filename)
                  "
                />
              </template>
              <template #[`item.Delete`]="{ item }">
                <img
                  class="DeleteIcon"
                  src="@/assets/images/DeleteIcon.svg"
                  alt=""
                  @click="DeleteLayout(item.Sno)"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row v-if="pagination.pageCount != 1">
          <Pagination
            :length="items.length"
            :pagecount="pagination.pageCount"
          ></Pagination>
        </v-row>
      </v-container>
      <v-dialog v-model="addlayout" max-width="600">
        <div class="layoutdialog">
          <AddNewLayout
            :key="dkey"
            :yearcategory="yearcategory"
            :tdata="data"
            @closedialog="addlayout = false"
            @SaveSuccess="UpdateOk"
          ></AddNewLayout>
        </div>
      </v-dialog>
      <v-dialog v-model="addlayouthas" max-width="600">
        <div class="layoutdialog">
          <AddNewLayoutHas
            :key="dkey"
            :yearcategory="yearcategory"
            :snumbers="snumbers"
            :tdata="data"
            @closedialog="addlayouthas = false"
            @SaveSuccess="UpdateOk"
          ></AddNewLayoutHas>
        </div>
      </v-dialog>
      <v-dialog v-model="pluglayout" max-width="600">
        <div class="layoutdialog">
          <PlugsLayout
            :key="dkey"
            :yearcategory="yearcategory"
            :snumbers="snumbers"
            :tdata="data"
            @closedialog="pluglayout = false"
            @SaveSuccess="UpdateOk"
          ></PlugsLayout>
        </div>
      </v-dialog>
      <v-dialog v-model="eidtlayout" max-width="600">
        <div class="layoutdialog">
          <EditLayout
            :key="dkey"
            :sno="tarsno"
            :yearcategory="yearcategory"
            :snumbers="snumbers"
            :tdata="data"
            @closedialog="eidtlayout = false"
            @SaveSuccess="UpdateOk"
          ></EditLayout>
        </div>
      </v-dialog>
      <v-dialog v-model="sortlayout" max-width="600">
        <div class="layoutdialog">
          <SortLayout
            :key="dkey"
            :tdata="data"
            :psno="sortpreno"
            @clostSortLayout="sortlayout = false"
            @Updatetable="SortUpdate"
          ></SortLayout>
        </div>
      </v-dialog>
      <v-dialog v-model="DeleteOpen" max-width="600">
        <div class="modal-content">
          <v-container>
            <v-row>
              <v-col class="AllCenter">
                <span style="font-size: 20px;">
                  確認刪除該筆資料嗎?
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="AllCenter">
                <Checkbtn
                  :name="'刪除'"
                  :issmall="true"
                  style="margin-right: 10px;"
                  @click.native="DeleteForm()"
                ></Checkbtn>
                <Crossbtn
                  :name="'取消'"
                  :issmall="true"
                  @click.native="DeleteOpen = false"
                ></Crossbtn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-dialog>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import BaseBreadcrumbs from '@/components/yearreport/BaseBreadcrumbs.vue'
import ListAddBtn from '~/components/button/listaddbtn.vue'
import ListDropBtn from '~/components/button/listdropbtn.vue'
import graybtn from '~/components/button/graybtn.vue'
import Pagination from '@/components/table/Pagination.vue'
import AddNewLayout from '@/components/yearreport/AddNewLayout.vue'
import AddNewLayoutHas from '@/components/yearreport/AddNewLayout_Has.vue'
import PlugsLayout from '@/components/yearreport/PlugsLayout.vue'
import EditLayout from '@/components/yearreport/EditLayout.vue'
import SortLayout from '@/components/yearreport/SortLayout.vue'
import SearchBtn from '@/components/button/searchbtn.vue'
import Crossbtn from '~/components/button/crossbtn.vue'
import Checkbtn from '@/components/button/checkbtn.vue'
import crosscancel from '~/components/button/crosscancel'
export default {
  components: {
    BaseBreadcrumbs,
    ListAddBtn,
    ListDropBtn,
    graybtn,
    Pagination,
    AddNewLayout,
    AddNewLayoutHas,
    PlugsLayout,
    EditLayout,
    SortLayout,
    SearchBtn,
    Crossbtn,
    Checkbtn,
    crosscancel
  },
  layout: 'BackStage',
  data() {
    return {
      loader: false,
      GUUID: null,
      HeaderTitle: '套版維護',
      dateset: false,
      updatedata: false,
      items: [],
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 20
      },
      mdate: 1,
      mdateitems: [],
      headers: [
        { text: '編號', value: 'T_ID', align: 'center', width: '10%' },
        {
          text: '主表名稱',
          value: 'T_NAME',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '副表名稱',
          value: 'SUB_NAME',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '分類',
          value: 'Name',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '統計期(民國)',
          value: 'DateTime',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '最近更新日期',
          value: 'UpdateTime',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '管理',
          value: 'Management',
          align: 'center',
          width: '5%',
          sortable: false
        },
        {
          text: '下載套版',
          value: 'DownloadLayout',
          align: 'center',
          width: '5%',
          sortable: false
        },
        {
          text: '刪除',
          value: 'Delete',
          align: 'center',
          width: '5%',
          sortable: false
        }
      ],
      layout: 'Year_Table_Timeline',
      layoutitems: [
        { text: '表側為年分', value: 'Year_Table_Timeline' },
        { text: '表側非年分', value: 'Year_Table_Nonetimeline' }
      ],
      startyear: 1,
      endyear: 1,
      dateitems: [],
      uploadfile: [],
      addlayout: false,
      yearcategory: [],
      dkey: 0,
      addlayouthas: false,
      snumbers: [],
      data: [],
      pluglayout: false,
      tarsno: '',
      eidtlayout: false,
      sortlayout: false,
      sortpreno: '',
      SearchTableNo: '',
      tablenoitem: [],
      SearchTableName: '',
      DeleteOpen: false,
      DeleteSno: ''
    }
  },
  mounted() {
    const vm = this
    vm.getBaseData()
  },
  methods: {
    OpenSortLayout() {
      this.sortpreno = ''
      this.dkey = this.dkey + 1
      this.sortlayout = true
    },
    SortUpdate(prno) {
      this.getBaseData()
      this.sortpreno = prno
      this.dkey = this.dkey + 1
    },
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    },
    EditTheForm(sno) {
      this.tarsno = sno
      this.dkey = this.dkey + 1
      this.eidtlayout = true
    },
    DownloadLayout(sno, hasfile, filename) {
      const vm = this
      if (hasfile !== 1) {
        _SAlert.Error('此表並未上傳套版至伺服器.')
      } else {
        axios
          .post(
            vm.RequetURL.ajaxurl,
            qs.stringify({
              op: 'DownLoadLayoutFile',
              SNO: sno,
              FILENAME: filename
            }),
            { responseType: 'arraybuffer' }
          )
          .then(function(Response) {
            if (typeof Response === 'object' && Response.status === 200) {
              const byte = Response.data
              const downLink = document.createElement('a')
              if (!('download' in downLink)) return false
              downLink.download = filename
              downLink.style.display = 'none'
              const blobURL = new Blob([byte], {
                type: 'application/vnd.ms-excel;'
              })
              downLink.href = URL.createObjectURL(blobURL)
              document.body.appendChild(downLink)
              downLink.click()
              document.body.removeChild(downLink)
            }
          })
      }
    },
    dopen() {
      this.dkey = this.dkey + 1
      this.addlayout = true
    },
    listdropclick(type) {
      if (type === 'addnewlayout') {
        this.addlayout = true
        this.dkey = this.dkey + 1
      } else if (type === 'addlayouthas') {
        this.addlayouthas = true
        this.dkey = this.dkey + 1
      } else if (type === 'pluglayout') {
        this.pluglayout = true
        this.dkey = this.dkey + 1
      }
    },
    Reset() {
      this.SearchTableName = ''
      this.SearchTableNo = ''
      this.SearchTable()
    },
    UpdateOk() {
      this.eidtlayout = false
      this.pluglayout = false
      this.addlayouthas = false
      this.addlayout = false
      this.getBaseData()
    },
    DeleteLayout(sno) {
      this.DeleteSno = sno
      this.DeleteOpen = true
    },
    DeleteForm() {
      if (!this.DeleteSno || this.DeleteSno === '') return

      const vm = this
      const formData = new FormData()
      formData.append('op', 'DeleteLayout')
      formData.append('SNO', this.DeleteSno)

      axios
        .post(vm.RequetURL.uploadurl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            vm.DeleteOpen = false
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('刪除資料成功.')
              vm.getBaseData()
            } else {
              _SAlert.Error('刪除資料時發生錯誤.')
            }
          }
        })
    },
    CompileTime(date) {
      if (!date) return
      const d = date.split('T')
      if (d.length > 1) {
        return d[0]
      }
      return date
    },
    SearchTable() {
      const vm = this
      let no = vm.SearchTableNo
      const text = vm.SearchTableName

      let table = vm.data

      if (no.value) {
        no = parseInt(no.value)
        table = table.filter((f) => f.T_ID === no)
      } else if (no !== '') {
        no = parseInt(no)
        table = table.filter((f) => f.T_ID === no)
      }

      if (text !== '') {
        table = table.filter((f) => f.T_NAME.includes(text))
      }

      vm.items = []
      for (let i = 0; i < table.length; i++) {
        const opt = {}
        opt.T_ID = table[i].T_ID
        opt.T_NAME = table[i].T_NAME
        opt.SUB_NAME = table[i].SUB_NAME
        if (table[i].E_YEAR !== -1)
          opt.DateTime = table[i].S_YEAR + '-' + table[i].E_YEAR
        else opt.DateTime = table[i].S_YEAR + '-'

        opt.UpdateTime = vm.CompileTime(table[i].EDITTIME)
        opt.Name = table[i].Name
        opt.Sno = table[i].SNO
        opt.IsUpload = table[i].ISUPLOAD
        opt.filename = table[i].FORM_NAME

        vm.items.push(opt)
      }
    },
    getBaseData() {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({ op: 'getSettingLayoutData' })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            const table = data.table
            vm.items = []
            for (let i = 0; i < table.length; i++) {
              const opt = {}
              opt.T_ID = table[i].T_ID
              opt.T_NAME = table[i].T_NAME
              opt.SUB_NAME = table[i].SUB_NAME
              if (table[i].E_YEAR !== -1)
                opt.DateTime = table[i].S_YEAR + '-' + table[i].E_YEAR
              else opt.DateTime = table[i].S_YEAR + '-'

              opt.UpdateTime = vm.CompileTime(table[i].EDITTIME)
              opt.Name = table[i].Name
              opt.Sno = table[i].SNO
              opt.IsUpload = table[i].ISUPLOAD
              opt.filename = table[i].FORM_NAME

              vm.items.push(opt)
            }
            vm.data = table
            vm.yearcategory = data.yearcategory
            vm.snumbers = [...new Set(table.map((item) => item.T_ID))]
            for (let i = 0; i < vm.snumbers.length; i++) {
              const opt = {}
              opt.text = vm.snumbers[i]
              opt.value = vm.snumbers[i]
              vm.tablenoitem.push(opt)
            }
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.sbaseheader {
  width: 100%;
  background-color: #dae8f4;
  height: 145px;
}
.layoutdialog {
  background: #ffffff;
  max-height: 600px;
  overflow: auto;
}
</style>
