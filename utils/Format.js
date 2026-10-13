export const Format = {
  AbsNumber(_value) {
    return Math.abs(_value)
  },
  ArrayToSelectItem(_array, _NeedDefault = false, _NeedAllChange = false) {
    const retunArr = []
    if (_NeedDefault) {
      retunArr.push({
        value: -1,
        text: '請選擇'
      })
    }
    if (_NeedAllChange) {
      retunArr.push({
        value: -1,
        text: '不限'
      })
    }
    for (let i = 0; i < _array.length; i++) {
      retunArr.push({
        value: parseInt(_array[i].Value),
        text: _array[i].Text
      })
    }
    return retunArr
  },
  ObjToArray(_obj) {
    const Arr = Array.isArray(_obj) ? _obj : _obj ? [_obj] : []
    return Arr
  },
  GroupArray(array, prop) {
    return array.reduce(function(groups, item) {
      const val = item[prop]
      groups[val] = groups[val] || []
      groups[val].push(item)
      return groups
    }, {})
  },
  CopyArr(arr) {
    return arr.map((e) => {
      if (typeof e === 'object') {
        return Object.assign({}, e)
      } else {
        return e
      }
    })
  },
  GetStatusCH(_Status) {
    if (_Status === 1) return '啟用中'
    else return '停用中'
  },
  GetStatusValue(_Status) {
    if (_Status === '啟用中') return 1
    else return 0
  },
  GetStatusSQLValue(_Status) {
    if (_Status === '啟用中' || _Status === 1) return 1
    else return 0
  },
  DateTimeFormat(_DateTime) {
    const DtObjArray = _DateTime.split('T')
    const DtArray = DtObjArray[0].split('-')
    const Year = DtArray[0]
    const Month = DtArray[1]
    const Day = DtArray[2]
    let date = Year + '/' + Month + '/' + Day + ' '
    const DtArray2 = DtObjArray[1].split(':')
    const Hour = DtArray2[0]
    const Minute = DtArray2[1]
    date += Hour + ':' + Minute

    return date
  },
  DateTimeFormat2(_DateTime) {
    const DtObjArray = _DateTime.split('T')
    const DtArray = DtObjArray[0].split('-')
    const Year = DtArray[0]
    const Month = DtArray[1]
    const Day = DtArray[2]
    const date = Year + '/' + Month + '/' + Day

    return date
  },
  DateTimeFormat3(_DateTime) {
    const DtObjArray = _DateTime.split('T')
    const DtArray = DtObjArray[0].split('-')
    const Year = DtArray[0]
    const Month = DtArray[1]
    const Day = DtArray[2]
    const date = Year + '-' + Month + '-' + Day

    return date
  },
  RocDateTime(_DateTime, IsDateTimeFormat = false) {
    if (IsDateTimeFormat) {
      const DtObjArray = _DateTime.split('T')
      const DtArray = DtObjArray[0].split('-')
      const Year = DtArray[0]
      const Month = DtArray[1]
      const Day = DtArray[2]
      const RocDateTime =
        parseInt(Year) - 1911 + '年' + Month + '月' + Day + '日'
      return RocDateTime
    }
    if (!IsDateTimeFormat) {
      const DtArray = _DateTime.split('/')
      const Year = DtArray[0]
      const Month = DtArray[1]
      const Day = DtArray[2].split(' ')[0]
      const RocDateTime =
        parseInt(Year) - 1911 + '年' + Month + '月' + Day + '日'
      return RocDateTime
    }
  }
}
