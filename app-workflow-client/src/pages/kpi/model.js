import api from 'api'

const {getProjectByStaff, getStaffSearch} = api;

export default {

  namespace: 'kpi',

  state: {
    afterDeadLineProjects: [],
    inProgressProjects: [],
    beforeDeadLineProjects: [],
    staffSearch: []
  },
  subscriptions: {},
  effects: {
    * getProjectsByStaff({payload}, {call, put, select}) {
      const res = yield call(getProjectByStaff, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            afterDeadLineProjects: res.object.filter(item => item.byField === "after").map(i => i.object)[0],
            inProgressProjects: res.object.filter(item => item.byField === "progress").map(i => i.object)[0],
            beforeDeadLineProjects: res.object.filter(item => item.byField === "before").map(i => i.object)[0],
          }
        })
      }
    },
    * getStaffSearch({payload}, {call, put, select}) {
      const res = yield call(getStaffSearch, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            staffSearch: res.list
          }
        })
      }
    }
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
