import api from 'api'

const {getProjectSearchNameOrCustomerName} = api;

export default {
  namespace: 'paymentModel',
  state: {
    switchOn: "active-cursor",
    visible: false,
    projectSearchNameOrCustomerName: []
  },
  subscriptions: {},
  effects: {
    * getProjectSearchNameOrCustomerName({payload}, {call, put, select}){
      const res = yield call(getProjectSearchNameOrCustomerName, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectSearchNameOrCustomerName:res.list
          }
        })
      }
    }
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  }
}
