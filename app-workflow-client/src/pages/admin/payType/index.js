import React from 'react';
import {Button, Col, Icon, Modal, Popover, Row, Table} from 'antd';
import "./index.less";
import Container from "react-bootstrap/Container";
import {connect} from "react-redux";
import PayTypeModal from "../../../components/PayTypeModal/PayTypeModal";


@connect(({app, payType}) => ({app, payType}))
class Index extends React.PureComponent {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'app/getPayTypes',
            payload: {
                page: 0,
                size: 10
            }
        })
    }

    render() {

        const {dispatch, app, payType} = this.props;
        const {payTypes, size, page, totalElements} = app;
        const {visibleModal, record} = payType;
        const {confirm} = Modal;
        const columns = [
            {
                title: 'TR',
                dataIndex: 'TR',
                key: 'TR',
                render: (text, record) => <span>
          {payTypes.indexOf(record) + 1}
        </span>
            },
            {
                title: 'Nomi(Uz)',
                dataIndex: 'nameUz',
                key: 'nameUz',
            },
            {
                title: 'Nomi(Ru)',
                dataIndex: 'nameRu',
                key: 'nameRu',
            },
            {
                title: 'Amallar',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => <span>
     <div onClick={() => deletePayType(record.id)} className="d-inline-block circle delete-circle ml-4">
          <Popover title="To'lov turini o'chirish">
       <Icon type="delete"/>
          </Popover>
       </div>
     <div onClick={() => updatePayType(record)}
          className="d-inline-block circle ml-4">
          <Popover title="To'lov turini o'zgartirish">
       <Icon type="edit"/>
          </Popover>
       </div>
    </span>
            },
        ];

        const openModal = () => {
            dispatch({
                type: 'payType/openModal',
            })
        };
        const savePayType = (values) => {
            if (record.id != null) {
                dispatch({
                    type: 'payType/updatePayType',
                    payload: {
                        path: record.id,
                        ...values
                    }
                })
            } else {
                dispatch({
                    type: 'payType/savePayType',
                    payload: {
                        ...values
                    }
                })
            }
        };
        const deletePayType = (payTypeId) => {
            confirm({
                title: 'O\'chirishni xohlaysizmi ?',
                onOk() {
                    dispatch({
                        type: 'payType/deletePayType',
                        payload: {id: payTypeId}
                    })
                },
                onCancel() {
                },
            });
        };

        const updatePayType = (record) => {
            dispatch({
                type: 'payType/updateState',
                payload: {
                    visibleModal: !visibleModal,
                    record
                }
            })
        };
        const getPaginationPayTypes = (page) => {
            dispatch({
                type: 'app/getPayTypes',
                payload: {
                    size: size,
                    page: page - 1
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
                                <Table className="payment-table" pagination={{
                                    onChange: getPaginationPayTypes,
                                    current: page + 1,
                                    pageSize: size,
                                    total: totalElements
                                }} columns={columns} dataSource={payTypes}/>
                            </Col>
                        </Row>
                        <PayTypeModal
                            titleModal="To'lov turini qo'shish"
                            visibleModal={visibleModal}
                            savePayType={savePayType}
                            openModal={openModal}
                            record={record}
                        />
                    </Container>
                </section>
            </div>
        );
    }
}

export default Index;
