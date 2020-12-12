import api from 'api';
import {notification} from "antd";

const {savePayment, updatePayment, deletePayment, addPayment, editPayment, getPayments} = api;
export default ({
  namespace: 'payment',
  state: {
    record: {},
    visibleModal: false,
    totalElements: 0,
    page: 0,
    size: 10,
    payments: []
  },
  subscriptions: {},
  effects: {
    * getPayments({payload}, {call, put, select}) {
      const res = yield call(getPayments, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            payments: res.object,
            totalElements: res.totalElements,
            page: res.currentPage
          }
        })
      }
    },
    * openModal({payload}, {call, put, select}) {
      const {visibleModal} = yield select(_ => _.payment);
      yield put({
        type: 'updateState',
        payload: {
          visibleModal: !visibleModal,
          record: {}
        }
      })
    },
    * deletePayment({payload}, {call, put, select}) {
      const res = yield call(deletePayment, payload);
      if (res.success) {
        notification['success']({message: "Muvaffaqiyatli o'chirildi!"});
        yield put({type: 'payment/getPayments'})
      } else {
        notification['error']({message: "To'lov turidan foydalanilgan o'chirish imkoni mavjud emas!"});
        yield put({
          type: 'app/getPayments'
        });
      }
    },
    * savePayment({payload}, {call, put, select}) {
      const res = yield call(savePayment, payload);
      const {visibleModal} = yield select(_ => _.payment);
      if (res.success) {
        notification['success']({message:res.message});
        yield put({
          type: 'updateState',
          payload: {
            record: {},
            visibleModal: !visibleModal
          }
        });
        yield put({
          type: 'payment/getPayments'
        })
      } else {
        notification['error']({message: res.message});
      }
    },
    * updatePayment({payload}, {call, put, select}) {
      const res = yield call(updatePayment, payload);
      const {visibleModal} = yield select(_ => _.payment);
      if (res.success) {
        notification['success']({message: res.message});
        yield put({
          type: 'updateState',
          payload: {
            record: {},
            visibleModal: !visibleModal,
          }
        });
        yield put({
          type: 'payment/getPayments'
        });
      } else {
        notification['error']({message: res.message});
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
})
