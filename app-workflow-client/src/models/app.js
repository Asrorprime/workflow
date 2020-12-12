import api from 'api';
import {TOKEN_NAME} from "constant";
import router from "umi/router";

const {
  userMe, getSteps,
  getProjects, getCustomers, getStaffs, getPayTypes, getPayments,
  getProjectsSearchInvoice, getProjectSearchName, getProjectSubStepCompletedCount,
  getProjectStepStatus, getSpecialtys, getProjectSearchNameCustomer, getProjectSearchNameOrCustomerName
} = api;
const openPages = ['/', '/login', '/kpi', '/notFound'];

export default {
  namespace: 'app',
  state: {
    modalShow: false,
    payTypes: [],
    payments: [],
    payment: [],
    apiPath: '',
    childModel: '',
    user: '',
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    isNavbar: document.body.clientWidth < 769,
    locationPathname: '',
    locationQuery: {},
    clear: false,
    currentUser: '',
    customers: [],
    staffs: [],
    projects: [],
    steps: [],
    specialtys: [],
    projectsByName: [],
    projectStepStatuses: [],
    isLoading: false,
    totalElements: 0,
    page: 0,
    size: 10,
    projectSubStepCompletedCount: 0,
    projectsByNameCustomer: [],
    projectSearchNameOrCustomerName: []
  },
  subscriptions: {
    setupHistory({dispatch, history}) {
      // history.listen((location) => {
      //   dispatch({
      //     type: 'updateState',
      //     payload: {
      //       pathname: location.pathname,
      //     },
      //   });
      // });
    }, setup({dispatch, history}) {
      // history.listen(({pathname}) => {
      //   dispatch({
      //     type: 'userMe',
      //     payload: {
      //       pathname
      //     }
      //   })
      // })
    }
  },
  effects: {

    * userMe({payload}, {call, put, select}) {
      try {
        const res = yield call(userMe);
        if (!res.success) {
          yield put({
            type: 'updateState',
            payload: {
              currentUser: '',
            }
          });
          if (!openPages.includes(payload.pathname) && !(openPages.includes('/' + payload.pathname.split('/')[1]))) {
            localStorage.removeItem(TOKEN_NAME);
            router.push('/notFound');
          }
        } else {
          yield put({
            type: 'updateState',
            payload: {
              currentUser: res.object
            }
          });
        }
      } catch (error) {
        yield put({
          type: 'updateState',
          payload: {currentUser: ''}
        });
        if (!openPages.includes(payload.pathname)) {
          localStorage.removeItem(TOKEN_NAME);
          router.push('/kpi');
        }
      }
    },
    * getSteps({payload}, {call, put, select}) {
      const res = yield call(getSteps, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            steps: res['_embedded'].list,
            page: res.page.number,
            size: res.page.size,
            totalElements: res.page.totalElements
          }
        })
      }
    },
    * getSpecialtys({payload}, {call, put, select}) {
      const res = yield call(getSpecialtys, payload);
      yield put({
        type: 'updateState',
        payload: {
          specialtys: res._embedded.list,
          page: res.page.number,
          size: res.page.size,
          totalElements: res.page.totalElements
        }
      })
    },
    * getPayTypes({payload}, {call, put, select}) {
      const res = yield call(getPayTypes, payload);
      yield put({
        type: 'updateState',
        payload: {
          payTypes: res._embedded.list,
          page: res.page.number,
          size: res.page.size,
          totalElements: res.page.totalElements
        }
      })
    },
    * getProjects({payload}, {call, put, select}) {
      const res = yield call(getProjects);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projects: res.object.object,
          }
        })
      }
    },
    * getCustomers({payload}, {call, put, select}) {
      const res = yield call(getCustomers, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            customers: res._embedded.list,
            page: res.page.number,
            size: res.page.size,
            totalElements: res.page.totalElements
          }
        })
      }
    },
    * getStaffs({payload}, {put, call, select}) {
      const res = yield call(getStaffs);
      yield put({
        type: 'updateState',
        payload: {
          staffs: res.list,
        }
      })
    },
    * getPayments({payload}, {call, put, select}) {
      const res = yield call(getPayments, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            payments: res.object,
            totalElements: res.totalElements,
            page: res.currentPage + 1
          }
        })
      }
    },
    * getProjectsSearchInvoice({payload}, {call, put, select}) {
      const res = yield call(getProjectsSearchInvoice, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectsByApp: res.object
          }
        })
      }
    },
    * getProjectSearchName({payload}, {call, put, select}) {
      const res = yield call(getProjectSearchName, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectsByName: res.list
          }
        })
      }
    },
    * getProjectSearchNameCustomer({payload}, {call, put, select}) {
      const res = yield call(getProjectSearchNameCustomer, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectsByNameCustomer: res.list
          }
        })
      }
    },
    * getProjectSearchNameOrCustomerName({payload}, {call, put, select}) {
      const res = yield call(getProjectSearchNameOrCustomerName, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectSearchNameOrCustomerName: res.list
          }
        })
      }
    },
    * getProjectSubStepCompletedCount({payload}, {call, put, select}) {
      const res = yield call(getProjectSubStepCompletedCount, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectSubStepCompletedCount: res
          }
        })
      }
    },
    * getProjectStepStatus({payload}, {call, put, select}) {
      const res = yield call(getProjectStepStatus, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectStepStatuses: res.list
          }
        })
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
  }
}
