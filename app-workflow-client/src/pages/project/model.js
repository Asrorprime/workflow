import api from 'api';
import router from "umi/router";
import {notification} from "antd";

const {
  addProject, getProjects, getProject, getFile, uploadFile,
  cancelProject, deleteProject, startProject, toArchive, getProjectSearchName
} = api;
export default {
  namespace: 'project',

  state: {
    projectSteps: [{index: 0, subSteps: [0]}],
    selectedItem: false,
    modalShow: false,
    record: {},
    measure: {},
    visibleModal: false,
    imageUrl: '',
    photoId: '',
    showModal: false,
    id: '',
    projectByOrder: false,
    currentProject: '',
    projectId: '',
    projects: [],
    projectsSearch: [],
    deadlineDate:''
  },
  subscriptions: {},
  effects: {
    * getProjects({payload}, {call, put, select}) {
      const res = yield call(getProjects, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            projects: res.object.object,
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
            projectsSearch: res.list
          }
        })
      }
    },
    * addProject({payload}, {call, put, select}) {
      const res = yield call(addProject, payload);
      if (res.success) {
        notification['success']({message: res.message});
        router.push("/project")
        window.location.reload();
      } else {
        notification['error']({message: res.message});
      }
    },
    * deleteProject({payload}, {call, put, select}) {
      const res = yield call(deleteProject, payload);
      if (res.success) {
        yield put({
          type: 'getProjects'
        });
        notification.success({message: res.message});
      } else {
        notification.error({message: res.message});
      }
    },
    * openModal({payload}, {call, put, select}) {
      const {visibleModal} = yield select(_ => _.template);
      yield put({
        type: 'updateState',
        payload: {
          visibleModal: !visibleModal,
          imageUrl: ''
        }
      })
    },
    * getFile({payload}, {call, put, select}) {
      const res = yield call(getFile, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            image: res.object,
          }
        })
      }
    },
    * getProject({payload}, {call, put, select}) {
      const res = yield call(getProject, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentProject: res.object,
          }
        })
      }
    },
    * uploadFile({payload}, {call, put, select}) {
      const res = yield call(uploadFile, payload);
      if (res.success) {
        yield put({
          type: 'updateState',
          payload: {
            image: res.object[0],
            imageUrl: res.object[0].fileDownloadUri,
            photoId: res.object[0].fileId
          }
        })
      }
    },
    * cancelProject({payload}, {call, put, select}) {
      const res = yield call(cancelProject, payload);
      if (res.success) {
        yield put({
          type: 'app/getProjects'
        });
        notification.success({message: res.message});
      } else {
        notification.error({message: res.message});
      }
    },
    * startProject({payload}, {call, put, select}) {
      const res = yield call(startProject, payload);
      if (res.success) {
        notification.success({message: res.message});
        yield put({
          type: 'getProjects'
        });
      } else {
        notification.error({message: res.message});
      }
    },
    * toArchive({payload}, {call, put, select}) {
      const res = yield call(toArchive, payload);
      if (res.success) {
        notification.warning({message: res.message});
        yield put({
          type: 'getProjects'
        });
      } else {
        notification.error({message: res.message})
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
