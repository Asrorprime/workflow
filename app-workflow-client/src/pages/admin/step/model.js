import api from 'api';
import {notification} from "antd";

const {deleteStep, addStep, updateStep,getSteps} = api;
export default ({
    namespace: 'step',
    state: {
        modalShow: false,
        record: {},
        page:0,
        size:10,
        totalElements:0,
    },
    subscriptions: {},
    effects: {
        * deleteStep({payload}, {call, put, select}) {
            const res = yield call(deleteStep, payload);
            if (res.success) {
                notification['success']({message: "Muvaffaqiyatli o'chirildi!"});
                yield put({
                    type: 'app/getSteps'
                })
            } else {
                notification['error']({message: "Bosqich foydalanilgan o'chirish mumkin emas!"});
            }
        },
        * addStep({payload}, {call, put, select}) {
            const res = yield call(addStep, payload);
            const {modalShow} = yield select(_ => _.step);
            if (res.success) {
                notification['success']({message: "Muvaffaqiyatli qo'shildi!"});
                yield put({
                    type: 'updateState',
                    payload: {
                        modalShow: !modalShow,
                        record: {}
                    }
                });
                yield put({
                    type: 'app/getSteps'
                })
            } else {
                notification['error']({message: "Qo'shishda xatolik!"});
            }
        },
        * updateStep({payload}, {call, put, select}) {
            const res = yield call(updateStep, payload);
            const {modalShow} = yield select(_ => _.step);
            if (res.success) {
                notification['success']({message: "Muvaffaqiyatli o'zgartirildi!"});
                yield put({
                    type: 'updateState',
                    payload: {
                        modalShow: !modalShow,
                        record: {}
                    }
                });
                yield put({
                    type: 'app/getSteps'
                })
            } else {
                notification['error']({message: "O'zgartirishda xatolik!"});
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
