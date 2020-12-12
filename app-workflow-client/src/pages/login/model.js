  import api from 'api'
  import {TOKEN_NAME} from 'utils/constant';
  import router from "umi/router";
  import {notification} from "antd";
  import {openPages} from 'utils/config'

  const {signIn} = api;

  export default {
    namespace: 'login',
    state: {
      currentUser: {},
      // eye:false,
    },
    subscriptions: {
      setup({dispatch, history}) {
        history.listen(({pathname}) => {

        })
      },
    },
    effects: {
      * login({payload}, {put, call, select}) {
        const data = yield call(signIn, payload);
        if (data.success) {
          if (data.body.accessToken !== undefined) {
            localStorage.setItem(TOKEN_NAME, data.body.tokenType + " " + data.body.accessToken);
            router.push('/dashboard')
          }
        } else {
          notification['error']({message: "Login yoki Parolda Xatolik"});
          yield put({
            type: 'updateState',
            payload: {
              isLoading: false
            },
          });
        }
      },
    },
    reducers: {
      updateState(state, payload) {
        return {
          ...state,
          ...payload
        }
      }
    }
  }
