<template>
  <div>
    <div class="baseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.CityDataManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="14"
      ></BaseBreadcrumbs>
      <v-container>
        <v-row>
          <v-col class="AllLeft">
            <ListAddBtn
              :name="'新增分類'"
              :issmall="true"
              @click.native="OpenAddNew(false)"
            ></ListAddBtn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span class="titlespan">分類清單</span>
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
                  v-if="item.Sno != 1"
                  class="EditIcon"
                  src="@/assets/images/EditIcon.svg"
                  alt=""
                  @click="OpenAddNew(true, item.Sno)"
                />
              </template>
              <template #[`item.Delete`]="{ item }">
                <img
                  v-if="item.Sno != 1"
                  class="DeleteIcon"
                  src="@/assets/images/DeleteIcon.svg"
                  alt=""
                  @click="DeleteClass(item.Sno)"
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
        <v-dialog v-model="addnewclass" max-width="700">
          <div class="modal-content layoutdialog">
            <v-container>
              <v-row>
                <v-col v-if="isEdit === false">新增分類</v-col>
                <v-col v-if="isEdit === true">編輯分類</v-col>
              </v-row>
              <v-row>
                <v-col>
                  分類名稱
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="AddNewClassName"
                    :hide-details="true"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter">
                  <Checkbtn
                    :name="'更新'"
                    :issmall="true"
                    style="margin-right: 10px;"
                    @click.native="saveClassName"
                  ></Checkbtn>
                  <Crossbtn
                    :name="'取消'"
                    :issmall="true"
                    @click.native="addnewclass = false"
                  ></Crossbtn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import BaseBreadcrumbs from '@/components/yearreport/BaseBreadcrumbs.vue'
import ListAddBtn from '~/components/button/listaddbtn.vue'
import Pagination from '@/components/table/Pagination.vue'
import Checkbtn from '~/components/button/checkbtn.vue'
import Crossbtn from '~/components/button/crossbtn.vue'
export default {
  components: {
    BaseBreadcrumbs,
    ListAddBtn,
    Pagination,
    Checkbtn,
    Crossbtn
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '分類管理',
      items: [],
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 20
      },
      headers: [
        { text: '排序', value: 'Order', align: 'center', width: '15%' },
        {
          text: '分類名稱',
          value: 'Name',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '更新排序',
          value: 'OrderChange',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '最近更新日期',
          value: 'EditTime',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '管理',
          value: 'Management',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '刪除',
          value: 'Delete',
          align: 'center',
          width: '15%',
          sortable: false
        }
      ],
      yearcategory: [],
      addnewclass: false,
      AddNewClassName: '',
      isEdit: false,
      sno: ''
    }
  },
  mounted() {
    this.getdatatable()
  },
  methods: {
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    },
    CompileTime(date) {
      if (!date) return
      const d = date.split('T')
      if (d.length > 1) {
        return d[0]
      }
      return date
    },
    OpenAddNew(isedit, sno) {
      this.isEdit = isedit
      this.addnewclass = true
      if (isedit) {
        for (let i = 0; i < this.yearcategory.length; i++) {
          const n = this.yearcategory[i]
          if (n.Sno === sno) this.AddNewClassName = n.Name
        }
        this.sno = sno
      } else {
        this.AddNewClassName = ''
        this.sno = ''
      }
    },
    OrderUp(sno, order) {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'UpdateLayoutClass',
            CLASSNAME: vm.AddNewClassName,
            isEdit: 1,
            SNO: sno,
            ORDER: order,
            ISDOWN: 0
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              vm.getdatatable()
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
            op: 'UpdateLayoutClass',
            CLASSNAME: vm.AddNewClassName,
            isEdit: 1,
            SNO: sno,
            ORDER: order,
            ISDOWN: 1
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              vm.getdatatable()
            } else {
              _SAlert.Error('更新時發生錯誤.')
            }
          }
        })
    },
    DeleteClass(sno) {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'DeleteLayoutClass',
            SNO: sno
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('刪除資料成功.')
              setTimeout(function() {
                vm.getdatatable()
                _SAlert.Close()
              }, 500)
            } else {
              _SAlert.Error('更新時發生錯誤.')
            }
          }
        })
    },
    getdatatable() {
      const vm = this
      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify({ op: 'getCategoryData' }))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            vm.yearcategory = data.yearcategory
            const yr = data.yearcategory
            vm.items = []
            for (let i = 0; i < yr.length; i++) {
              const opt = {}
              opt.Sno = yr[i].Sno
              opt.Order = yr[i].Order
              opt.Name = yr[i].Name
              opt.EditTime = vm.CompileTime(yr[i].EditTime)

              vm.items.push(opt)
            }
          }
        })
    },
    saveClassName() {
      const vm = this

      if (vm.isEdit === false) {
        axios
          .post(
            vm.RequetURL.ajaxurl,
            qs.stringify({
              op: 'UpdateLayoutClass',
              CLASSNAME: vm.AddNewClassName,
              isEdit: 0
            })
          )
          .then(function(Response) {
            if (typeof Response === 'object' && Response.status === 200) {
              const data = Response.data
              if (data === 'OK') {
                _SAlert.Success('新增資料成功.')
                setTimeout(function() {
                  vm.getdatatable()
                  vm.addnewclass = false
                  _SAlert.Close()
                }, 500)
              } else {
                _SAlert.Error('更新時發生錯誤.')
              }
            }
          })
      } else {
        axios
          .post(
            vm.RequetURL.ajaxurl,
            qs.stringify({
              op: 'UpdateLayoutClass',
              CLASSNAME: vm.AddNewClassName,
              isEdit: 1,
              SNO: vm.sno
            })
          )
          .then(function(Response) {
            if (typeof Response === 'object' && Response.status === 200) {
              const data = Response.data
              if (data === 'OK') {
                _SAlert.Success('新增資料成功.')
                setTimeout(function() {
                  vm.getdatatable()
                  _SAlert.Close()
                }, 500)
              } else {
                _SAlert.Error('更新時發生錯誤.')
              }
            }
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.layoutdialog {
  max-height: 600px;
  overflow: auto;
  font-size: 16px;
}
</style>
