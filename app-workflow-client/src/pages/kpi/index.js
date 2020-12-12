import React, {Component} from 'react';
import {Input, Search} from "antd";
import {Col, Container, Row} from "react-bootstrap";
import './style.less'
import {connect} from "dva";
import router from "umi/router";
import MyHeader from "../../components/MyHeader/MyHeader";

@connect(({kpi, app}) => ({kpi, app}))
class Index extends Component {
    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'app/getStaffs',
        });
        dispatch({
            type: 'kpi/getStaffSearch',
        });
    }

    render() {
        const {kpi, dispatch, app, getStaffSearch} = this.props;
        const {staffs} = app;
        const {staffSearch} = kpi;
        const {Search} = Input;
        const onSearchKpi = (val) => {
            dispatch({
                type: 'kpi/getStaffSearch',
                payload: {
                    staffSearch: val.toLowerCase()
                }
            });
            dispatch({
                type: 'kpi/getProjectsByStaff',
                payload: {
                    staffId: this.props.match.params.id,
                    page: 0,
                    size: 10
                }
            });
        };
        return (
            <div className="kpi">
                <MyHeader/>
                <Container>
                    <Row className="pt-5">
                        <Col span={24}>
                            <Search
                                placeholder="FIO bo'yicha qidirish..."
                                onSearch={onSearchKpi}
                                style={{width: 200}}
                            />
                        </Col>
                    </Row>
                    <Row className="pt-4 all-table-kpi">
                        <Col md={12}>
                            <Row className="table-kpi">
                                <Col md={1} className="col-1">
                                    <h5>T/R</h5>
                                </Col>
                                <Col md={2} className="col-2">
                                    <h5>Ismi</h5>
                                </Col>
                                <Col md={3} className="col-3">
                                    <h5>Familiyasi</h5>
                                </Col>
                                <Col md={3} className="col-3">
                                    <h5>Mutaxasisliklari</h5>
                                </Col>
                                <Col md={3} className="col-3">
                                    <h5>Loyihalari soni</h5>
                                </Col>
                            </Row>
                            {staffSearch.length > 0 ? staffSearch.map((staff, i) =>
                                    <Row className="table-kpi-hover" key={staff.id}
                                         onClick={function () {
                                             router.push("/kpi/" + staff.id)
                                         }}>
                                        <Col md={1} className="col-1">
                                            <h6>{(i + 1)}</h6>
                                        </Col>
                                        <Col md={2} className="col-2">
                                            <h6>{staff.firstName}</h6>
                                        </Col>
                                        <Col md={3} className="col-3">
                                            <h6>{staff.lastName}</h6>
                                        </Col>
                                        <Col md={3} className="col-3">
                                            <h6>{staff.specialtyNameUz}</h6>
                                        </Col>
                                        <Col md={3} className="col-3">
                                            <h6>{staff.projectsCount}</h6>
                                        </Col>
                                    </Row>
                                ) :
                                staffs.map((staff, i) =>
                                    <Row className="table-kpi-hover" key={staff.id}
                                         onClick={function () {
                                             router.push("/kpi/" + staff.id)
                                         }}>
                                        <Col md={1} className="col-1">
                                            <h6>{(i + 1)}</h6>
                                        </Col>
                                        <Col md={2} className="col-2">
                                            <h6>{staff.firstName}</h6>
                                        </Col>
                                        <Col md={3} className="col-3">
                                            <h6>{staff.lastName}</h6>
                                        </Col>
                                        <Col md={3} className="col-3">
                                            <h6>{staff.specialtyNameUz}</h6>
                                        </Col>
                                        <Col md={3} className="col-3">
                                            <h6>{staff.projectsCount}</h6>
                                        </Col>
                                    </Row>
                                )}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

Index.propTypes = {};

export default Index;
