import React, {Component} from 'react'
import {Col, Modal, Row, Table} from 'antd'
import './index.less';
import PropTypes from "prop-types";


class InfoModal extends Component {

  render() {
    const {visibleModal, openModal, title, outputs} = this.props;

    return (
      <div>
        <Modal
          id='modal'
          className="modal-task"
          title={title}
          visible={visibleModal}
          onCancel={openModal}
          footer={false}
        >
          <div className="container p-0">

            <Row className="mt-4">
              <Col span={24}>
                <Table rowKey={record => record.id}   columns={[
                  {
                    title: 'ID',
                    dataIndex: 'id',
                    render: (text, record) => outputs.indexOf(record) + 1
                  },
                  {
                    title: 'NOMI',
                    dataIndex: 'materialUz',
                  },
                  {
                    title: 'MIQDORI',
                    dataIndex: 'amount',
                  },
                  {
                    title: 'O\'LCHOVI',
                    dataIndex: 'measureUz',
                  },
                  {
                    title: 'JAMI SUMMA',
                    dataIndex: 'sum'
                  },
                  {
                    title: 'SANA',
                    dataIndex: 'date'
                  }
                ]} dataSource={outputs} pagination={false}/>
              </Col>
            </Row>

          </div>
        </Modal>
      </div>
    )
  }
}

InfoModal.propTypes = {
  openModal: PropTypes.func
};
export default InfoModal
