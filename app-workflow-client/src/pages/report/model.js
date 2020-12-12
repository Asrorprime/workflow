import api from 'api';
import download from "../../utils/download";

const {
  getDebtClients, getCompletedProjects,getArchivedProjects,
  getPaymentsReport, getInProgressProjects, getNotCompletedProjects,
  downloadPayments, downloadCompletedProjects,getOnTimeCompletedProjects,
  getDebtClientSearch,
} = api;
export default {
  namespace: 'report',
  state: {
    debtClients: [],
    completedProjects: [],
    archivedProjects:[],
    payments: [],
    inProgressProjects: [],
    notCompletedProjects: [],
    onTimeCompletedProjects:[],
    debtClientsSearch:[],
    endOpen: null,
    endValue: null,
    startValue: null,
    totalElements: 0,
    page: 1,
    size: 10,
    incomeValue: '',
    activeBtn: 'month'
  },
  subscriptions: {},
  effects: {
    * getDebtClients({payload}, {call, put}) {
      const res = yield call(getDebtClients, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            debtClients: res.object,
          }
        })
      }
    },
    * getDebtClientSearch({payload}, {call, put, select}){
      const res = yield call(getDebtClientSearch, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            debtClientsSearch:res.list
          }
        })
      }
    },
    * getCompletedProjects({payload}, {call, put}) {
      const res = yield call(getCompletedProjects, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            completedProjects: res.object,
          }
        })
      }
    },
    * getArchivedProjects({payload}, {call, put}) {
      const res = yield call(getArchivedProjects, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            archivedProjects: res.object,
          }
        })
      }
    },
    * getPaymentsReport({payload}, {call, put}) {
      const res = yield call(getPaymentsReport, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            payments: res.object,
          }
        })
      }
    },
    * getInProgressProjects({payload}, {call, put}) {
      const res = yield call(getInProgressProjects, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            inProgressProjects: res.object,
          }
        })
      }
    },
    * getNotCompletedProjects({payload}, {call, put}) {
      const res = yield call(getNotCompletedProjects, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            notCompletedProjects: res.object,
          }
        })
      }
    },
    * getOnTimeCompletedProjects({payload}, {call, put}) {
      const res = yield call(getOnTimeCompletedProjects, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            onTimeCompletedProjects: res.object,
          }
        })
      }
    },
    * downloadCompletedProjects({payload}, {call}) {
      const res = yield call(downloadCompletedProjects, payload);
      if (res.success) {
        download.apply(res);
      }
    },

  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
}
