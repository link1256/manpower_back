<template>
  <v-container>
    <v-row>
      <v-col class="layouttitle1">管理套版</v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">編號</v-col>
      <v-col>
        <v-combobox
          v-model="SNo"
          :items="SNoItems"
          background-color="white"
          solo
          hide-details
          @change="SnoChange"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="items"
          hide-default-footer
          class="TableStyle elevation-3"
        >
          <template #[`item.Setting`]="{ item }">
            <img
              v-if="item.ORDER < items.length"
              class="EditIcon"
              src="@/assets/images/DownArrow.svg"
              alt=""
              @click="OrderDown(item.SNO, item.ORDER)"
            />
            <img
              v-if="item.ORDER != 1"
              class="EditIcon"
              src="@/assets/images/UpArrow.svg"
              alt=""
              @click="OrderUp(item.SNO, item.ORDER)"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="AllCenter">
        <Checkbtn
          :name="'確認'"
          :issmall="true"
          style="margin-right: 10px;"
          @click.native="closethis"
        ></Checkbtn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import Checkbtn from '~/components/button/checkbtn.vue'
export default {
  components: {
    Checkbtn
  },
  props: {
    psno: {
      default: '',
      type: String
    },
    tdata: {
      default: null,
      type: Array
    }
  },
  data() {
    return {
      SNo: '',
      SNoItems: [],
      headers: [
        { text: '排序', value: 'ORDER', align: 'center', width: '10%' },
        {
          text: '副表名稱',
          value: 'SUB_NAME',
          align: 'center',
          width: '20%',
          sortable: false
        },
        {
          text: '設定',
          value: 'Setting',
          align: 'center',
          width: '20%',
          sortable: false
        }
      ],
      items: []
    }
  },
  mounted() {
    const data = this.tdata
    const snumbers = [...new Set(data.map((item) => item.T_ID))]

    for (let i = 0; i < snumbers.length; i++) {
      const d = data.filter((f) => f.T_ID === snumbers[i])

      this.SNoItems.push(d[0].T_ID + ' ' + d[0].T_NAME)
    }

    if (this.psno === -1) this.SNo = this.SNoItems[0]
    else this.SNo = this.psno
    this.SnoChange()
  },
  methods: {
    SnoChange() {
      const snoString = this.SNo.split(' ')
      let sno = ''
      if (snoString.length > 1) {
        sno = parseInt(snoString[0])
      } else {
        return
      }
      const data = this.tdata
      this.items = data.filter((f) => f.T_ID === sno)
    },
    OrderDown(sno, order) {
      const vm = this

      const snoString = this.SNo.split(' ')
      let tsno = ''
      if (snoString.length > 1) {
        tsno = parseInt(snoString[0])
      }

      if (tsno === '') {
        _SAlert.Error('請選擇編號.')
      }
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'UpdateLayoutSort',
            SNO: sno,
            ORDER: order,
            ISDOWN: 1,
            TID: tsno
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              vm.$emit('Updatetable', vm.SNo)
            } else {
              _SAlert.Error('更新時發生錯誤.')
            }
          }
        })
    },
    OrderUp(sno, order) {
      const vm = this

      const snoString = this.SNo.split(' ')
      let tsno = ''
      if (snoString.length > 1) {
        tsno = parseInt(snoString[0])
      }

      if (tsno === '') {
        _SAlert.Error('請選擇編號.')
      }
      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'UpdateLayoutSort',
            SNO: sno,
            ORDER: order,
            ISDOWN: 0,
            TID: tsno
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              vm.$emit('Updatetable', vm.SNo)
            } else {
              _SAlert.Error('更新時發生錯誤.')
            }
          }
        })
    },
    closethis() {
      this.$emit('clostSortLayout', this.SNo)
    }
  }
}
</script>
<style lang="scss" scoped></style>
