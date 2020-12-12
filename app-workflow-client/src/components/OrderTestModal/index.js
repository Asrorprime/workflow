import React, {Component} from 'react'
import {Button, Col, Form, Input, Modal, Row, Select} from 'antd'
import PropTypes from "prop-types";
export default class OrderTestModal extends Component {

  state = {
    loading: false,
  };


  render() {

    const {Option} = Select;
    const {titleModal, openModal, visibleModal, savePayment, record, closeModal} = this.props;

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
    return (
      <div>
        <Modal
          className="OrderTestModal"
          title={titleModal}
          visible={visibleModal}
          onCancel={closedModal}
          footer={null}
        >
          <Form layout="inline" onSubmit={sendForm} getFieldsValue>
            <Row>
              <Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Loyiha nomeri: ">
                      {getFieldDecorator('applicationNumber', {
                        initialValue: record.applicationNumber,
                        rules: [{required: true, message: 'To`ldirish shart!'}],
                      }, getFieldValue)(
                        <Input placeholder="Loyiha nomeri"/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="To`lov turi: ">
                      {getFieldDecorator('payType', {
                        initialValue: record.payType,
                        rules: [{required: true, message: 'To`ldirish shart!'}],
                      }, getFieldValue)(
                        <Input placeholder="To`lov turi"/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Row>
              <Row>
                <Col span={8} offset={20} className="mt-4">
                  <Form.Item>
                    <Button htmlType="submit" style={{backgroundColor: "#11E498", color: "white"}}>Saqlash</Button>
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
OrderTestModal = Form.create({})(OrderTestModal);
OrderTestModal.propTypes = {
  openModal: PropTypes.func
};
