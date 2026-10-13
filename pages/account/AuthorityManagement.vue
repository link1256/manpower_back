<template>
  <div>
    <div class="baseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.AuthorityManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
      ></BaseBreadcrumbs>
      <v-container>
        <v-row>
          <v-col>
            <ListAddBtn
              :name="'新增群組'"
              :issmall="true"
              @click.native="AddNewList"
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
              <template #[`item.status`]="{ item }">
                <label
                  v-if="item.status === 1"
                  style="font-size: 16px; color: #344059;"
                >
                  啟用中
                </label>
                <label
                  v-if="item.status === 0"
                  style="font-size: 16px; color: #D0414E;"
                >
                  停用中
                </label>
              </template>
              <template #[`item.edit`]="{ item }">
                <img
                  v-if="item.defa != 1"
                  class="EditIcon"
                  src="@/assets/images/EditIcon.svg"
                  alt=""
                  @click="EditList(item.id)"
                />
              </template>
              <template #[`item.delete`]="{ item }">
                <img
                  v-if="item.defa != 1"
                  class="DeleteIcon"
                  src="@/assets/images/DeleteIcon.svg"
                  alt=""
                  @click="DeleteList(item.id, item.name)"
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
        <v-dialog v-model="AddEditOpen" max-width="500">
          <div class="modal-content">
            <v-container>
              <v-row>
                <v-col>群組名稱</v-col>
                <v-col>
                  <v-text-field
                    v-model="GroupName"
                    :hide-details="true"
                    class="innerShadow"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="IsEdit === true">
                <v-col>最後變更日期</v-col>
                <v-col>{{ EditTime }}</v-col>
              </v-row>
              <v-row>
                <v-col>狀態</v-col>
                <v-col>
                  <v-radio-group
                    v-model="Status"
                    :hide-details="true"
                    style="display: inline-block;"
                    row
                  >
                    <v-radio :value="1" label="啟用" color="#479FF1"></v-radio>
                    <v-radio :value="0" label="停用" color="#479FF1"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>權限功能</v-col>
                <v-col>
                  <v-container style="background:#F4F7F9; border-radius: 5px;">
                    <v-checkbox
                      v-for="(item, index) in RoleListitems"
                      :key="index"
                      v-model="RoleSelected"
                      :label="item.name"
                      :value="item.id"
                    ></v-checkbox>
                  </v-container>
                </v-col>
              </v-row>
              <v-row>
                <v-col :colspan="2" class="AllCenter">
                  <label style="color: #DF6573;">
                    {{ ErrorMessage }}
                  </label>
                </v-col>
              </v-row>
              <v-row>
                <v-col :colspan="2" class="AllCenter">
                  <Checkbtn
                    v-if="IsEdit === false"
                    :name="'新增'"
                    :issmall="true"
                    style="margin-right: 10px;"
                    @click.native="AddList"
                  ></Checkbtn>
                  <Checkbtn
                    v-if="IsEdit === true"
                    :name="'更新'"
                    :issmall="true"
                    style="margin-right: 10px;"
                    @click.native="UpdateList"
                  ></Checkbtn>
                  <Crossbtn
                    :name="'取消'"
                    :issmall="true"
                    @click.native="AddEditOpen = false"
                  ></Crossbtn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-dialog>
        <v-dialog v-model="DeleteOpen" max-width="600">
          <div class="modal-content">
            <v-container>
              <v-row>
                <v-col class="AllCenter">
                  <span style="font-size: 20px;">
                    確認刪除 {{ NowDeleteName }} 群組嗎?
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter">
                  <Checkbtn
                    :name="'刪除'"
                    :issmall="true"
                    style="margin-right: 10px;"
                    @click.native="DeleteItemList"
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
      </v-container>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import BaseBreadcrumbs from '@/components/account/Breadcrumbs.vue'
import ListAddBtn from '~/components/button/listaddbtn.vue'
import Pagination from '@/components/table/Pagination.vue'
import Crossbtn from '~/components/button/crossbtn.vue'
import Checkbtn from '@/components/button/checkbtn.vue'
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
      HeaderTitle: '權限群組管理',
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10
      },
      headers: [
        {
          text: '群組名稱',
          value: 'name',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '最後編輯使用者',
          value: 'editname',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '最後變更時間',
          value: 'edittime',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '狀態',
          value: 'status',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '管理',
          value: 'edit',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '刪除',
          value: 'delete',
          align: 'center',
          width: '10%',
          sortable: false
        }
      ],
      RoleListitems: [],
      items: [],
      AddEditOpen: false,
      IsEdit: false,
      GroupName: '',
      EditTime: '',
      Status: 1,
      RoleSelected: [],
      ErrorMessage: '',
      NowEditId: null,
      DeleteOpen: false,
      NowDeleteId: null,
      NowDeleteName: ''
    }
  },
  mounted() {
    const vm = this
    vm.PageStyle.SetLayoutStyle(
      vm.$store,
      null,
      vm.$store.state.Utils.SystemCode.LeftFunctionCode.AuthorityManagement
    )
    vm.getRoleTemplate()
    vm.getRoleList()
  },
  methods: {
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    },
    getRoleTemplate() {
      const vm = this
      vm.items = []
      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify({ op: 'getRoleTemplate' }))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            for (let i = 0; i < data.length; i++) {
              const item = {}
              item.id = data[i].Sno
              item.name = data[i].Name
              item.edittime = vm.Format.DateTimeFormat(data[i].EditTime)
              item.editname = data[i].AccountName
              item.status = data[i].Status
              item.rolestring = data[i].RoleSno
              item.defa = data[i].Default
              vm.items.push(item)
            }
          }
        })
    },
    getRoleList() {
      const vm = this
      vm.RoleListitems = []
      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify({ op: 'getRoleList' }))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            for (let i = 0; i < data.length; i++) {
              const item = {}
              item.id = data[i].RoleSno
              item.name = data[i].RoleName
              vm.RoleListitems.push(item)
            }
          }
        })
    },
    AddNewList() {
      const vm = this
      vm.AddEditOpen = true
      vm.IsEdit = false
      vm.NowEditId = null
      vm.GroupName = ''
      vm.Status = 1
      vm.RoleSelected = []
      vm.ErrorMessage = ''
    },
    EditList(id) {
      const vm = this
      vm.NowEditId = id
      vm.AddEditOpen = true
      vm.IsEdit = true
      vm.EditTime = ''
      vm.GroupName = ''
      vm.Status = 1
      vm.RoleSelected = []
      vm.ErrorMessage = ''

      const data = vm.items
      for (let i = 0; i < data.length; i++) {
        if (id === data[i].id) {
          const item = data[i]
          vm.GroupName = item.name
          vm.EditTime = item.edittime
          vm.Status = item.status
          const rolearray = item.rolestring.split(',')
          if (rolearray.length >= 1) vm.RoleSelected = rolearray
          break
        }
      }
    },
    DeleteList(id, name) {
      const vm = this
      vm.DeleteOpen = true
      vm.NowDeleteId = id
      vm.NowDeleteName = name
    },
    DeleteItemList() {
      const vm = this
      if (vm.NowDeleteId === null) return

      const _postdata = {}
      _postdata.op = 'DeleteRoleTemplate'
      _postdata.Sno = vm.NowDeleteId

      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify(_postdata))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('刪除成功！相關權限將於下次登入時生效.')
              setTimeout(function() {
                _SAlert.Close()
                vm.DeleteOpen = false
                vm.NowDeleteId = null
                vm.NowDeleteName = ''
                vm.getRoleTemplate()
              }, 1000)
            }
          }
        })
    },
    AddList() {
      const vm = this
      const _postdata = {}
      _postdata.op = 'AddNewRoleTemplate'
      _postdata.Name = vm.GroupName
      _postdata.EditAccount = 'supergeo'
      _postdata.Status = vm.Status

      let rolestring = ''
      for (let i = 0; i < vm.RoleSelected.length; i++) {
        if (rolestring !== '') rolestring += ','
        rolestring += vm.RoleSelected[i]
      }
      _postdata.RoleSno = rolestring

      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify(_postdata))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('新增成功！')
              setTimeout(function() {
                _SAlert.Close()
                vm.AddEditOpen = false
                vm.getRoleTemplate()
              }, 1000)
            }
          }
        })
    },
    UpdateList() {
      const vm = this
      if (vm.NowEditId === null) return

      const _postdata = {}
      _postdata.op = 'EditRoleTemplate'
      _postdata.Sno = vm.NowEditId
      _postdata.Name = vm.GroupName
      _postdata.EditAccount = 'supergeo'
      _postdata.Status = vm.Status

      let rolestring = ''
      for (let i = 0; i < vm.RoleSelected.length; i++) {
        if (rolestring !== '') rolestring += ','
        rolestring += vm.RoleSelected[i]
      }
      _postdata.RoleSno = rolestring

      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify(_postdata))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('更新成功！相關權限將於下次登入時生效.')
              setTimeout(function() {
                _SAlert.Close()
                vm.AddEditOpen = false
                vm.getRoleTemplate()
              }, 1000)
            }
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped></style>
