import Swal from 'sweetalert2'
export const _SAlert = {
  Swal() {
    return Swal
  },
  Success(_strMsg, _showConfirmButton = false) {
    Swal.fire({
      icon: 'success',
      title: '',
      html: '' + _strMsg,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '確定',
      showConfirmButton: _showConfirmButton,
      width: '500px'
    })
  },
  Error(_strMsg) {
    Swal.fire({
      icon: 'warning',
      title: '',
      html: '' + _strMsg,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      showCloseButton: true,
      showCancelButton: false,
      width: '500px'
    })
  },
  ResponseError(_Store, _Response) {
    if (
      _Response.data.Code ===
      _Store.state.Utils.SystemParameter.ResponseCode.InternalServerError
    ) {
      _SAlert.Error(_Store.state.Utils.SystemParameter.Msg.ApiPostError)
    } else {
      _SAlert.Error(_Response.data.Message)
    }
  },
  EmailMessage(_strMsg) {
    Swal.fire({
      title: '郵件發送成功',
      html: '' + _strMsg + '',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#eaeaea',
      confirmButtonText: '確定',
      width: 780
    }).then(function(result) {
      if (result.value) {
        location.href = '/forestry_community'
      }
    })
  },
  ConfirmWindow(_strMsg) {
    return {
      icon: 'warning',
      title: '',
      html: '' + _strMsg,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#eaeaea',
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }
  },
  SuccessWindow(_strMsg) {
    return {
      icon: 'success',
      html: '' + _strMsg + '',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#eaeaea',
      confirmButtonText: '確定'
    }
  },
  Close() {
    Swal.close()
  },
  DelayClose(isReload = false) {
    setTimeout(() => {
      if (isReload) {
        location.reload()
      }
      if (!isReload) {
        Swal.close()
      }
    }, 1000)
  }
}
