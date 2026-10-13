export const state = () => ({
  Menu: {
    ShowFooter: true,
    ShowFunctionMdi: false,
    MenuArray: [
      { IsParents: true, Click: false, Show: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: false, Click: false },
      { IsParents: false, Click: false },
      { IsParents: false, Click: false },
      { IsParents: false, Click: false },
      { IsParents: false, Click: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: false, Click: false },
      { IsParents: false, Click: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: false, Click: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: false, Click: false },
      { IsParents: false, Click: false },
      { IsParents: false, Click: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: true, Click: false, Show: false },
      { IsParents: true, Click: false, Show: false }
    ]
  }
})
export const SET_MENUDEFAULT = 'SET_MENUDEFAULT'
export const SET_FOOLTER = 'SET_FOOLTER'
export const SET_MENU = 'SET_MENU'
export const SET_MENUSTYLE = 'SET_MENUSTYLE'
export const SET_LEFTMENUCLICK = 'SET_LEFTMENUCLICK'

export const mutations = {
  [SET_MENUDEFAULT](state) {
    const Menu = {
      ShowFooter: true,
      ShowFunctionMdi: false,
      MenuArray: [
        { IsParents: true, Click: false, Show: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: false, Click: false },
        { IsParents: false, Click: false },
        { IsParents: false, Click: false },
        { IsParents: false, Click: false },
        { IsParents: false, Click: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: false, Click: false },
        { IsParents: false, Click: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: false, Click: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: false, Click: false },
        { IsParents: false, Click: false },
        { IsParents: false, Click: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: true, Click: false, Show: false },
        { IsParents: true, Click: false, Show: false }
      ]
    }
    state.Menu = Menu
  },
  [SET_FOOLTER](state, IsShow) {
    state.Menu.ShowFooter = IsShow
  },
  [SET_MENU](state, Menu) {
    state.Menu.ShowFunctionMdi = Menu.ShowFunctionMdi
    state.Menu.FunctionItemArray = Menu.FunctionItemArray
  },
  [SET_MENUSTYLE](state, Menu) {
    state.Menu.MenuArray = Menu
  },
  [SET_LEFTMENUCLICK](state, _PageId) {
    state.Menu.MenuArray[_PageId].Click = true
  }
}
