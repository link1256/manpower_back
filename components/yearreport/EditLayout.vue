<template>
  <v-container>
    <v-row>
      <v-col class="layouttitle1">管理套版</v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">編號</v-col>
      <v-col>
        {{ T_No }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">主標題</v-col>
      <v-col>
        <v-text-field
          v-model="T_NAME"
          :hide-details="true"
          class="innerShadow"
          outlined
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">資料版次</v-col>
      <v-col>
        <v-select
          v-model="EDITION"
          :items="EditionItem"
          :disabled="year == 0 ? true : false"
          background-color="white"
          solo
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">副標題</v-col>
      <v-col>
        <v-text-field
          v-model="SUB_NAME"
          :hide-details="true"
          class="innerShadow"
          background-color="white"
          solo
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">分類</v-col>
      <v-col>
        <v-select
          v-model="Class"
          :items="ClassItem"
          background-color="white"
          solo
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">表側</v-col>
      <v-col>
        <v-radio-group v-model="year" row @change="tyearchange">
          <v-radio :value="1" label="年分"></v-radio>
          <v-radio :value="0" label="非年分"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">續表</v-col>
      <v-col>
        <v-radio-group v-model="next" row>
          <v-radio :value="0" label="無"></v-radio>
          <v-radio :value="1" label="有"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">單位</v-col>
      <v-col>
        <v-text-field
          v-model="Unit"
          :hide-details="true"
          class="innerShadow"
          outlined
          placeholder="若有序表，請用半形分號分隔兩個單位"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">統計期</v-col>
      <v-col>
        <v-layout row wrap style="margin-left: 10px;">
          <v-checkbox
            v-model="datetype"
            :value="1"
            :disabled="year == 0 ? true : false"
            label="年平均"
          ></v-checkbox>
          <v-checkbox
            v-model="datetype"
            :value="2"
            :disabled="year == 0 ? true : false"
            label="月"
          ></v-checkbox>
          <v-checkbox
            v-model="datetype"
            :value="3"
            :disabled="year == 0 ? true : false"
            label="年平均與月"
          ></v-checkbox>
        </v-layout>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">設定年分</v-col>
      <v-col class="AllLeft">
        <v-select
          v-model="startyear"
          :items="dateitems"
          style="max-width: 130px;"
          background-color="white"
          solo
          hide-details
        ></v-select>
        <span style="margin: 0px 10px;">至</span>
        <v-select
          v-model="endyear"
          :items="dateitems"
          style="max-width: 130px;"
          background-color="white"
          solo
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">實體檔案</v-col>
      <v-col>
        {{ ISUPLOAD === 0 ? '此表未上傳套版至伺服器' : FILENAME }}
        <v-file-input v-model="uploadfile" accept=".xlsx"></v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="layoutcol1">備註文字</v-col>
      <v-col>
        <div class="summernote_4"></div>
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
    yearcategory: {
      default: null,
      type: Array
    },
    snumbers: {
      default: null,
      type: Array
    },
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
      T_No: null,
      T_NAME: '',
      SUB_NAME: '',
      Class: '',
      ClassItem: [],
      year: 1,
      next: 0,
      Unit: '',
      datetype: [],
      COMMENT: '',
      ISUPLOAD: 0,
      uploadfile: [],
      comment: '',
      startyear: 1,
      endyear: 1,
      dateitems: [],
      numberitem: [],
      EDITION: 1,
      EditionItem: [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '5', value: 5 },
        { text: '6', value: 6 },
        { text: '7', value: 7 },
        { text: '8', value: 8 },
        { text: '9', value: 9 }
      ],
      FILENAME: '',
      maxtimeline: null,
      maxnontimeline: null
    }
  },
  mounted() {
    const vm = this

    this.uploadfile = []
    axios
      .post(
        vm.RequetURL.ajaxurl,
        qs.stringify({
          op: 'getLayoutDataMaxYear'
        })
      )
      .then(function(Response) {
        if (typeof Response === 'object' && Response.status === 200) {
          const data = Response.data
          if (data) {
            vm.maxtimeline = data.TimelineMaxYear
            vm.maxnontimeline = data.NoneTimelineMaxYear
          }
        }
      })

    $('.summernote_4').summernote({
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
      vm.setClass()
      vm.getsetdatarange()
      vm.setEditData()
    }, 100)
  },
  destroyed() {
    $('.v-dialog').off('click')
    $('.dropdown-toggle').off('click')
    $('.summernote_4').summernote('destroy')
  },
  methods: {
    setEditData() {
      const vm = this
      const tard = vm.tdata.filter((f) => f.SNO === parseInt(vm.sno))
      if (tard.length > 0) {
        vm.T_No = tard[0].T_ID
        vm.T_NAME = tard[0].T_NAME
        vm.SUB_NAME = tard[0].SUB_NAME
        vm.Class = tard[0].CAT
        vm.year = tard[0].TIMELINE
        vm.next = tard[0].NEXT
        vm.Unit = tard[0].UNIT
        vm.EDITION = tard[0].EDITION
        vm.ISUPLOAD = tard[0].ISUPLOAD
        vm.FILENAME = tard[0].FORM_NAME

        const tp = tard[0].STAT_PERIOD.split(',')
        for (let i = 0; i < tp.length; i++) {
          vm.datetype.push(parseInt(tp[i]))
        }
        vm.startyear = tard[0].S_YEAR + '年'
        vm.endyear = tard[0].E_YEAR + '年'

        if (tard[0].E_YEAR === -1) vm.endyear = -1
        vm.comment = tard[0].COMMENT
        $('.summernote_4').summernote('code', vm.comment)
      }
    },
    tyearchange() {
      this.datetype = []
      if (this.year === 0) {
        this.EDITION = 1
      }
      this.getsetdatarange()
    },
    setClass() {
      if (this.yearcategory) {
        const data = this.yearcategory
        for (let i = 0; i < data.length; i++) {
          const opt = {}
          opt.text = data[i].Name
          opt.value = data[i].Sno
          this.ClassItem.push(opt)
        }
        this.Class = this.ClassItem[0].value
      }
    },
    getsetdatarange() {
      let yyyy = this.year === 1 ? this.maxtimeline : this.maxnontimeline

      if (!yyyy) {
        const today = new Date()
        yyyy = today.getFullYear()
      } else {
        yyyy = parseInt(yyyy)
      }

      this.dateitems = []
      const opt = {}
      opt.value = -1
      opt.text = '--'
      this.dateitems.push(opt)
      for (let i = 1993; i <= yyyy; i++) {
        const opt = {}
        opt.value = i - 1911 + '年'
        opt.text = i - 1911 + '年'
        this.dateitems.push(opt)
      }
      this.startyear = this.dateitems[1].value
      this.endyear = this.dateitems[0].value
    },
    compileYear(year) {
      if (!year || year === -1) return '-1'
      const str = year.split('年')
      if (str.length > 1) {
        return str[0]
      } else {
        return year
      }
    },
    savethis() {
      const vm = this

      const formData = new FormData()
      formData.append('op', 'UpdateLayout')
      formData.append('SNO', vm.sno)
      if (vm.T_No.value) formData.append('T_ID', vm.T_No.value)
      else formData.append('T_ID', vm.T_No)

      vm.comment = $('.summernote_4').summernote('code')

      formData.append('T_NAME', vm.T_NAME)
      formData.append('EDITION', vm.EDITION)
      formData.append('SUB_NAME', vm.SUB_NAME)
      formData.append('CAT', vm.Class)
      formData.append('S_YEAR', vm.compileYear(vm.startyear))
      formData.append('E_YEAR', vm.compileYear(vm.endyear))
      formData.append('UNIT', vm.Unit)
      formData.append('COMMENT', vm.comment)
      formData.append('NEXT', vm.next)
      formData.append('TIMELINE', vm.year)
      if (vm.uploadfile instanceof File) {
        formData.append('files', vm.uploadfile)
      }
      formData.append('ISUPLOAD', vm.ISUPLOAD)

      let a = ''
      for (let i = 0; i < vm.datetype.length; i++) {
        if (i !== 0) a += ','
        a += vm.datetype[i]
      }

      if (vm.year === 0) a = '0'
      formData.append('STAT_PERIOD', a)

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
              }, 500)
            } else if (data === 'Extension Error') {
              _SAlert.Error('請上傳正確檔案.')
            } else {
              _SAlert.Error('上傳檔案時發生錯誤.')
            }
          }
        })
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
              $('.summernote_4').summernote('insertImage', url, 'newimage')
            }
          }
        })
    },
    closethis() {
      this.$emit('closedialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea {
  resize: none !important;
}
</style>
