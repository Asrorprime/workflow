import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Button, Col, Form, Icon, Input, Row} from 'antd'
import './index.less'
import {TOKEN_NAME} from 'utils/constant';
import {router} from 'umi';
import {Container} from "react-bootstrap";

const FormItem = Form.Item;

class Login extends React.PureComponent {

  componentWillMount() {
    if (localStorage.getItem(TOKEN_NAME)) {
      router.push('/dashboard')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      type: 'password',
      score: 'null'
    }
    this.showHide = this.showHide.bind(this);
  }

  showHide(e) {
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    })
  }

  render() {
    const {
      loading,
      dispatch,
      form: {
        getFieldDecorator,
        validateFieldsAndScroll,
      },
    } = this.props;
    const handleOk = () => {
      validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return
        }
        dispatch({
          type: 'login/login',
          payload: values
        })
      })
    }
    return (
      <div id="login">
        <form>
          <Container>
            <Row>
              <Col span='24'>
                <img onClick={function () {
                  router.push("/kpi")
                }} src="/assets/images/logo.png" className='pl-3 mt-4' alt="wrk"/>
              </Col>
            </Row>
          </Container>
          <Row className='mt-5 pt-4'>
            <Col span={12} className='text-center mt-5'>
              <Row>
                <Col span={8} className="offset-4">
                  <h4 className='mt-2 pt-5'>Tizimga kirish</h4>
                  <FormItem hasFeedback>
                    {getFieldDecorator('phoneNumber', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input placeholder="Login" className='mt-4 pt-4 pb-4'/>
                    )}
                  </FormItem>
                  <FormItem hasFeedback className=" password">
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<Input onPressEnter={handleOk} type={this.state.type}
                              placeholder="Password" className='mt-3 pt-4 pb-4'/>
                    )}
                  </FormItem>
                  <Button style={{height: "50px"}}
                          type='primary' className='mt-4'
                          onClick={handleOk} loading={loading.effects.login}>Kirish</Button>
                </Col>
                <Col span={2}>
                  <div className="password_show" onClick={this.showHide}>
                    {this.state.type === 'input' ? <Icon type="eye"/>
                      : <Icon type="eye-invisible"/>}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span='12'>
              <img src="assets/images/piechart.png" className='img-fluid' alt="pie"/>
            </Col>
          </Row>
        </form>
      </div>
    )
  }
};

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({loading}) => ({loading}))(Form.create()(Login))
