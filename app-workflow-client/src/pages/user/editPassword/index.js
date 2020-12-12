import React, {Component} from 'react';
import {connect} from "dva";
import {Button, Col, Form, Input, notification, Row} from "antd";
import {goBack} from "umi/src/router";
import PropTypes from "prop-types";
import './index.less';

@connect(({user, app}) => ({user, app}))
class Index extends Component {
  render() {
    const {dispatch, app, user} = this.props;
    const {currentUser} = app;
    const {oldPassword, password, prePassword, eye} = user;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if(!err) {
          if (password === prePassword) {
            dispatch({
              type: 'user/editPwd',
              payload: {
                ...values
              }
            });
          } else {
            notification['error']({
              message:"Yangi parol noto'gri takrorlandi"
            });
          }
        }else{
          notification['error']({
            message:"Ma'lumotlar to'liq emas"
          });
        }
      });
    }
    const updateState = (e) => {
      dispatch({
        type: 'user/updateState',
        payload: {
          [e.target.name]: e.target.value
        }
      })
    }
    const showPwd = (x) => {
      let pwd=1;
      dispatch({
        type: 'user/updateState',
        payload: {
          eye: eye.map((i, index) => index === x ? !i : i)
        }

      });
      if (x == 0) {
        pwd = document.getElementById("oldPassword")
      } else if (x == 1) {
        pwd = document.getElementById("password")
      } else {
        pwd = document.getElementById("prePassword")
      }
      if (pwd.type == 'text') {
        pwd.type = 'password';
      } else {
        pwd.type = 'text';
      }
    }
    return (
      <div className="container user_edit py-5">
        <div className="row">
          <div className="col-md-8 offset-2 edit-password-responsive">
            <h3 className="header-title2 text-center">Parolni o'zgartirish</h3>
            <div className="card">
              <div className="card-body p-sm-3 p-md-0 p-lg-5 p-0">
                <Form layout="inline" onSubmit={handleSubmit} getFieldsValue>
                  <Row>
                    <Col span={24}>
                     <Row>
                       <Col span={7}>
                         <span className="label_span">eski parol</span>
                       </Col>

                       <Col span={17}>
                         <Form.Item style={{width:"90%"}}>
                           {getFieldDecorator('oldPassword', {
                             rules: [{required: true, message: 'parol kiritilmadi!'}],
                           }, getFieldValue)(
                             <Input  name="oldPassword" id="oldPassword"
                                    type="password" placeholder="********"
                                    onChange={updateState}/>
                           )}
                         </Form.Item>
                         <button style={{marginTop:"5px"}} type='button'
                                 className={(eye[0] ? "icon-eye" :
                           "icon-eye-off") + " icon eye_btn"}
                                 onClick={() => showPwd(0)}></button>
                       </Col>

                     </Row>


                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col span={24}>
                      <Row>
                        <Col span={7}>
                          <span className="label_span">yangi parol</span>
                        </Col>
                        <Col span={17}>
                          <Form.Item style={{width:"90%"}}>
                            {getFieldDecorator('password', {
                              rules: [{required: true, message: 'parol kiritilmadi!'}],
                            }, getFieldValue)(
                              <Input name="password" id="password" type="password"
                                     placeholder="********" onChange={updateState}/>
                            )}
                          </Form.Item>
                          <button style={{marginTop:"5px"}} type='button'
                                  className={(eye[1] ? "icon-eye" : "icon-eye-off") + " icon eye_btn"}
                                  onClick={() => showPwd(1)}></button>

                        </Col>
                      </Row>

                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col span={24}>
                      <Row>
                        <Col span={7}>
                          <span className="label_span">parolni qayta kiriting</span>

                        </Col>
                        <Col span={17}>
                          <Form.Item style={{width:"90%"}}>
                            {getFieldDecorator('prePassword', {
                              rules: [{required: true, message: 'parol kiritilmadi!'}],
                            }, getFieldValue)(
                              <Input name="prePassword" id="prePassword" type="password" placeholder="********" onChange={updateState}/>
                            )}
                          </Form.Item>
                          <button style={{marginTop:"5px"}} type='button' className={(eye[2] ? "icon-eye" : "icon-eye-off") + " icon eye_btn"}
                                  onClick={() => showPwd(2)}></button>
                        </Col>
                      </Row>


                    </Col>
                  </Row>



                  <Row className="mt-4">
                    <Col md="6" className="offset-3 mt-1">
                      <div className="d-flex justify-content-end">
                        <Button className="mr-4" onClick={goBack}>Bekor qilish</Button>
                        <Button htmlType="submit" className="save_btn" type="primary">Saqlash</Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Index = Form.create({})(Index);
Index.propTypes = {
  hideModal: PropTypes.func,
  handleSubmit: PropTypes.func,
};

export default Index;
