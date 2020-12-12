import React, {PureComponent} from 'react';
import {connect} from "dva";
import {Card, Col, Form, Input, Row, Table} from 'antd';
import "./index.less";
import PropTypes from "prop-types";

@connect(({dashboard, report, app}) => ({dashboard, report, app}))
class Dashboard extends PureComponent {

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/getProjects',
    });
    dispatch({
      type: 'report/getNotCompletedProjects',
    });
    dispatch({
      type: 'app/getProjectSearchNameCustomer',
    });
  }

  render() {
    const {dashboard, dispatch, report, app}
      = this.props;
    const {projects, projectsByNameCustomer} = app;
    const {reset} = dashboard;
    const {notCompletedProjects} = report;
    const {Search} = Input;
    if (reset) {
      this.props.form.resetFields();
      dispatch({
        type: 'dashboard/updateState',
        payload: {reset: false}
      });
    }
    const columns = [
      {
        title: 'Loyiha raqami',
        dataIndex: 'applicationNumber',
        render: text => <span>{text}</span>
      },
      {
        title: 'Kompaniya nomi',
        dataIndex: 'customer.companyName',
      },
      {
        title: 'Aloqadagi shaxs',
        dataIndex: 'customer.fullName',
      },
      {
        title: 'Loyiha nomi',
        dataIndex: 'name',
      },
      {
        title: 'Holati',
        dataIndex: 'status',
        filters: [
          {
            text: 'New',
            value: 'Yangi',
          },
          {
            text: 'In progress',
            value: 'Jarayonda',
          },
          {
            text: 'Completed',
            value: 'Yakunlangan',
          },
          {
            text: 'Closed',
            value: 'Arxivlangan',
          }
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.status.indexOf(value) === 0,
      },
    ];

    function onChange(pagination, filters, sorter, extra) {
      console.log('params', pagination, filters, sorter, extra);
    }

    return (
      <div className="dashboard-page bg-light">
        <div className="dashboard-body">
          <div className="container dashboard-card">
            <Row className="pt-5">
              <Col md={6}>
                <h6>Umumiy Loyihalar Soni</h6>
                <Card className='CardLarder card-height mt-1'>
                  <Row className="all-num">
                    <h4>{projects.length} <span>ta</span></h4>
                  </Row>
                  <Row className="parogres-dashboard">
                    <Col md={12} className="in-progres col-6">
                      <p>Yangi</p>
                      <h6>{projects.filter(item => item.projectStatus === "NEW").length} ta</h6></Col>
                    <Col md={12} className="two-cars-col8 col-6">
                      <p>Jarayonda</p>
                      <h6>{projects.filter(item => item.projectStatus === "IN_PROGRESS").length} ta</h6></Col>
                    <Col md={12} className="complete col-6">
                      <p>Yakunlangan</p>
                      <h6>{projects.filter(item => item.projectStatus === "COMPLETED").length} ta</h6></Col>
                    <Col md={12} className="complete three-card col-6">
                      <p>Arxiv</p>
                      <h6>{projects.filter(item => item.projectStatus === "CLOSED").length} ta</h6></Col>
                  </Row>
                </Card>
              </Col>
              <Col md={1}/>
              <Col md={10} className="all-sum-mobilni">
                <h6>Umumiy Loyihalar summasi</h6>
                <Card className='CardLarder card-height mt-1'>
                  <Row className="all-num">
                    <h4>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.reduce((prev, cur) => prev + cur.price, 0)))}<span>UZS</span>
                    </h4>
                  </Row>
                  <Row className="parogres-dashboard">
                    <Col md={12} className="two-cars-col8 col-6">
                      <p>Yangi</p>
                      <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.filter(item => item.projectStatus === "NEW").reduce((prev, cur) => prev + cur.price, 0)))}<span>UZS</span>
                      </h6></Col>
                    <Col md={12} className="two-cars-col8 col-6">
                      <p>Jarayonda</p>
                      <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.filter(item => item.projectStatus === "IN_PROGRESS").reduce((prev, cur) => prev + cur.price, 0)))}<span>UZS</span>
                      </h6></Col>
                    <Col md={12} className="two-cars-col8 col-6">
                      <p>Yakunlangan</p>
                      <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.filter(item => item.projectStatus === "COMPLETED").reduce((prev, cur) => prev + cur.price, 0)))}<span>UZS</span>
                      </h6></Col>
                    <Col md={12} className="two-cars-col8 col-6">
                      <p>Arxiv</p>
                      <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(projects.filter(item => item.projectStatus === "CLOSED").reduce((prev, cur) => prev + cur.price, 0)))}<span>UZS</span>
                      </h6></Col>
                  </Row>
                </Card>
              </Col>
              <Col md={1}/>
              <Col md={6} className="late-project-project">
                <h6 style={{color: "red"}}>Muddati o'tgan Loyihalar</h6>
                <Card className='CardLarder card-height mt-1'>
                  <Row className="all-num">
                    <h4 style={{color: "red"}}>{notCompletedProjects.length} <span>ta</span></h4>
                  </Row>
                  <Row className="parogres-dashboard">
                    <Col md={24} className="three-card">
                      <p>Umumiy summa</p>
                      <h6>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(notCompletedProjects.reduce((prev, cur) => prev + cur.price, 0)))}
                        <span>UZS</span></h6></Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row className="pt-5">
              <Search
                placeholder="Loyiha nomi va Aloqadagi shaxs bo'yicha qidirish ..."
                onSearch={value =>
                  dispatch({
                    type: 'app/getProjectSearchNameCustomer',
                    payload: {
                      name:  value.toLowerCase()
                    }
                  })
                }
                style={{width: 300}}
              />
            </Row>
            <Row className="mt-2 mb-5 table-dashboard">
              <Col md={24}>
                <Table columns={columns} dataSource={projectsByNameCustomer.length==0 ? projects : projectsByNameCustomer}
                       onChange={onChange}/>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard = Form.create({})(Dashboard);
Dashboard.propTypes = {
  hideModal: PropTypes.func,
  handleSubmit: PropTypes.func,
};
export default Dashboard;
