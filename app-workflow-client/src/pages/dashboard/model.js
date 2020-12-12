import api from 'api'

const {getProjectsSearch} = api;

export default {

  namespace: 'dashboard',

  state: {
    reset: false,
    isOpen: false,
    searchProjects:[]
  },
  subscriptions: {

  },
  effects: {
    * getProjectsSearch({payload}, {call, put, select}) {
      const res = yield call(getProjectsSearch);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            searchProjects: res.object.object,
          }
        })
      }
    },
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  }
}
