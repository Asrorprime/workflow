import api from 'api';
import {notification} from "antd";

const {savePayType,updatePayType,deletePayType} = api;
export default ({
  namespace: 'payType',
  state: {
    record: {},
    visibleModal:false,
  },
  subscriptions: {},
  effects: {

    * openModal({payload}, {call, put, select}) {
      const {visibleModal} = yield select(_ => _.payType);
      yield put({
        type: 'updateState',
        payload: {
          visibleModal: !visibleModal,
          record:{}
        }
      })
    },
    * deletePayType({payload}, {call, put, select}) {
      const res=yield call(deletePayType,payload);
      if (res.success) {
        notification['success']({message:"Muvaffaqiyatli o'chirildi!"});
        yield put({type: 'app/getPayTypes'})
      } else {notification['error']({message:"To'lov turidan foydalanilgan o'chirish imkoni mavjud emas!"});}
    },
    * savePayType({payload}, {call, put, select}) {
      const res=yield call(savePayType,payload);
      const {visibleModal} = yield select(_ => _.payType);
      if (res.success) {
        notification['success']({message:"Muvaffaqiyatli qo'shildi!"});
        yield put({type:'updateState',
        payload:{
          record:{},
          visibleModal:!visibleModal}});
      yield put({
        type: 'app/getPayTypes'
      })
      }else {
        notification['error']({message:"Qo'shishda xatolik!"});
      }
    },
    * updatePayType({payload}, {call, put, select}) {
      const res=yield call(updatePayType,payload);
      const {visibleModal}=yield select(_=>_.payType);
      if (res.success) {
        notification['success']({message:"Muvaffaqiyatli o'zgartirildi!"});
        yield put({
        type:'updateState',
        payload:{
          record:{},
          visibleModal:!visibleModal,
        }
      });
      yield put({
        type: 'app/getPayTypes'
      });
      }else {
        notification['error']({message:"O'zgartirishda xatolik!"});
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
