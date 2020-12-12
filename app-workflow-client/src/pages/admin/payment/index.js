import React from 'react';
import Container from "react-bootstrap/Container";
import {Button, Col, Icon, Modal, Popover, Row, Table} from "antd";
import {connect} from "react-redux";
import PaymentModal from "../../../components/PaymentModal/PaymentModal";


@connect(({app, payment}) => ({app, payment}))
class Index extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      pageId: 1
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'payment/getPayments',
      payload: {
        page: 0,
        size: 10
      }
    });
    dispatch({
      type: 'app/getPayTypes'
    })
  }

  render() {

    const {dispatch, app, payment} = this.props;
    const {payTypes} = app;
    const {visibleModal, record, totalElements, page, size, payments} = payment;
    const {confirm} = Modal;
    const columns = [
      {
        title: 'TR',
        dataIndex: 'TR',
        key: 'TR',
        render: (text, record) => <span>
          {payments.indexOf(record) + 1 + (page * size)}
        </span>
      },
      {
        title: 'Loyiha nomeri',
        dataIndex: 'applicationNumber',
        key: 'applicationNumber',
      },
      {
        title: 'To`lov turi',
        dataIndex: 'payTypeNameUz',
        key: 'payType',
      },
      {
        title: 'Sum',
        dataIndex: 'sum',
        key: 'sum',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
      {
        title: 'Sana',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Amallar',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => <span>
     <div onClick={() => deletePayment(record.id)} className="d-inline-block circle delete-circle ml-4">
         <Popover title="To'lovni o'chirish">
       <Icon type="delete"/>
         </Popover>
       </div>
          {/*<div onClick={() => updatePayment(record)}*/}
          {/*     className="d-inline-block circle ml-4"><Icon type="edit"/> </div>*/}
    </span>
      },
    ];
    const openModal = () => {
      dispatch({
        type: 'payment/openModal',
      })
    };
    const savePayment = (values) => {
      console.log(values);
      if (record.id != null) {
        dispatch({
          type: 'payment/updatePayment',
          payload: {
            id: record.id,
            ...values
          }
        })
      } else {
        dispatch({
          type: 'payment/savePayment',
          payload: {
            ...values,
            sum: values.sum.replace(/ /g, ''),
          }
        })
      }
    };
    const deletePayment = (paymentId) => {
      confirm({
        title: 'O\'chirishni xohlaysizmi ?',
        onOk() {
          dispatch({
            type: 'payment/deletePayment',
            payload: {id: paymentId}
          })
        },
        onCancel() {
        },
      });
    };
    const updatePayment = (record) => {
      dispatch({
        type: 'payment/updateState',
        payload: {
          visibleModal: !visibleModal,
          record
        }
      })
    };
    const getCurrent = (project) => {
      dispatch({
        type: 'app/updateState',
        payload: {
          project
        }
      })
    };
    const getPaymentPagination = (page) => {
      dispatch({
        type: 'payment/getPayments',
        payload: {
          page: page - 1,
          size: size,
        }
      })
    };
    return (
      <div>
        <section className="payType_add">
          <Container>
            <Row className="mt-3">
              <Col span={10}>
                <Button type="primary" onClick={openModal}
                        style={{backgroundColor: "#11E498", color: "white"}}>Qo'shish</Button>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col span={24}>
                <Table className="payment-table" pagination={
                  {
                    onChange: getPaymentPagination,
                    current: page + 1,
                    pageSize: size,
                    total: totalElements
                  }} columns={columns} dataSource={payments}
                       rowKey={record => payments.indexOf(record)}/>
              </Col>
            </Row>
            <PaymentModal
              titleModal="To'lov qo'shish"
              visibleModal={visibleModal}
              savePayment={savePayment}
              openModal={openModal}
              record={record}
              getCurrent={getCurrent}
            />
          </Container>
        </section>
      </div>
    );
  }
}


export default Index;
