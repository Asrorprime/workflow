import api from 'api';
import {notification} from "antd";

const {deleteSpecialty,addSpecialty,updateSpecialty} = api;
export default ({
  namespace: 'specialty',
  state: {
    modalShow: false,
    record: {}
  },
  subscriptions: {},
  effects: {
    * deleteSpecialty({payload}, {call, put, select}) {
      const res=yield call(deleteSpecialty,payload);
      if (res.success) {
        notification['success']({message:"Muvaffaqiyatli o'chirildi!"});
        yield put({
        type: 'app/getSpecialtys'
      })
      } else {notification['error']({message:"Mutaxassislikdan foydalanilgan o'chirish mumkin emas!"});}
    },
    * addSpecialty({payload}, {call, put, select}) {
      const res=yield call(addSpecialty,payload);
      const {modalShow}=yield select(_=>_.specialty);
      if (res.success) {
        notification['success']({message:"Muvaffaqiyatli qo'shildi!"});
        yield put({
        type:'updateState',
        payload:{
          modalShow:!modalShow,
          record:{}
        }
      });
      yield put({
        type: 'app/getSpecialtys'
      })
      }else {
        notification['error']({message:"Qo'shishda xatolik!"});
      }
    },
    * updateSpecialty({payload}, {call, put, select}) {
      const res=yield call(updateSpecialty,payload);
      const {modalShow}=yield select(_=>_.specialty);
      if (res.success) {
        notification['success']({message:"Muvaffaqiyatli o'zgartirildi!"});
        yield put({
        type:'updateState',
        payload:{
          modalShow:!modalShow,
          record:{}
        }
      });
      yield put({
        type: 'app/getSpecialtys'
      })
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
