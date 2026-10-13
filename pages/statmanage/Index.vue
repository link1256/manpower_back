<template>
  <div>
    <div class="baseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.StatManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="20"
      ></BaseBreadcrumbs>
      <v-container>
        <v-row>
          <v-col class="AllLeft">
            <ListAddBtn
              :name="'新增統計互動'"
              :issmall="true"
              @click.native="UpdateDataDialog"
            ></ListAddBtn>
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
              <template #[`item.OrderChange`]="{ item }">
                <img
                  v-if="item.Order < items.length"
                  class="EditIcon"
                  src="@/assets/images/DownArrow.svg"
                  alt=""
                  @click="OrderDown(item.Sno, item.Order)"
                />
                <img
                  v-if="item.Order != 1"
                  class="EditIcon"
                  src="@/assets/images/UpArrow.svg"
                  alt=""
                  @click="OrderUp(item.Sno, item.Order)"
                />
              </template>
              <template #[`item.Management`]="{ item }">
                <img
                  class="EditIcon"
                  src="@/assets/images/EditIcon.svg"
                  alt=""
                  @click="EditTheForm(item.Sno)"
                />
              </template>
              <template #[`item.Delete`]="{ item }">
                <img
                  class="DeleteIcon"
                  src="@/assets/images/DeleteIcon.svg"
                  alt=""
                  @click="DeleteLayout(item.Sno, item.Order, item.Name)"
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
      <v-dialog v-model="editlayout" max-width="600">
        <div class="layoutdialog">
          <AddNewState
            :key="edkey"
            :isedit="isedit"
            :editsno="editsno"
            @closeEditLayout="editlayout = false"
            @SaveSuccess="LayOutSave"
          ></AddNewState>
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
import BaseBreadcrumbs from '@/components/announcement/Breadcrumbs.vue'
import ListAddBtn from '~/components/button/listaddbtn.vue'
import Pagination from '@/components/table/Pagination.vue'
import AddNewState from '@/components/statment/AddNewStat.vue'
import Crossbtn from '~/components/button/crossbtn.vue'
import Checkbtn from '@/components/button/checkbtn.vue'
export default {
  components: {
    BaseBreadcrumbs,
    ListAddBtn,
    Pagination,
    AddNewState,
    Crossbtn,
    Checkbtn
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '統計互動管理',
      items: [],
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10
      },
      headers: [
        {
          text: '編號',
          value: 'Sno',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '名稱',
          value: 'Name',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '新增日期',
          value: 'CreateDate',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '開始日期',
          value: 'StartDate',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '結束日期',
          value: 'EndDate',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '狀態',
          value: 'State',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '順序',
          value: 'OrderChange',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '管理',
          value: 'Management',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '刪除',
          value: 'Delete',
          align: 'center',
          width: '10%',
          sortable: false
        }
      ],
      edkey: 0,
      editlayout: false,
      isedit: false,
      editno: '',
      DeleteOpen: false,
      deleteno: '',
      deleteorder: '',
      deletename: ''
    }
  },
  mounted() {
    const vm = this

    vm.GetStatTable()
  },
  methods: {
    UpdateDataDialog() {
      this.isedit = false
      this.editno = ''
      this.edkey++
      this.editlayout = true
    },
    GetStatTable() {
      const vm = this
      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify({ op: 'GetStatTable' }))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            vm.items = data
          }
        })
    },
    EditTheForm(sno) {
      this.isedit = true
      this.editsno = sno
      this.edkey++
      this.editlayout = true
    },
    DeleteForm() {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'DeleteStatItem',
            SNO: vm.deleteno,
            ORDER: vm.deleteorder,
            T_NAME: vm.deletename
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('編輯資料成功.')
              setTimeout(function() {
                _SAlert.Close()
                vm.GetStatTable()
                vm.DeleteOpen = false
              }, 500)
            } else {
              _SAlert.Error('刪除時發生錯誤.')
            }
          }
        })
    },
    DeleteLayout(sno, order, name) {
      this.deleteno = sno
      this.deleteorder = order
      this.deletename = name
      this.DeleteOpen = true
    },
    OrderUp(sno, order) {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'SetStatOrder',
            SNO: sno,
            ORDER: order,
            ISDOWN: 0
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              vm.GetStatTable()
            } else {
              _SAlert.Error('更新時發生錯誤.')
            }
          }
        })
    },
    OrderDown(sno, order) {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'SetStatOrder',
            SNO: sno,
            ORDER: order,
            ISDOWN: 1
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              vm.GetStatTable()
            } else {
              _SAlert.Error('更新時發生錯誤.')
            }
          }
        })
    },
    LayOutSave() {
      this.GetStatTable()
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
.layoutdialog {
  background: #ffffff;
  max-height: 620px;
  overflow: auto;
}
</style>
