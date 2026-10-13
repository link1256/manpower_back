export const PageStyle = {
  SetLayoutStyle(_store, _TopMenuId, _LeftPageId) {
    this.SetTopMenuStyle(_store, _TopMenuId)
    this.SetLeftMenuStyle(_store, _LeftPageId)
  },
  SetTopMenuStyle(_store, _TopMenuId) {
    if (_TopMenuId === null) return
    const functionItemArray = [false, false, false]
    functionItemArray[_TopMenuId] = true
    _store.commit('Utils/Menu/SET_MENU', {
      ShowFunctionMdi: true,
      FunctionItemArray: functionItemArray
    })
  },
  SetLeftMenuStyle(_store, SET_LEFTMENUCLICK) {
    _store.commit('Utils/Menu/SET_LEFTMENUCLICK', SET_LEFTMENUCLICK)
  }
}
