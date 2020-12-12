import api from 'api';
import {notification} from "antd";

const {deleteCustomer, editCustomer, addCustomer, getCustomersSearch} = api;
export default ({
  namespace: 'customer',
  state: {
    currentBr: '',
    isOpen: false,
    reset: false,
    views: false,
    customerSearch:[],
  },
  subscriptions: {},
  effects: {
    * getCustomersSearch({payload}, {call, put, select}) {
      const res = yield call(getCustomersSearch, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            customerSearch: res._embedded.list
          }
        })
      }
    },
    * deleteCustomer({payload}, {put, call, select}) {
      const res = yield call(deleteCustomer, payload);
      if (res.success) {
        notification['success']({message: "Muvaffaqiyatli o'chirildi!"});
        yield put({type: 'app/getCustomers',})
      } else {
        notification['error']({message: "Xaridordan foydalanilgan o'chirish imkoni mavjud emas!"});
      }
    },
    * save({payload}, {call, put, select}) {
      const {currentBr} = yield select(_ => _.customer);
      const res = yield call(currentBr ? editCustomer : addCustomer, currentBr ? {
        ...payload,
        path: currentBr.id
      } : {...payload});
      if (res.success) {
        notification['success']({message: "Muvaffaqiyatli amalga oshirildi!"});
        yield put({
          type: 'updateState',
          payload: {
            currentBr: '',
            isOpen: false,
            reset: true,
          }
        });
        yield put({type: 'app/getCustomers',});
      } else {
        notification['error']({message: "Xaridor Ismi yoki Telefon raqami tizimda mavjud!"});
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

})
