<template>
  <div>
    <div class="baseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.UserManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
      ></BaseBreadcrumbs>
      <v-container>
        <v-row>
          <v-col>
            <ListAddBtn
              :name="'新增使用者'"
              :issmall="true"
              @click.native="AddOpen = true"
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
              <template #[`item.edit`]="{ item }">
                <img
                  class="EditIcon"
                  src="@/assets/images/EditIcon.svg"
                  alt=""
                  @click="Edit(item.id)"
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
        <v-dialog v-model="EditOpen" max-width="500">
          <div class="modal-content">
            <v-container>
              <v-row>
                <v-col>帳號</v-col>
                <v-col>{{ EditAccount }}</v-col>
              </v-row>
              <v-row>
                <v-col>名稱</v-col>
                <v-col>{{ EditName }}</v-col>
              </v-row>
              <v-row>
                <v-col>所屬單位</v-col>
                <v-col>{{ EditDeptname }}</v-col>
              </v-row>
              <v-row>
                <v-col>建立日期</v-col>
                <v-col>{{ EditDate }}</v-col>
              </v-row>
              <v-row>
                <v-col>權限群組</v-col>
                <v-col>
                  <v-select
                    v-model="EditRole"
                    :items="roles"
                    background-color="white"
                    solo
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>狀態</v-col>
                <v-col>
                  <v-radio-group
                    v-model="EditStatus"
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
                <v-col>刪除使用者</v-col>
                <v-col>
                  <button
                    class="AllCenter btn smallmodalCancelBtn crossBtn"
                    @click="DeleteOpen = true"
                  >
                    刪除
                  </button>
                </v-col>
              </v-row>
              <v-row class="AllCenter">
                <Checkbtn
                  :name="'更新'"
                  :issmall="true"
                  style="margin-right: 10px;"
                  @click.native="Update"
                ></Checkbtn>
                <Crossbtn
                  :name="'取消'"
                  :issmall="true"
                  @click.native="EditOpen = false"
                ></Crossbtn>
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
                    確認刪除 {{ EditAccount }} 嗎?
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter">
                  <Checkbtn
                    :name="'刪除'"
                    :issmall="true"
                    style="margin-right: 10px;"
                    @click.native="Delete"
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
        <v-dialog v-model="AddOpen" max-width="500">
          <div class="modal-content">
            <v-container>
              <v-row>
                <v-col class="AllCenter">
                  <span class="layouttitle1">新增使用者</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>帳號</v-col>
                <v-col>
                  <v-text-field
                    v-model="AddAccount"
                    type="text"
                    background-color="white"
                    solo
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>權限群組</v-col>
                <v-col>
                  <v-select
                    v-model="AddRole"
                    :items="roles"
                    background-color="white"
                    solo
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>狀態</v-col>
                <v-col>
                  <v-radio-group
                    v-model="AddStatus"
                    :hide-details="true"
                    style="display: inline-block;"
                    row
                  >
                    <v-radio :value="1" label="啟用" color="#479FF1"></v-radio>
                    <v-radio :value="0" label="停用" color="#479FF1"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row class="AllCenter">
                <Checkbtn
                  :name="'新增'"
                  :issmall="true"
                  style="margin-right: 10px;"
                  @click.native="AddUser"
                ></Checkbtn>
                <Crossbtn
                  :name="'取消'"
                  :issmall="true"
                  @click.native="AddClose"
                ></Crossbtn>
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
    Pagination,
    Checkbtn,
    Crossbtn,
    ListAddBtn
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '使用者管理',
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 10
      },
      headers: [
        { text: '帳號', value: 'account', align: 'center', width: '15%' },
        { text: '名稱', value: 'name', align: 'center', width: '10%' },
        {
          text: '所屬單位',
          value: 'deptname',
          align: 'center',
          width: '15%'
        },
        {
          text: '最後變更時間',
          value: 'edittime',
          align: 'center',
          width: '20%'
        },
        {
          text: '權限群組',
          value: 'group',
          align: 'center',
          width: '20%'
        },
        {
          text: '狀態',
          value: 'status',
          align: 'center',
          width: '10%'
        },
        {
          text: '管理',
          value: 'edit',
          align: 'center',
          width: '10%',
          sortable: false
        }
      ],
      items: [],
      roles: [],
      EditOpen: false,
      EditId: -1,
      EditAccount: '',
      EditName: '',
      EditDeptname: '',
      EditDate: '',
      EditRole: 1,
      EditStatus: 0,
      DeleteOpen: false,
      AddOpen: false,
      AddAccount: '',
      AddRole: 1,
      AddStatus: 1
    }
  },
  mounted() {
    this.getAccountList()
  },
  methods: {
    getAccountList() {
      const vm = this
      vm.items = []
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({ op: 'GetBaseUserManagement' })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data

            const rdata = data.Role
            for (let i = 0; i < rdata.length; i++) {
              const item = {}

              item.value = rdata[i].Sno
              item.text = rdata[i].Name

              vm.roles.push(item)
            }

            const adata = data.Account
            for (let i = 0; i < adata.length; i++) {
              const item = {}

              item.id = adata[i].ID
              item.account = adata[i].Account
              item.name = adata[i].Name === '' ? '-' : adata[i].Name
              item.deptname = adata[i].Deptname === '' ? '-' : adata[i].Deptname
              item.role = adata[i].Role
              item.group = vm.GetGroup(rdata, adata[i].Role)
              item.edittime = vm.Format.DateTimeFormat(adata[i].EditTime)
              item.createtime = vm.Format.DateTimeFormat(adata[i].CreateTime)
              item.status = vm.Format.GetStatusCH(adata[i].Status)

              vm.items.push(item)
            }
          }
        })
    },
    GetGroup(Role, Roleid) {
      const tar = Role.filter((f) => f.Sno === Roleid)
      if (tar.length > 0) return tar[0].Name
      return ''
    },
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    },
    Edit(_id) {
      const vm = this
      const data = vm.items
      for (let i = 0; i < data.length; i++) {
        if (_id === data[i].id) {
          vm.EditId = _id
          vm.EditAccount = data[i].account
          vm.EditName = data[i].name === '' ? '-' : data[i].name
          vm.EditDeptname = data[i].deptname === '' ? '-' : data[i].deptname
          vm.EditDate = data[i].createtime
          vm.EditStatus = vm.Format.GetStatusValue(data[i].status)
          vm.EditRole = data[i].role
          vm.EditOpen = true
          break
        }
      }
    },
    Delete() {
      const vm = this
      const _id = vm.EditId
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'DeleteAccount',
            id: _id
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            _SAlert.Success('刪除成功！相關權限將於下次登入時生效.')
            setTimeout(function() {
              _SAlert.Close()
              vm.EditOpen = false
              vm.DeleteOpen = false
              vm.getAccountList()
            }, 1000)
          }
        })
    },
    AddClose() {
      this.AddOpen = false
      this.AddAccount = ''
      this.AddRole = 1
      this.AddStatus = 1
    },
    AddUser() {
      const vm = this
      const _id = this.AddAccount
      const _role = this.AddRole
      const _status = this.AddStatus
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'InsertNewAccount',
            id: _id,
            status: _status,
            role: _role
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            _SAlert.Success('新增帳號成功！')
            setTimeout(function() {
              _SAlert.Close()
              vm.AddClose()
              vm.getAccountList()
            }, 1000)
          }
        })
    },
    Update() {
      const vm = this
      const _id = vm.EditId
      const _status = vm.EditStatus
      const _role = vm.EditRole
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'UpdateAccountStatus',
            id: _id,
            status: _status,
            role: _role
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            _SAlert.Success('更新成功！相關權限將於下次登入時生效.')
            setTimeout(function() {
              _SAlert.Close()
              vm.EditOpen = false
              vm.getAccountList()
            }, 1000)
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped></style>
