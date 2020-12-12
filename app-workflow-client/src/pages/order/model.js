import api from 'api';
import {notification} from "antd";

const {getUnCompletedProjects,getProjectSearchName, completeSubStep,undoSubStep, uploadFile, deleteAttachment, getProjectSteps} = api;

export default {
  namespace: 'order',

  state: {
    unCompletedProjects: [],
    projectSteps: [],
    showProjectSteps: '',
    selectedProjectStep: 0,
    curProject: '',
    thisProject:''
  },
  subscriptions: {},
  effects: {
    * getProjectSearchName({payload}, {call, put, select}) {
      const res = yield call(getProjectSearchName, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            unCompletedProjects: res.list
          }
        })
      }
    },
    * getUnCompletedProjects({payload}, {put, call, select}) {
      const res = yield call(getUnCompletedProjects, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            unCompletedProjects: res.object
          }
        })
      }
    },
    * getProjectSteps({payload}, {put, call, select}) {
      const res = yield call(getProjectSteps, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projectSteps: res.object,
            showProjectSteps: true,
            curProject: res.object[0].projectId,
            thisProject:payload.project
          }
        })
      }
    },
    * completeSubStep({payload}, {put, call, select}) {
      console.log(payload)
      const {curProject} = yield select(_ => _.order);
      const res = yield call(completeSubStep, payload);
      if (res.success) {
        notification.success({message: res.message});
        yield put({type:'getUnCompletedProjects'});
        yield put({type:'getProjectSteps',
        payload:{
          path:curProject
        }})
      }
    },
    * undoSubStep({payload}, {put, call, select}) {
      const {curProject} = yield select(_ => _.order);
      const res = yield call(undoSubStep, payload);
      if (res.success) {
        notification.success({message: res.message});
        yield put({type:'getUnCompletedProjects'});
        yield put({type:'getProjectSteps',
          payload:{
            path:curProject
          }})
      }
    },
    * deleteAttachment({payload}, {put, call, select}) {
      const {curProject} = yield select(_ => _.order);
      const res = yield call(deleteAttachment, payload);
      yield put({type:'getUnCompletedProjects'});
      yield put({type:'getProjectSteps',
        payload:{
          path:curProject
        }});
      if (res.success) {
        notification.success({message: res.message});
      } else {
        notification.success({message: res.message});
      }
    },
    * uploadFile({payload}, {call, put, select}) {
      const {curProject} = yield select(_ => _.order);
      const res = yield call(uploadFile, payload);
      yield put({type:'getUnCompletedProjects'});
      yield put({type:'getProjectSteps',
        payload:{
          path:curProject
        }});

      if (res.success) {
        notification.success({message: 'Fayl yuklandi!'});
      } else {
        notification.success({message: 'Xatolik'});
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
