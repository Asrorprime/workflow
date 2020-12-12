import React, {Component} from 'react'
import {Button, Col, Form, Input, Modal, Row} from 'antd'
import PropTypes from "prop-types";
import './index.less'

export default class SpecialtyModal extends Component {

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
          className="specialtyModal"
          title="Mutaxassislik qo'shish"
          visible={showModal}
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="inline" onSubmit={handleSub}>
            <Row>
              <Row>
                <Col span={12} className="mr-0">
                  <Form.Item label="O'zbekcha nomi: ">
                    {getFieldDecorator('nameUz', {
                      initialValue: record.nameUz,
                      rules: [{required: true, message: 'Mutaxassislik nomini kiriting!'}],
                    }, getFieldValue)(
                      <Input placeholder="O'zbekcha nomi"/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12} className="mr-0">
                  <Form.Item label="Ruscha nomi : ">
                    {getFieldDecorator('nameRu', {
                      initialValue: record.nameRu,
                      rules: [{required: true, message: 'Mutaxassislik nomini kiriting!'}],
                    }, getFieldValue)(
                      <Input placeholder="Ruscha nomi"/>
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
SpecialtyModal = Form.create({})(SpecialtyModal);
SpecialtyModal.propTypes = {
  hideModal: PropTypes.func,
  handleSubmit: PropTypes.func,
};
