<template>
  <div>
    <div id="test" class="sbaseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.AnnouncementManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="18"
      ></BaseBreadcrumbs>
      <div class="auditsearch">
        <v-container>
          <v-row>
            <v-col style="max-width: 110px;">
              <span class="searchspan">公告類別</span>
            </v-col>
            <v-col style="max-width: 300px;">
              <v-text-field
                v-model="ClassName"
                :hide-details="true"
                class="innerShadow"
                background-color="white"
                outlined
              ></v-text-field>
            </v-col>
            <v-col style="max-width: 110px;">
              <span class="searchspan">內文主旨</span>
            </v-col>
            <v-col style="max-width: 300px;">
              <v-text-field
                v-model="TitleName"
                :hide-details="true"
                class="innerShadow"
                background-color="white"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col style="max-width: 110px;">
              <span class="searchspan">公告期限</span>
            </v-col>
            <v-col class="AllLeft">
              <v-menu
                ref="smenu"
                v-model="smenu"
                :close-on-content-click="false"
                :return-value.sync="sdate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="sdate"
                    :hide-details="true"
                    v-bind="attrs"
                    outlined
                    background-color="white"
                    readonly
                    style="max-width: 300px;"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="sdate" :max="edate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="smenu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.smenu.save(sdate)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <span style="margin: 0px 10px;">至</span>
              <v-menu
                ref="emenu"
                v-model="emenu"
                :close-on-content-click="false"
                :return-value.sync="edate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="edate"
                    :hide-details="true"
                    v-bind="attrs"
                    outlined
                    background-color="white"
                    readonly
                    style="max-width: 300px;"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="edate" :min="sdate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="emenu = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.emenu.save(edate)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col style="max-width: 110px;">
              <span class="searchspan">是否截止</span>
            </v-col>
            <v-col style="max-width: 300px;">
              <v-select
                v-model="selectStop"
                :items="StopItem"
                :hide-details="true"
                background-color="white"
                solo
              ></v-select>
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
    </div>
    <v-container class="tableview">
      <v-row>
        <v-col>
          <ListAddBtn
            :name="'新增公告'"
            :issmall="true"
            @click.native="addannouncement"
          ></ListAddBtn>
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
            <template #[`item.Edit`]="{ item }">
              <img
                class="EditIcon"
                src="@/assets/images/EditIcon.svg"
                alt=""
                @click="editannouncement(item.SNO)"
              />
            </template>
            <template #[`item.Delete`]="{ item }">
              <img
                class="DeleteIcon"
                src="@/assets/images/DeleteIcon.svg"
                alt=""
                @click="deleteannouncement(item.SNO)"
              />
            </template>
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
    <v-dialog v-model="addann" max-width="600">
      <div class="layoutdialog">
        <AddNewAnn
          :key="dkey"
          :tdata="itemdatas"
          @closedialog="addann = false"
          @SaveSuccess="UpdateOk"
        ></AddNewAnn>
      </div>
    </v-dialog>
    <v-dialog v-model="editann" max-width="600">
      <div class="layoutdialog">
        <EditAnn
          :key="dkey"
          :tdata="itemdatas"
          :sno="tarsno"
          @closedialog="editann = false"
          @SaveSuccess="UpdateOk"
        ></EditAnn>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import AddNewAnn from '@/components/announcement/AddNewAnn.vue'
import EditAnn from '@/components/announcement/EditAnn.vue'
import BaseBreadcrumbs from '@/components/announcement/Breadcrumbs.vue'
import ListAddBtn from '~/components/button/listaddbtn.vue'
import SearchBtn from '@/components/button/searchbtn.vue'
import crosscancel from '~/components/button/crosscancel'
export default {
  components: {
    AddNewAnn,
    EditAnn,
    BaseBreadcrumbs,
    ListAddBtn,
    SearchBtn,
    crosscancel
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '訊息公告',
      dkey: 0,
      ClassName: '',
      TitleName: '',
      smenu: false,
      sdate: '',
      emenu: false,
      edate: '',
      selectStop: '-1',
      StopItem: [
        { value: '-1', text: '全選' },
        { value: '0', text: '否' },
        { value: '1', text: '是' }
      ],
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 20
      },
      headers: [
        {
          text: '編號',
          value: 'SNO',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '公告類別',
          value: 'Type',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '內文主旨',
          value: 'Subject',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '公告期限',
          value: 'AccessTime',
          align: 'center',
          width: '15%',
          sortable: false
        },
        {
          text: '最後編輯時間',
          value: 'UpdateTime',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '是否截止',
          value: 'IsEnd',
          align: 'center',
          width: '10%',
          sortable: false
        },
        {
          text: '管理',
          value: 'Edit',
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
      items: [],
      itemdatas: [],
      tarsno: null,
      addann: false,
      editann: false
    }
  },
  mounted() {
    this.getBaseData()
  },
  methods: {
    getBaseData() {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'GetAnnouncementList'
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            vm.itemdatas = data
            const item = []
            for (let i = 0; i < data.length; i++) {
              const tmp = {}
              tmp.SNO = data[i].SNO
              tmp.Type = data[i].Type
              tmp.Subject = data[i].Subject
              tmp.UpdateTime = vm.Format.DateTimeFormat(data[i].UpdateTime)
              if (data[i].IsForEver === 1) {
                tmp.AccessTime = '永久公告'
                tmp.IsEnd = '否'
              } else {
                tmp.AccessTime =
                  vm.Format.DateTimeFormat2(data[i].StartDate) +
                  '-' +
                  vm.Format.DateTimeFormat2(data[i].EndDate)
                const d = new Date().getTime()
                const d1 = new Date(data[i].StartDate).getTime()
                const d2 = new Date(data[i].EndDate).getTime()
                if (d > d2 || d < d1) tmp.IsEnd = '是'
                else tmp.IsEnd = '否'
              }
              item.push(tmp)
            }
            vm.items = item
          }
        })
    },
    Reset() {
      this.ClassName = ''
      this.TitleName = ''
      this.sdate = ''
      this.edate = ''
      this.selectStop = '-1'
      this.SetTable()
    },
    SearchTable() {
      const vm = this
      const data = vm.itemdatas
      const item = []
      for (let i = 0; i < data.length; i++) {
        const tmp = {}
        tmp.SNO = data[i].SNO
        tmp.Type = data[i].Type
        tmp.Subject = data[i].Subject
        tmp.UpdateTime = vm.Format.DateTimeFormat(data[i].UpdateTime)
        if (data[i].IsForEver === 1) {
          tmp.AccessTime = '永久公告'
          tmp.IsEnd = '否'
        } else {
          tmp.AccessTime =
            vm.Format.DateTimeFormat2(data[i].StartDate) +
            '-' +
            vm.Format.DateTimeFormat2(data[i].EndDate)
          const d = new Date().getTime()
          const d2 = new Date(data[i].EndDate).getTime()
          if (d > d2) tmp.IsEnd = '是'
          else tmp.IsEnd = '否'
        }

        if (vm.className !== '' && !tmp.Type.includes(vm.ClassName)) continue
        if (vm.TitleName !== '' && !tmp.Subject.includes(vm.TitleName)) continue
        if (data[i].IsForEver !== 1 && vm.sdate !== '' && vm.edate !== '') {
          const sd = new Date(data[i].StartDate).getTime()
          const ed = new Date(data[i].EndDate).getTime()
          const sd2 = new Date(vm.sdate).getTime()
          const ed2 = new Date(vm.edate).getTime()

          if (sd2 > ed || ed2 < sd) continue
        }
        if (vm.selectStop !== '-1') {
          const tar = vm.selectStop === '0' ? '否' : '是'
          if (tar !== tmp.IsEnd) continue
        }

        item.push(tmp)
      }
      vm.items = item
    },
    SetTable() {
      const data = this.itemdatas
      const item = []
      const vm = this
      for (let i = 0; i < data.length; i++) {
        const tmp = {}
        tmp.SNO = data[i].SNO
        tmp.Type = data[i].Type
        tmp.Subject = data[i].Subject
        tmp.UpdateTime = vm.Format.DateTimeFormat(data[i].UpdateTime)
        if (data[i].IsForEver === 1) {
          tmp.AccessTime = '永久公告'
          tmp.IsEnd = '否'
        } else {
          tmp.AccessTime =
            vm.Format.DateTimeFormat2(data[i].StartDate) +
            '-' +
            vm.Format.DateTimeFormat2(data[i].EndDate)
          const d = new Date().getTime()
          const d2 = new Date(data[i].EndDate).getTime()
          if (d > d2) tmp.IsEnd = '是'
          else tmp.IsEnd = '否'
        }
        item.push(tmp)
      }
      this.items = item
    },
    addannouncement() {
      this.dkey = this.dkey + 1
      this.addann = true
    },
    editannouncement(sno) {
      this.dkey = this.dkey + 1
      this.tarsno = sno
      this.editann = true
    },
    deleteannouncement(sno) {
      const vm = this
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'DeleteAnnouncement',
            Sid: sno
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('刪除資料成功.')
              setTimeout(function() {
                _SAlert.Close()
                vm.getBaseData()
              }, 500)
            } else {
              _SAlert.Error('刪除時發生錯誤.')
            }
          }
        })
    },
    UpdateOk() {
      this.ClassName = ''
      this.TitleName = ''
      this.sdate = ''
      this.edate = ''
      this.selectStop = '-1'
      this.addann = false
      this.editann = false
      this.getBaseData()
    }
  }
}
</script>
<style lang="scss" scoped>
.sbaseheader {
  width: 100%;
  background-color: #dae8f4;
  height: 275px;
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
.layoutdialog {
  background: #ffffff;
  max-height: 600px;
  overflow: auto;
}
</style>
