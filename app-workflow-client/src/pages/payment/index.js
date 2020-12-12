import React, {PureComponent} from 'react';
import {connect} from "dva";
import {Card, Col, Form, Input, Modal, Row, Search} from 'antd';
import PropTypes from "prop-types";
import './style.less'
import ProfileOutlined from "@ant-design/icons/lib/icons/ProfileOutlined";

@connect(({paymentModel, app}) => ({paymentModel, app}))
class Payment extends PureComponent {
  constructor() {
    super();
    this.state = {
      paymentsProject: [],
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/getProjects',
    });
  }

  render() {
    const {Search} = Input;
    const {paymentModel, dispatch, app} = this.props;
    const {projects, projectSearchNameOrCustomerName} = app;
    const {switchOn, visible} = paymentModel;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const handleSub = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'dashboard/saveStep',
            payload: {
              ...values,
            }
          });
        }
      });
    };

    function onChange(pagination, filters, sorter, extra) {
      console.log('params', pagination, filters, sorter, extra);
    }

    const showModal = (item) => {
      dispatch({
        type: 'paymentModel/updateState',
        payload: {
          visible: !visible,
        },
      });
      this.setState({paymentsProject: item})
    };
    const handleOk = () => {
      dispatch({
        type: 'paymentModel/updateState',
        payload: {
          visible: !visible,
        },
      });
    };
    const okPayment = () => {
      dispatch({
        type: 'paymentModel/updateState',
        payload: {
          visible: !visible,
        }
      });
    }
    const changeSwitch = () => {
      dispatch({
        type: 'paymentModel/updateState',
        payload: {
          switchOn: switchOn === "active-cursor" ? "default-cursor" : "active-cursor"
        }
      });
    };
    return (
      <div className="payment-page">
        <div className="container">
          <Row className="pt-5">
            <Col span={6}>
              <h6>Loyihalar qiymati</h6>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card className="payment-card">
                <Row className="all-sum">
                  <Col span={24}>
                    <h4>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.reduce((prev, cur) => prev + cur.price, 0)))}<span>UZS</span>
                    </h4>
                  </Col>
                </Row>
                <Row className="sum">
                  <Col span={12}>
                    <p>Tushum</p>
                    <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.reduce((prev, cur) => prev + cur.paidSum, 0)))}<span>UZS</span>
                    </h6>
                  </Col>
                  <Col span={12}>
                    <p>Qoldiq</p>
                    <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.reduce((prev, cur) => prev + cur.leftOver, 0)))}<span>UZS</span>
                    </h6>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row className="pt-3">
            <Col span={18}/>
            <Col span={6} className="pl-4">
              <Search
                placeholder="Loyiha nomi va Aloqadagi shaxs  bo'yicha qidirish..."
                onSearch={value =>
                  dispatch({
                    type: 'app/getProjectSearchNameOrCustomerName',
                    payload: {
                      searchName: value.toLowerCase()
                    }
                  })}
                // style={{width: 20}}
              />
            </Col>
          </Row>
          <Row className="pt-4">
            <Col span={24}>
              <Row className="table-payment">
                <Col span={3} className="pl-3">
                  <h5>T/R</h5>
                </Col>
                <Col span={5}>
                  <h5>Loyihalar</h5>
                </Col>
                <Col span={5}>
                  <h5>Aloqadagi shaxs</h5>
                </Col>
                <Col span={4}>
                  <h5>Umumiy summa</h5>
                </Col>
                <Col span={4}>
                  <h5>Qolgan summa</h5>
                </Col>
                <Col span={3}>
                  <h5>To'lovlar tarixi</h5>
                </Col>
              </Row>
              {projectSearchNameOrCustomerName.length == 0 ? projects.map((item, i) => (
                  <Row className="table-payment-hover" key={i.id}>
                    <Col span={3} className="pl-3">
                      <h5>{i + 1}</h5>
                    </Col>
                    <Col span={5}>
                      <h5>{item.name}</h5>
                    </Col>
                    <Col span={5}>
                      <h5>{item.customerName}</h5>
                    </Col>
                    <Col span={4}>
                      <h5>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(item.price))}</h5>
                    </Col>
                    <Col span={4}>
                      <h5>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(item.leftOver))}</h5>
                    </Col>
                    <Col span={3}>
                      <div className="text-center">
                        <ProfileOutlined className="icon-plus" onClick={() => showModal(item.payments)}/>
                      </div>
                    </Col>
                  </Row>
                )) :
                projectSearchNameOrCustomerName.map((item, i) => (
                  <Row className="table-payment-hover" key={i.id}>
                    <Col span={3} className="pl-3">
                      <h5>{i + 1}</h5>
                    </Col>
                    <Col span={5}>
                      <h5>{item.name}</h5>
                    </Col>
                    <Col span={5}>
                      <h5>{item.customerName}</h5>
                    </Col>
                    <Col span={4}>
                      <h5>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(item.price))}</h5>
                    </Col>
                    <Col span={4}>
                      <h5>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(item.leftOver))}</h5>
                    </Col>
                    <Col span={3}>
                      <div className="text-center">
                        <ProfileOutlined className="icon-plus" onClick={() => showModal(item.payments)}/>
                      </div>
                    </Col>
                  </Row>
                ))}
            </Col>

          </Row>

          <Modal className="payment-modal"
                 title="To'lovlar tarixi"
                 visible={visible}
                 onCancel={handleOk}
                 footer={null}
          >
            {/*<Row>*/}
            {/*  <Col span={24}>*/}
            {/*    <Row>*/}
            {/*      <Col span={8}>*/}
            {/*        <Input disabled={switchOn === 'active-cursor'} placeholder="summa"/>*/}
            {/*      </Col>*/}
            {/*      <Col span={3}>*/}
            {/*        <div className="switch">*/}
            {/*          <div onClick={changeSwitch}*/}
            {/*               className={switchOn === 'active-cursor' ? "default-cursor" : "active-cursor"}>*/}
            {/*            <p/>*/}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*      </Col>*/}
            {/*    </Row>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            <Row className="mt-2">
              <Col span={24}>
                <Row className="table-payment">
                  <Col span={3} className="pl-3 text-center"><h6>T/R</h6></Col>
                  {/*<Col span={6}><h6>Qolgan summa</h6></Col>*/}
                  <Col span={10} className="text-center"><h6>To'langan summa</h6></Col>
                  <Col span={10} className="text-center"><h6>Sana</h6></Col>
                  {/*<Col span={3}><h6>Amal</h6></Col>*/}
                </Row>
                {this.state.paymentsProject.length !== 0 ?
                  this.state.paymentsProject.map((item, i) =>

                    <Row className="table-payment-hover">
                      <Col span={3} className="pl-3 text-center"><h6>{i + 1}</h6></Col>
                      <Col span={10} className="text-center">
                        <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(item.sum))}</h6>
                      </Col>
                      <Col span={10} className="text-center"><h6>{item.date}</h6></Col>
                      {/*<Col span={3}>*/}
                      {/*  <div className="text-center">*/}
                      {/*    <Icon className="icon-oper" type="close-circle"/>*/}
                      {/*  </div>*/}
                      {/*</Col>*/}
                    </Row>)
                  :
                  <div>
                    <Row className="table-payment-hover">
                      <Col span={24}><h6 className="text-center">Bu loyiha uchun xali to'lovlar mavjud emas</h6></Col>
                    </Row>
                  </div>
                }
              </Col>
            </Row>
            {/*<Row className="mt-4">*/}
            {/*  <Col span={5} offset={14}>*/}
            {/*    <div className="cancel-div mr-4"*/}
            {/*         onClick={handleOk}>*/}
            {/*      Bekor qilish*/}
            {/*    </div>*/}
            {/*  </Col>*/}
            {/*  <Col span={5}>*/}
            {/*    /!*<div className="payment-div" onClick={okPayment}>*!/*/}
            {/*    /!*  Saqlash*!/*/}
            {/*    /!*</div>*!/*/}
            {/*  </Col>*/}
            {/*</Row>*/}
          </Modal>
        </div>
      </div>
    );
  }
}

Payment = Form.create({})(Payment);
Payment.propTypes = {
  hideModal: PropTypes.func,
  handleSubmit: PropTypes.func,
};
export default Payment;
