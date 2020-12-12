import React from 'react';
import {Button, Col, Form, Icon, Input, Modal, Popover, Row, Table} from 'antd';
import "./style.less";
import Container from "react-bootstrap/Container";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";


@connect(({customer, app}) => ({customer, app}))
class Index extends React.PureComponent {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'app/getCustomers',
            payload: {
                page: 0,
                size: 10
            }
        });
    }
    render() {
      const {Search} = Input;
      const {customer, dispatch, app} = this.props;
        const {customers, size, totalElements, page} = app;
        const {currentBr, isOpen, reset, views, customerSearch} = customer;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {confirm} = Modal;
        const getPaginateCustomer = (page) => {
            dispatch({
                type: 'app/getCustomers',
                payload: {
                    page: page - 1,
                    size: size,
                }
            })
        };

    const columns = [
      {
        title: 'TR',
        dataIndex: 'TR',
        key: 'TR',
        render: (text, record) => <span>
          {customers.indexOf(record) + 1 + (page * size)}
        </span>
      },
      {
        title: 'Ma\'sul xodim',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: 'Kompaniya nomi',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: 'Telefon raqami',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        render:(text,record)=>record.phoneNumber ?<span>{record.phoneNumber}</span>:<span>Mavjud emas</span>

      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render:(text,record)=>record.status ?<span>{record.status}</span>:<span>Mavjud emas</span>
      },
      {
        title: 'Amallar',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => <span className="icons-customers">
        <div className="d-inline-block circle delete-circle ml-4" onClick={() => deleteCustomer(record.id)}>
          <Popover title="Xaridor ma'lumotlarini o'chirish">
          <Icon type="delete"/>
            </Popover>
          </div>
        <div className="d-inline-block circle  ml-4" onClick={() => openModal(record.id)}>
            <Popover title="Xaridor ma'lumotlarini o'zgartirish">
          <Icon type="edit"/>
            </Popover>
          </div>
        <div className="d-inline-block circle eye-circle ml-4"
             onClick={() => viewModal(record.id)}>
           <Popover title="Xaridor ma'lumotlarini ko'rish">
          <EyeOutlined/>
           </Popover>
          </div></span>
      },

    ];
    if (reset) {
      this.props.form.resetFields();
      dispatch({
        type: 'customer/updateState',
        payload: {reset: false}
      });
    }
    const deleteCustomer = (customerId) => {
      confirm({
        title: 'O\'chirishni xohlaysizmi ?',
        onOk() {
          dispatch({
            type: 'customer/deleteCustomer',
            payload: {id: customerId}
          })
        },
        onCancel() {
        },
      });
    };
    const openModal = i => {
      if (i) {
        const y = customers.filter(j => i === j.id);
        dispatch({
          type: 'customer/updateState',
          payload: {currentBr: y[0], isOpen: true}
        });
      } else {
        dispatch({
          type: 'customer/updateState',
          payload: {currentBr: '', isOpen: true}
        });
      }
    };
    const viewModal = i => {
      dispatch({
        type: 'customer/updateState',
        payload: {views: true}
      });
      if (i) {
        const y = customers.filter(j => i === j.id);
        dispatch({
          type: 'customer/updateState',
          payload: {currentBr: y[0], isOpen: true}
        });
      } else {
        dispatch({
          type: 'customer/updateState',
          payload: {currentBr: '', isOpen: true}
        });
      }
    };
    const closeModal = () => {
      dispatch({
        type: 'customer/updateState',
        payload: {
          currentBr: '', isOpen: false,
          views: false
        }
      });
      this.props.form.resetFields()
    };
    const handleSub = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'customer/save',
            payload: {
              ...values,
            }
          })
        }
      });
    };
    return (
      <div>
        <section className="templete">
          <Container>
            <Row className="mt-3">
              <Col md={10}>
                <Button onClick={() => openModal(false)} type="primary"
                        style={{backgroundColor: "#11E498", color: "white"}}>Qo'shish</Button>

              </Col>
              <Col md={8}/>
              <Col md={6}>
                <Search className="customers-search"
                        placeholder="Qidirish ..."
                        onSearch={val =>
                          dispatch({
                            type: 'customer/getCustomersSearch',
                            payload: {
                              searchByName: val.toLowerCase()
                            }
                          })
                        }
                        style={{width: 270}}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col span={24}>
                <Table className="customers-table" columns={columns} rowKey={record => customers.indexOf(record)}
                       dataSource={customerSearch.length === 0 ? customers : customerSearch} pagination={{
                  onChange: getPaginateCustomer,
                  current: page + 1,
                  pageSize: size,
                  total: totalElements
                }}/>
              </Col>
            </Row>
          </Container>
        </section>

                <div>
                    <Modal className="customers-modal-responsive" width={800} title={views ? "Xaridor haqida ma'lumot" : "Xaridor qo'shish"} footer={null}
                           visible={isOpen} onCancel={closeModal}>
                        <Form layout="inline" onSubmit={handleSub} getFieldsValue>
                            <Row className="">
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Ma'sul Xodim</p>
                                    <Form.Item>
                                        {getFieldDecorator('fullName', {
                                            initialValue: currentBr ? currentBr.fullName : '',
                                            rules: [{required: true, message: "To'ldirilmadi!"}],
                                        }, getFieldValue)(
                                            <Input disabled={views} placeholder="Ma'sul Xodim"/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Kompaniya nomi</p>
                                    <Form.Item>
                                        {getFieldDecorator('companyName', {
                                            initialValue: currentBr ? currentBr.companyName : '',
                                            rules: [{required: true, message: "To'ldirilmadi!"}],
                                        }, getFieldValue)(
                                            <Input placeholder="Kompaniya nomi" disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Telefon raqami</p>
                                    <Form.Item>
                                        {getFieldDecorator('phoneNumber', {
                                            initialValue: currentBr ? currentBr.phoneNumber : '',
                                          rules: [{required: true, message: "To'ldirilmadi!"}],                                        }, getFieldValue)(
                                            <Input placeholder="+998 ** *** ** **" disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Manzil</p>
                                    <Form.Item>
                                        {getFieldDecorator('address', {
                                            initialValue: currentBr ? currentBr.address : '',
                                        }, getFieldValue)(
                                            <Input placeholder="Zarqaynar ko'ch., 3b-uy." disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="">
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Xisob raqami</p>
                                    <Form.Item>
                                        {getFieldDecorator('account', {
                                            initialValue: currentBr ? currentBr.account : '',
                                        }, getFieldValue)(
                                            <Input placeholder="Xisob raqami" disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Bank nomi</p>
                                    <Form.Item>
                                        {getFieldDecorator('bankName', {
                                            initialValue: currentBr ? currentBr.bankName : '',
                                        }, getFieldValue)(
                                            <Input placeholder="Bank nomi" disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Kompaniya Direktori</p>
                                    <Form.Item>
                                        {getFieldDecorator('director', {
                                            initialValue: currentBr ? currentBr.director : '',
                                        }, getFieldValue)(
                                            <Input placeholder="Kompaniya Direktori" disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">INN raqami</p>
                                    <Form.Item>
                                        {getFieldDecorator('tin', {
                                            initialValue: currentBr ? currentBr.tin : '',
                                        }, getFieldValue)(
                                            <Input placeholder="INN raqami" disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="">
                                <Col md={6} className="mt-2">
                                    <p className="label_span mb-0">Status</p>
                                    <Form.Item>
                                        {getFieldDecorator('status', {
                                            initialValue: currentBr ? currentBr.status : '',
                                        }, getFieldValue)(
                                            <Input placeholder="Status" disabled={views}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col md={18} className="mt-2">
                                    <p className="label_span mb-0">Izoh </p>
                                    <Form.Item>
                                        {getFieldDecorator('comment', {
                                            initialValue: currentBr ? currentBr.comment : '',
                                        }, getFieldValue)(
                                            <Input.TextArea className="textarea-comment" placeholder="Izoh qoldirish...." disabled={views} style={{
                                                width: "550px",
                                                height: "25px"
                                            }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className="d-flex mt-3 pt-3 border-top">
                                {views ? '' : <Button htmlType="submit" type={"primary"} className='mx-3 ml-auto'
                                                      style={{
                                                          backgroundColor: "#11E498",
                                                          color: "white"
                                                      }}>Saqlash</Button>}
                            </div>
                        </Form>
                    </Modal>
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
