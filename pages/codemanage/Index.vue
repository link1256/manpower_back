<template>
  <div>
    <div class="sbaseheader">
      <BaseBreadcrumbs
        :reviewstep="
          $store.state.Utils.SystemCode.LeftFunctionCode.CodeManagement
        "
        :headertitle="HeaderTitle"
        :breadcrumbstext="HeaderTitle"
        :parentmenu="19"
      ></BaseBreadcrumbs>
      <div class="auditsearch">
        <v-container>
          <v-row>
            <v-col>
              <span class="searchspan">代碼分類</span>
            </v-col>
            <v-col>
              <v-select
                v-model="ctype"
                :items="ctypes"
                :hide-details="true"
                background-color="white"
                solo
              ></v-select>
            </v-col>
            <v-col>
              <SearchBtn
                :name="'開始搜尋'"
                @click.native="SearchCode"
              ></SearchBtn>
            </v-col>
            <v-col>
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
                @click="EditCode(item.CAT, item.DES_ZH, item.DES_EN)"
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
    <v-dialog v-model="updatecode" max-width="500">
      <div class="modal-content">
        <v-container>
          <v-row>
            <v-col class="layouttitle1">管理編碼</v-col>
          </v-row>
          <v-row>
            <v-col class="layoutcol1">代碼分類</v-col>
            <v-col>
              {{ T_CAT }}
            </v-col>
          </v-row>
          <v-row>
            <v-col class="layoutcol1">中文內容</v-col>
            <v-col>
              <v-text-field
                v-model="T_DES_ZH"
                :hide-details="true"
                class="innerShadow"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="layoutcol1">英文內容</v-col>
            <v-col>
              <v-text-field
                v-model="T_DES_EN"
                :hide-details="true"
                class="innerShadow"
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
                @click.native="UpdateCatCode"
              ></Checkbtn>
              <Crossbtn
                :name="'取消'"
                :issmall="true"
                @click.native="updatecode = false"
              ></Crossbtn>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import BaseBreadcrumbs from '@/components/audit/Breadcrumbs.vue'
import Pagination from '@/components/table/Pagination.vue'
import SearchBtn from '@/components/button/searchbtn.vue'
import crosscancel from '~/components/button/crosscancel'
import Checkbtn from '~/components/button/checkbtn.vue'
import Crossbtn from '~/components/button/crossbtn.vue'
export default {
  components: {
    BaseBreadcrumbs,
    SearchBtn,
    Pagination,
    crosscancel,
    Checkbtn,
    Crossbtn
  },
  layout: 'BackStage',
  data() {
    return {
      HeaderTitle: '代碼管理',
      ctype: '-1',
      ctypes: [
        { value: '-1', text: '全選' },
        { value: '最高學歷', text: '最高學歷' },
        { value: '年齡', text: '年齡' },
        { value: '教育程度', text: '教育程度' },
        { value: '非一般教育程度', text: '非一般教育程度' },
        { value: '從業身分', text: '從業身分' },
        { value: '失業原因', text: '失業原因' },
        { value: '非勞動原因', text: '非勞動原因' },
        { value: '行業', text: '行業' },
        { value: '職業', text: '職業' }
      ],
      pagination: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 20
      },
      headers: [
        {
          text: '代碼分類',
          value: 'CAT',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '中文內容',
          value: 'DES_ZH',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '英文內容',
          value: 'DES_EN',
          align: 'center',
          width: '25%',
          sortable: false
        },
        {
          text: '管理',
          value: 'Edit',
          align: 'center',
          width: '25%',
          sortable: false
        }
      ],
      items: [],
      updatecode: false,
      Oitem: null,
      T_CAT: '',
      T_DES_ZH: '',
      T_DES_EN: ''
    }
  },
  mounted() {},
  methods: {
    setpage(page) {
      const vm = this
      vm.pagination.page = page
    },
    SearchCode() {
      const vm = this
      const data = {}
      data.op = 'GetCodeTable'
      if (vm.ctype !== '-1') {
        data.cats = vm.ctype
      }

      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify(data))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            vm.items = data
          }
        })
    },
    EditCode(Cat, zh, en) {
      const vm = this
      vm.updatecode = true
      vm.T_CAT = Cat
      vm.T_DES_ZH = zh
      vm.T_DES_EN = en

      vm.Oitem = {}
      vm.Oitem.CAT = Cat
      vm.Oitem.DES_ZH = zh
      vm.Oitem.DES_EN = en
    },
    UpdateCatCode() {
      const vm = this
      const data = {}
      data.op = 'UpdateCode'
      data.N_CAT = vm.T_CAT
      data.N_DES_ZH = vm.T_DES_ZH
      data.N_DES_EN = vm.T_DES_EN
      data.O_CAT = vm.Oitem.CAT
      data.O_DES_ZH = vm.Oitem.DES_ZH
      data.O_DES_EN = vm.Oitem.DES_EN

      axios
        .post(vm.RequetURL.ajaxurl, qs.stringify(data))
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('更新編碼成功！')
              vm.updatecode = false
              vm.SearchCode()
            } else {
              _SAlert.Error('更新編碼失敗！')
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
.layoutdialog {
  background: #ffffff;
  max-height: 600px;
  overflow: auto;
}
</style>
