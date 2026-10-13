<template>
  <v-container>
    <v-row>
      <v-col class="layouttitle1">{{ title }}</v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">主標題</v-col>
      <v-col class="AllCenter">
        <v-text-field
          v-model="T_NAME"
          :hide-details="true"
          class="innerShadow"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">連結網址</v-col>
      <v-col class="AllCenter">
        <v-text-field
          v-model="T_URLLINK"
          :hide-details="true"
          class="innerShadow"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1" style="max-width: 150px;">
        刊登起迄
      </v-col>
      <v-col>
        <v-radio-group v-model="IsForEver" class="statgroup">
          <v-row>
            <v-col>
              <v-radio :value="1" label="永久刊登"></v-radio>
            </v-col>
            <v-col></v-col>
          </v-row>
          <v-row>
            <v-col style="max-width: 50px; width: 50px; padding-top: 30px;">
              <v-radio :value="2"></v-radio>
            </v-col>
            <v-col>
              <v-row>
                <v-col class="AllCenter">
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
                        :disabled="IsForEver === 1 ? true : false"
                        outlined
                        background-color="white"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="sdate"
                      :max="edate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="smenu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.smenu.save(sdate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="AllCenter">
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
                        :disabled="IsForEver === 1 ? true : false"
                        outlined
                        background-color="white"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="edate"
                      :min="sdate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="emenu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.emenu.save(edate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1" style="max-width: 150px;">
        上傳圖片
      </v-col>
      <v-col>
        <div v-if="isedit">
          {{ FILENAME === '' ? '此表未上傳套版至伺服器' : FILENAME }}
        </div>
        <v-file-input
          :key="fkey"
          v-model="uploadfile"
          accept=".png,.jpg,.jpeg"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="AllCenter">
        <Checkbtn
          :name="'更新'"
          :issmall="true"
          style="margin-right: 10px;"
          @click.native="savethis"
        ></Checkbtn>
        <Crossbtn
          :name="'取消'"
          :issmall="true"
          @click.native="closethis"
        ></Crossbtn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import qs from 'qs'
import axios from '../../plugins/axios'
import { _SAlert } from '../../utils/sweetAlert2'
import Checkbtn from '~/components/button/checkbtn.vue'
import Crossbtn from '~/components/button/crossbtn.vue'
export default {
  components: {
    Checkbtn,
    Crossbtn
  },
  props: {
    isedit: {
      default: false,
      type: Boolean
    },
    editsno: {
      default: null,
      type: String
    }
  },
  data() {
    return {
      title: '新增統計互動',
      T_NAME: '',
      T_URLLINK: '',
      IsForEver: 1,
      uploadfile: [],
      fkey: 0,
      smenu: false,
      emenu: false,
      sdate: '',
      edate: '',
      FILENAME: '',
      OT_NAME: ''
    }
  },
  mounted() {
    const vm = this
    vm.uploadfile = []

    if (vm.isedit) {
      vm.title = '編輯統計互動'

      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'GetTargetStatItem',
            SNO: vm.editsno
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data) {
              vm.T_NAME = data.Name
              vm.OT_NAME = data.Name
              vm.T_URLLINK = data.URLLink
              vm.IsForEver = parseInt(data.IsForEver)
              vm.sdate = data.StartDate
              vm.edate = data.EndDate
              vm.FILENAME = data.FileName
            }
          }
        })
    }
  },
  methods: {
    savethis() {
      const vm = this

      if (vm.isedit) {
        const formData = new FormData()
        formData.append('op', 'EditStatItem')

        formData.append('SNO', vm.editsno)
        formData.append('T_NAME', vm.T_NAME)
        formData.append('OT_NAME', vm.OT_NAME)
        formData.append('T_URLLINK', vm.T_URLLINK)
        formData.append('ISFOREVER', vm.IsForEver)
        formData.append('S_TIME', vm.sdate)
        formData.append('E_TIME', vm.edate)

        formData.append('files', vm.uploadfile)

        if (vm.T_NAME === '') {
          _SAlert.Error('請填寫主標題.')
          return
        }
        if (vm.T_URLLINK === '') {
          _SAlert.Error('請填寫連結網址.')
          return
        }
        if (vm.IsForEver === '2') {
          if (vm.sdate === '' || vm.edate === '') {
            _SAlert.Error('請選擇起訖時間.')
          }
        }

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
                _SAlert.Success('編輯資料成功.')
                setTimeout(function() {
                  _SAlert.Close()
                  vm.$emit('SaveSuccess')
                  vm.closethis()
                }, 500)
              } else if (data === 'Extension Error') {
                _SAlert.Error('請上傳正確檔案.')
              } else {
                _SAlert.Error('上傳檔案時發生錯誤.')
              }
            }
          })
      } else {
        const formData = new FormData()
        formData.append('op', 'AddStatItem')

        formData.append('T_NAME', vm.T_NAME)
        formData.append('T_URLLINK', vm.T_URLLINK)
        formData.append('ISFOREVER', vm.IsForEver)
        formData.append('S_TIME', vm.sdate)
        formData.append('E_TIME', vm.edate)

        formData.append('files', vm.uploadfile)

        if (vm.T_NAME === '') {
          _SAlert.Error('請填寫主標題.')
          return
        }
        if (vm.T_URLLINK === '') {
          _SAlert.Error('請填寫連結網址.')
          return
        }
        if (vm.IsForEver === '2') {
          if (vm.sdate === '' || vm.edate === '') {
            _SAlert.Error('請選擇起訖時間.')
            return
          }
        }
        if (vm.uploadfile.length === 0) {
          _SAlert.Error('請上傳檔案.')
          return
        }

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
                _SAlert.Success('新增資料成功.')
                setTimeout(function() {
                  _SAlert.Close()
                  vm.$emit('SaveSuccess')
                  vm.closethis()
                }, 500)
              } else if (data === 'Extension Error') {
                _SAlert.Error('請上傳正確檔案.')
              } else {
                _SAlert.Error('上傳檔案時發生錯誤.')
              }
            }
          })
      }
    },
    closethis() {
      this.T_NAME = ''
      this.T_URLLINK = ''
      this.IsForEver = 1
      this.uploadfile = []
      this.sdate = ''
      this.edate = ''
      this.$emit('closeEditLayout')
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea {
  resize: none !important;
}
.statgroup {
  min-height: 200px !important;
  height: 200px !important;
}
</style>
