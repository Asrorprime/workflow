import api from 'api';
import {router} from "umi";
import {notification} from "antd";
import {goBack} from "umi/src/router";

const {getUpcomingEventsOfUser,editPassword, getUpcomingEvents, addReview,editUser,uploadFile,getPositions} = api;
export default ({
  namespace: 'user',
  state: {
    image:'',
    imageUrl:'',
    loading:false,
    oldPassword:'',
    password:'',
    prePassword:'',
    eye:[false,false,false],
  },
  subscriptions: {

  },
  effects: {
    * editPwd({payload}, {put, call, select}) {
      const res = yield call(editPassword,payload);
      if (res.success) {
        notification['success']({
          message:"Parol o'zgartirildi"
        });
        localStorage.removeItem("workflow-token");
        localStorage.setItem("workflow-token","Bearer "+res.message)
        router.push('/dashboard');
      } else {
        notification['success']({
          message:"Parol o'zgartirilmadi"
        });
      }
    },
    * uploadAvatar({payload}, {call, put, select}) {
      const res = yield call(uploadFile, payload);
      yield put({
        type: 'updateState',
        payload: {
          image: res.object[0],
          photoId: res.object[0].fileId,
          imageUrl: res.object[0].fileDownloadUri
        }
      })
    },
    * save({payload}, {call, put, select}){
      const {photoId} = yield select(_ => _.user);
      const res = yield call(editUser, {...payload, photoId});
      if (res.success) {
        notification['success']({
          message:"Muvaffaqiyatli o'zgartirildi"
        });
        yield put({
          type: 'app/userMe'
        });
        goBack();
      }else {
        notification['error']({
          message:"Qo'shishda xatolik"
        });
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
