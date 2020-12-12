import React, {Component} from 'react'
import {Button, Col, Form, Input, Modal, Row} from 'antd'
import PropTypes from "prop-types";
import './index.less'

export default class StepModal extends Component {

  state = {
    loading: false,
  };

  render() {
    const {
      showModal, hideModal,
      handleSubmit, record
    } = this.props;
    const handleCancel = () => {
      hideModal();
      this.props.form.resetFields();
    };

    const {getFieldDecorator, getFieldValue} = this.props.form;
    const handleSub = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          handleSubmit(values);
          this.props.form.resetFields();
        }
      });
    };
    return (
      <div>
        <Modal
          className="stepModal"
          title="Bosqich qo'shish"
          visible={showModal}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="inline" onSubmit={handleSub}>
            <Row>
              <Row>
                <Col span={12} className="mr-0">
                  <Form.Item label="Nomi: ">
                    {getFieldDecorator('nameUz', {
                      initialValue: record.nameUz,
                      rules: [{required: true, message: 'Bosqich nomini kiriting!'}],
                    }, getFieldValue)(
                      <Input placeholder="Name Uz"/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12} className="mr-0">
                  <Form.Item label="Nomi: ">
                    {getFieldDecorator('nameRu', {
                      initialValue: record.nameRu,
                      rules: [{required: true, message: 'Bosqich nomini kiriting!'}],
                    }, getFieldValue)(
                      <Input placeholder="Name Ru"/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Row>
            <Row>
              <Col span={8} offset={16} className="mt-4">
                <Form.Item>
                  <Button htmlType="submit" style={{backgroundColor: "#11E498", color: "white"}}>Saqlash</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}
StepModal = Form.create({})(StepModal);
StepModal.propTypes = {
  hideModal: PropTypes.func,
  handleSubmit: PropTypes.func,
};
