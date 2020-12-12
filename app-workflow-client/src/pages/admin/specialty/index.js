import React from 'react';
import {Button, Col, Icon, Modal, Popover, Row, Table} from 'antd';
import "./index.less";
import Container from "react-bootstrap/Container";
import {connect} from "react-redux";
import SpecialtyModal from "../../../components/SpecialtyModal/SpecialtyModal";


@connect(({specialty, app}) => ({specialty, app}))
class Index extends React.PureComponent {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'app/getSpecialtys',
            payload: {
                page: 0,
                size: 10
            }
        })
    }


    constructor() {
        super();
        this.state = {
            pageId: 1
        }
    }

    render() {
        const {dispatch, specialty, app} = this.props;
        const {specialtys, page, size, totalElements} = app;
        const {
            modalShow,
            record
        } = specialty;
        const {confirm} = Modal;
        const columns = [
            {
                title: 'TR',
                dataIndex: 'TR',
                key: 'TR',
                render: (text, record) => <span>
          {specialtys && specialtys.indexOf(record) + 1}
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
     <div onClick={() => deleteSpecialty(record.id)} className="d-inline-block circle delete-circle ml-4">
      <Popover title="Mutaxassislikni o'chirish">
              <Icon type="delete"/>

      </Popover>
       </div>
     <div onClick={() => updateSpecialty(record)}
          className="d-inline-block circle ml-4">
       <Popover title="Mutaxassislikni o'zgartirish">
       <Icon type="edit"/>
         </Popover>
       </div>
    </span>
            },

        ];
        const deleteSpecialty = (specialtyId) => {
            confirm({
                title: 'O\'chirishni xohlaysizmi ?',
                onOk() {
                    dispatch({
                        type: 'specialty/deleteSpecialty',
                        payload: {id: specialtyId}
                    })
                },
                onCancel() {
                },
            });
        };
        const updateSpecialty = (record) => {
            dispatch({
                type: 'specialty/updateState',
                payload: {
                    modalShow: !modalShow,
                    record
                }
            })
        };
        const handleSubmit = (values) => {
            if (record.id > 0) {
                dispatch({
                    type: 'specialty/updateSpecialty',
                    payload: {
                        path: record.id,
                        ...values
                    }
                });
                dispatch({
                    type: 'specialty/updateState',
                    payload: {
                        record: {}
                    }
                })
            } else {
                dispatch({
                    type: 'specialty/addSpecialty',
                    payload: {
                        ...values
                    }
                });
                dispatch({
                    type: 'specialty/updateState',
                    payload: {
                        record: {}
                    }
                })
            }

        };
        const getPaginationSpecialty = (page) => {
            dispatch({
                type: 'app/getSpecialtys',
                payload: {
                    page: page - 1,
                    size: size,
                }
            })
        };
        const openModal = () => {
            dispatch({
                type: 'specialty/updateState',
                payload: {
                    modalShow: !modalShow,
                    record: {}
                }
            })
        }
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
                                <Table className="speciality-table" rowKey={record => specialtys.indexOf(record)} columns={columns}
                                       dataSource={specialtys}
                                       pagination={{
                                           onChange: getPaginationSpecialty,
                                           pageSize: size,
                                           current: page + 1,
                                           total: totalElements
                                       }}/>
                            </Col>
                        </Row>
                        <SpecialtyModal
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
