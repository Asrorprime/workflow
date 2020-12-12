import React from 'react';
import {Button, Col, Icon, Modal, Popover, Row, Table} from 'antd';
import "./index.less";
import Container from "react-bootstrap/Container";
import {connect} from "react-redux";
import StepModal from "../../../components/StepModal/StepModal";


@connect(({step, app}) => ({step, app}))
class Index extends React.PureComponent {

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'app/getSteps',
            payload: {
                page: 0,
                size: 10
            }
        })
    }


    render() {
        const {dispatch, step, app} = this.props;
        const {modalShow, record} = step;
        const {page,size,totalElements,steps} = app;
        const {confirm} = Modal;
        const getStepPagination = (page) => {
            dispatch({
                type: 'app/getSteps',
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
          {steps.indexOf(record) + 1 + (page * size)}
        </span>
            },
            {
                title: 'Nomi(Uz)',
                dataIndex: 'nameUz',
                key: 'UZ',
            },
            {
                title: 'Nomi(Ru)',
                dataIndex: 'nameRu',
                key: 'RU',
            },
            {
                title: 'Amallar',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => <span>
     <div onClick={() => deleteStep(record.id)} className="d-inline-block circle delete-circle ml-4">
       <Popover title="Bosqichni o'chirish">
       <Icon type="delete"/>
       </Popover>
       </div>
     <div onClick={() => updateStep(record)}
          className="d-inline-block circle ml-4">
        <Popover title="Bosqichni o'zgartirish">
       <Icon type="edit"/>
        </Popover></div>
    </span>
            },

        ];
        const deleteStep = (stepId) => {
            confirm({
                title: 'O\'chirishni xohlaysizmi ?',
                onOk() {
                    dispatch({
                        type: 'step/deleteStep',
                        payload: {id: stepId}
                    })
                },
                onCancel() {
                },
            });
        };
        const updateStep = (record) => {
            dispatch({
                type: 'step/updateState',
                payload: {
                    modalShow: !modalShow,
                    record
                }
            })
        };
        const handleSubmit = (values) => {
            if (record.id > 0) {
                dispatch({
                    type: 'step/updateStep',
                    payload: {
                        path: record.id,
                        ...values
                    }
                });
                dispatch({
                    type: 'step/updateState',
                    payload: {
                        record: {}
                    }
                })
            } else {
                dispatch({
                    type: 'step/addStep',
                    payload: {
                        ...values
                    }
                });
                dispatch({
                    type: 'step/updateState',
                    payload: {
                        record: {}
                    }
                })
            }

        };
        const openModal = () => {
            dispatch({
                type: 'step/updateState',
                payload: {
                    modalShow: !modalShow,
                    record: {}
                }
            })
        };
        return (
            <div>
                <section className="level_add">
                    <Container>
                        <Row className="mt-3">
                            <Col span={10}>
                                <Button type="primary" onClick={openModal}
                                        style={{backgroundColor: "#11E498", color: "white"}}>Qo'shish</Button>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col span={24}>
                                <Table className="level-table" rowKey={record => steps.indexOf(record)} pagination={{
                                    onChange: getStepPagination,
                                    current: page + 1,
                                    pageSize: size,
                                    total: totalElements
                                }} columns={columns}
                                       dataSource={steps}/>
                            </Col>
                        </Row>
                        <StepModal
                            record={record}
                            showModal={modalShow}
                            hideModal={openModal}
                            handleSubmit={handleSubmit}
                        />
                    </Container>
                </section>
            </div>
        );
    }
}

export default Index;
