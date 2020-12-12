import React, {Component} from 'react'
import {Button, Col, Form,Input, Modal, Row, Select} from 'antd'
import PropTypes from "prop-types";

export default class PayTypeModal extends Component {

  state = {
    loading: false,
  };


  render() {

    const {Option} = Select;
    const {titleModal, openModal, visibleModal, savePayType,record,closeModal} = this.props;

    const {getFieldDecorator, getFieldValue} = this.props.form;
    const sendForm = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          savePayType(values);
          this.props.form.resetFields();
        }
      });};
    const closedModal=()=>{
      openModal();
      this.props.form.resetFields();
    };
    return (
      <div>
        <Modal
          className="payTypeModal"
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
                  <Form.Item label="Nomi: ">
                    {getFieldDecorator('nameUz',{
                      initialValue: record.nameUz,
                      rules: [{ required: true, message: 'Nomini kiritish shart!' }],
                    },getFieldValue)(
                      <Input  placeholder="name Uz" />
                    )}
                  </Form.Item>
                </Col>
                </Row>
                <Row>
                <Col span={24}>
                  <Form.Item label="Nomi: ">
                    {getFieldDecorator('nameRu',{
                      initialValue:  record.nameRu,
                      rules: [{ required: true, message: 'Nomini kiritish shart!' }],
                    },getFieldValue)(
                      <Input  placeholder="Name Ru" />
                    )}
                  </Form.Item>
                </Col>
                </Row>
              </Row>
              <Row>
                <Col span={8} offset={16} className="mt-4">
                  <Form.Item >
                    <Button htmlType="submit"  style={{backgroundColor: "#11E498", color: "white"}}>Saqlash</Button>
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
PayTypeModal = Form.create({})(PayTypeModal);
PayTypeModal.propTypes = {
  openModal: PropTypes.func,
  savePayType: PropTypes.func
};
