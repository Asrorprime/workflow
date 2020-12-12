import React, {Component} from 'react'
import {Modal} from 'antd'


export default class DeleteModal extends Component {

  render() {
    const {deleteInput, openModal, title, visible, id} = this.props;

    const sendForm = () => {

    };

    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={sendForm}
          onCancel={openModal}
        >
          <p>O'chirishni xoxlaysizmi?</p>
        </Modal>
      </div>
    )
  }
}
