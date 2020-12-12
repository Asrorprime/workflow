import React, {Component} from 'react'
import {Button, Col, DatePicker, Form, Input, Modal, Row, Select} from 'antd'
import PropTypes from "prop-types";
import moment from "moment";
import {connect} from "react-redux";
import CurrencyInput from "react-currency-input";
import "./index.less"
@connect(({app, paymentModel}) => ({app, paymentModel}))
class PaymentModal extends Component {
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'app/getPayTypes'
        });
        dispatch({
            type:'app/getProjects'
        });
    }

    state = {
        loading: false,
    };

    render() {
        const {Option} = Select;
        const {Search} = Input;
        const {titleModal, openModal, visibleModal, getCurrent, savePayment, record, dispatch, app} = this.props;
        const {payTypes, projectsByApp, projects} = app;
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const sendForm = e => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    savePayment(values);
                    this.props.form.resetFields();
                }
            });
        };
        const closedModal = () => {
            openModal();
            this.props.form.resetFields();
        };
        const onSearch = () => {
        };
        const onBlur = () => {

        };
        const onChange = () => {

        };
        const onFocus = () => {

        };
        const searchInvoice = (value) => {
            dispatch({
                type: 'app/getProjectsSearchInvoice',
                payload: {
                    invoice: value
                }
            })
        };
        return (
            <div>
                <Modal
                    className="paymentModal"
                    title={titleModal}
                    visible={visibleModal}
                    onCancel={closedModal}
                    footer={null}
                >
                    <Form layout="inline" onSubmit={sendForm} getFieldsValue>
                        <Row>
                            <Row>
                                <Row>
                                  <Col span={6}>
                                    <h6 className="pt-2">Loyiha nomeri:</h6>
                                  </Col>
                                    <Col span={18}>
                                        <Form.Item>
                                            {getFieldDecorator('applicationNumber', {
                                                initialValue: record.applicationNumber,
                                                rules: [{required: true, message: 'To`ldirish shart!'}],
                                            }, getFieldValue)(
                                                <Select
                                                    showSearch
                                                    style={{width: 200}}
                                                    placeholder="Loyihani tanlang"
                                                    // disabled={record.id}
                                                    optionFilterProp="children"
                                                    onChange={onChange}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    onSearch={searchInvoice}
                                                >
                                                    {projects.map(item =>
                                                        <Option
                                                            value={item.applicationNumber}>{item.applicationNumber}</Option>
                                                    )}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                  <Col span={6}>
                                    <h6 className="pt-2">To`lov turi:</h6>
                                  </Col>
                                    <Col span={18}>
                                        <Form.Item>
                                            {getFieldDecorator('payTypeId', {
                                                initialValue: record.payTypeId,
                                                rules: [{required: true, message: 'To`ldirish shart!'}],
                                            }, getFieldValue)(
                                                <Select
                                                    showSearch
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    onFocus={onFocus}
                                                    onSearch={onSearch}
                                                    style={{width: 200}}
                                                    placeholder="To'lov turi"
                                                    optionFilterProp="children" filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }>
                                                    {payTypes.map(item =>
                                                        <Option value={item.id} key={item.id}>{item.nameUz}</Option>
                                                    )}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                  <Col span={6}>
                                    <h6 className="pt-2">
                                      Sum:
                                    </h6>
                                  </Col>
                                    <Col span={18}>
                                        <Form.Item>
                                            {getFieldDecorator('sum', {
                                                initialValue: record.sum,
                                                rules: [{required: true, message: 'To`ldirish shart!'}],
                                            }, getFieldValue)(
                                                // <Input placeholder="To'lov summasi"/>
                                              <CurrencyInput thousandSeparator=" " precision="0" className="currency-input"/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                  <Col span={6}>
                                    <h6 className="pt-2">Sana:</h6>
                                  </Col>
                                    <Col span={18}>
                                        <Form.Item>
                                            {getFieldDecorator('date', {
                                                initialValue: moment(record.date ? record.date.substring(0.10) : new Date()),
                                                rules: [{required: true, message: 'To`ldirish shart!'}],
                                            }, getFieldValue)(
                                                <DatePicker
                                                    // disabledDate={disabledDate}
                                                    format="YYYY-MM-DD"
                                                    placeholder="tugash vaqti"
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Row>
                            <Row>
                                <Col span={8} offset={16} className="mt-4">
                                    <Form.Item>
                                        <Button htmlType="submit"
                                                style={{backgroundColor: "#11E498", color: "white"}}>Saqlash</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }
}

PaymentModal = Form.create({})(PaymentModal);
PaymentModal.propTypes = {
    openModal: PropTypes.func,
    savePayment: PropTypes.func
};
export default PaymentModal;
