import api from 'api';
import {notification} from "antd";

const {deleteStaff, editStaff, addStaff, uploadFile, getStaffSearch} = api;
export default ({
  namespace: 'staff',
  state: {
    currentBr: '',
    isOpen: false,
    reset: false,
    views: false,
    image: '',
    imageUrl: '',
    loading: false,
    staffSearch: [],
  },
  subscriptions: {},
  effects: {
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
    },
    * uploadAvatar({payload}, {call, put, select}) {
      const res = yield call(uploadFile, payload);
      console.log(res);
      yield put({
        type: 'updateState',
        payload: {
          image: res.object[0],
          photoId: res.object[0].fileId,
          imageUrl: res.object[0].fileDownloadUri
        }
      })
    },
    * deleteStaff({payload}, {put, call, select}) {
      const res = yield call(deleteStaff, payload);
      if (res.success) {
        notification['success']({message: "Muvaffaqiyatli o'chirildi!"});
        yield put({type: 'app/getStaffs',})
      } else {
        notification['error']({message: "Xodimdan foydalanilgan o'chirish imkoni mavjud emas!"});
      }
    },
    * save({payload}, {call, put, select}) {
      const {currentBr, photoId} = yield select(_ => _.staff);
      const res = yield call(currentBr ? editStaff : addStaff, currentBr ? {
        ...payload,
        id: currentBr.id,
        photoId
      } : {...payload, photoId});
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
        yield put({type: 'app/getStaffs',});
      } else {
        notification['error']({message: "Xodim Ismi yoki Telefon raqami tizimda mavjud!"});
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
