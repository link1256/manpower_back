import vue from 'vue'
import { Format } from '~/utils/Format.js'
import { PageStyle } from '~/utils/PageStyle'
import { RequetURL } from '~/utils/RequestUrl'
import { LoginData } from '~/utils/NowLogin'

vue.prototype.Format = Format
vue.prototype.PageStyle = PageStyle
vue.prototype.RequetURL = RequetURL
vue.prototype.NowLogin = LoginData
