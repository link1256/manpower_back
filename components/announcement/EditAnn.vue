<template>
  <v-container>
    <v-row>
      <v-col class="layouttitle1">編輯公告</v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">編號</v-col>
      <v-col>
        {{ Sid }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">公告類別</v-col>
      <v-col>
        <v-text-field
          v-model="Type"
          :hide-details="true"
          class="innerShadow"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">內文主旨</v-col>
      <v-col>
        <v-text-field
          v-model="Subject"
          :hide-details="true"
          class="innerShadow"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">公告內文</v-col>
      <v-col>
        <div class="summernote_8"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">公告期限</v-col>
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
              :disabled="IsForEver === 1 ? true : false"
              outlined
              background-color="white"
              readonly
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
              :disabled="IsForEver === 1 ? true : false"
              outlined
              background-color="white"
              readonly
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
      <v-col class="layoutcol1">公告永久</v-col>
      <v-col>
        <v-checkbox
          v-model="IsForEver"
          :value="1"
          @change="CheckChange"
        ></v-checkbox>
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
import $ from 'jquery'
import 'bootstrap'
import 'summernote'
import 'summernote/dist/lang/summernote-zh-TW.js'
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
    tdata: {
      default: null,
      type: Array
    },
    sno: {
      default: -1,
      type: Number
    }
  },
  data() {
    return {
      Sid: null,
      comment: '',
      Type: '',
      Subject: '',
      sdate: '',
      edate: '',
      IsForEver: 0
    }
  },
  mounted() {
    const vm = this
    $('.summernote_8').summernote({
      dialogsInBody: true,
      lang: 'zh-TW',
      tabsize: 2,
      width: 400,
      height: 120,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['insert', ['link', 'picture']]
      ],
      callbacks: {
        onInit() {
          $('.v-dialog').click(function(event) {
            const $target = $(event.target)
            if (
              !$target.closest('.dropdown-toggle').length &&
              !$target.closest('.note-dropdown-menu').length &&
              $('.note-dropdown-menu').is(':visible')
            ) {
              $('.note-dropdown-menu').hide()
            }
          })
          $('.dropdown-toggle').on('click', function(e) {
            const tar = e.currentTarget
            const parent = tar.parentNode
            const ul = parent.getElementsByTagName('ul')

            const ar = $('.note-dropdown-menu')
            for (let i = 0; i < ar.length; i++) {
              $(ar[i]).hide()
            }

            if (ul) {
              $(ul[0]).show()
            }
          })
        },
        onImageUpload(files) {
          vm.imageUpload(files)
        }
      }
    })
    setTimeout(function() {
      vm.setEditData()
    }, 100)
  },
  destroyed() {
    $('.v-dialog').off('click')
    $('.dropdown-toggle').off('click')
    $('.summernote_8').summernote('destroy')
  },
  methods: {
    setEditData() {
      const vm = this
      const tard = vm.tdata.filter((f) => f.SNO === parseInt(vm.sno))
      if (tard.length > 0) {
        vm.Sid = tard[0].SNO
        vm.Type = tard[0].Type
        vm.Subject = tard[0].Subject
        if (tard[0].IsForEver === 0) {
          vm.sdate = vm.Format.DateTimeFormat3(tard[0].StartDate)
          vm.edate = vm.Format.DateTimeFormat3(tard[0].EndDate)
        }
        vm.IsForEver = tard[0].IsForEver

        vm.comment = tard[0].Desc
        $('.summernote_8').summernote('code', vm.comment)
      }
    },
    savethis() {
      const vm = this

      if (vm.Type === '') {
        _SAlert.Error('請輸入公告類別.')
        return
      }
      if (vm.Subject === '') {
        _SAlert.Error('請輸入內文主旨.')
        return
      }
      if (vm.IsForEver !== 1 && (vm.sdate === '' || vm.edate === '')) {
        _SAlert.Error('日期不能為空.')
        return
      }

      vm.comment = $('.summernote_8').summernote('code')

      axios
        .post(
          vm.RequetURL.ajaxurl,
          qs.stringify({
            op: 'EditAnnouncement',
            Sid: vm.Sid,
            Type: vm.Type,
            Subject: vm.Subject,
            Dec: vm.comment,
            sdate: vm.sdate,
            edate: vm.edate,
            IsForEver: vm.IsForEver
          })
        )
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data === 'OK') {
              _SAlert.Success('更新資料成功.')
              setTimeout(function() {
                _SAlert.Close()
                vm.$emit('SaveSuccess')
              }, 500)
            } else {
              _SAlert.Error('更新時發生錯誤.')
            }
          }
        })
    },
    closethis() {
      this.$emit('closedialog')
    },
    imageUpload(files) {
      const vm = this
      const formData = new FormData()
      formData.append('op', 'UploadImage')
      formData.append('upload', files[0])

      axios
        .post(vm.RequetURL.uploadurl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function(Response) {
          if (typeof Response === 'object' && Response.status === 200) {
            const data = Response.data
            if (data !== '' && data !== 'NO FILE') {
              const url = vm.RequetURL.imageupload + data
              $('.summernote_8').summernote('insertImage', url, 'newimage')
            }
          }
        })
    },
    CheckChange() {
      const vm = this
      if (vm.IsForEver === 1) {
        vm.sdate = ''
        vm.edate = ''
      } else {
        vm.IsForEver = 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea {
  resize: none !important;
}
</style>
