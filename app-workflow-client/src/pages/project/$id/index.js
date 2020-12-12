import React, {Component} from 'react';
import './style.less'
import {Card, Collapse} from "antd";
import CheckCircleOutlined from "@ant-design/icons/es/icons/CheckCircleOutlined";
import {connect} from "react-redux";
import {goBack} from "umi/src/router";
import {Col, Row} from "react-bootstrap";

const {Panel} = Collapse;

@connect(({app, project}) => ({app, project}))
class Index extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'project/getProject',
      payload: {
        path: this.props.match.params.id
      }
    })
  }

  render() {
    const {project} = this.props;
    const {currentProject} = project;
    return (
      <div className="project-id-page pt-4">
        <div className="container">
          <Row>
            <Col md={12} className="text-center project-count-name">
              <Row className="header-row">
                <Col md={3} className="col-3"><h6>Loyiha nomi</h6></Col>
                <Col md={3} className="col-3"><h6>Raqami</h6></Col>
                <Col md={3} className="col-3"><h6>Ish jarayoni(%)</h6></Col>
                <Col md={3} className="col-3"><h6>Proyekt holati</h6></Col>
              </Row>
              <Row className="tbody-row">
                <Col md={3} className="col-3"><h6>
                  {currentProject ? currentProject.name : ''}</h6>
                </Col>
                <Col md={3} className="col-3"><h6>{currentProject ? currentProject.applicationNumber : ''}</h6>
                </Col>
                <Col md={3} className="col-3"><h6>
                  {currentProject ? ((((currentProject.resProjectSteps.filter(item => item.completedDate !== null).length) / (currentProject.resProjectSteps.length)) * 100) === 0 ? 0 :
                      Math.floor(((currentProject.resProjectSteps.filter(item => item.completedDate !== null).length) / (currentProject.resProjectSteps.length)) * 100)
                  ) : ''}%
                </h6></Col>
                <Col md={3} className="col-3"><h6>{currentProject ?
                  currentProject.status : ''
                }</h6></Col>
              </Row>

            </Col>
          </Row>
          <Row className="prokect-back">
            <Col md={11}/>
            <Col md={1}>
              <div onClick={goBack} className="back-btn">Ortga</div>
            </Col>
          </Row>
          <h4 className="d-inline-block offset-5 mt-3">Barcha bosqichlar</h4>
          <Row className="mt-4" style={{display: "flex", flexWrap: "wrap"}}>
            {currentProject ? currentProject.resProjectSteps.sort((a, b) => a.createdAt > b.createdAt ? (a.createdAt < b.createdAt ? 1 : 0) : -1)
              .map((item, i) =>
                <Col md={3} id={i}>
                  <div className="history-project">
                    <div
                      className={item.completedDate ? "project-green mt-2" : (item.startDate ? "project-yellow mt-2" : "project-disabled mt-2")}>
                      {item.step.nameUz}
                    </div>
                    <div className="projects mt-2">
                      <Card>
                        <Row>
                          <Col md={10}>
                            <p className="client">Biriktirilgan
                              xodimlar</p>
                          </Col>
                          <Col md={2}>
                            <p className="clients-count">{item.staffs.length}</p>
                          </Col>
                          <Col md={12}
                               className="accordions-client">
                            <div className="bordered-accordion"/>
                            <div className="bordered-accordion"/>
                            <Collapse accordion>
                              <Panel key="1">{
                                item.staffs.map(item =>
                                  <p className="mb-0">{item.firstName + " " + item.lastName}</p>
                                )
                              }
                              </Panel>

                            </Collapse>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col md={10}>
                            <p className="client-two">Bo'limlar</p>
                          </Col>
                          <Col md={2}>
                            <p className="clients-count">{item.resSubSteps.length}</p>
                          </Col>
                          <Col md={12}
                               className="accordions-client">
                            <div className="bordered-accordion"/>
                            <div className="bordered-accordion"/>
                            <Collapse accordion
                                      className="checkCircleOutlined">
                              <Panel key="1">
                                {item.resSubSteps.map(item =>
                                  <Row>
                                    <Col md={9}>
                                      <p className="mb-0">{item.name}</p>
                                    </Col>
                                    {item.completed === true ?
                                      <Col md={3}
                                           className="checked" style={{cursor: "default"}}>
                                        <CheckCircleOutlined/>
                                      </Col>
                                      :
                                      <Col md={3}
                                           className="unchecked" style={{cursor: "default"}}>
                                        <CheckCircleOutlined/>
                                      </Col>
                                    }
                                  </Row>
                                )}
                              </Panel>
                            </Collapse>
                          </Col>
                        </Row>
                        <Row className="date-project mt-3">
                          <Col md={6}>
                            <p className="start-date">Boshlanish
                              vaqti</p>
                            <h6>{item.startDate === null ? 'Boshlanmagan' : item.startDate.substring(0, 10)}</h6>
                          </Col>
                          <Col md={6} className="pl-4">
                            <p className="start-date">Tugash
                              vaqti</p>
                            <h6>{item.deadline.substring(0, 10)}</h6>
                          </Col>
                        </Row>
                        <Row className="add-progress-project mt-2 pt-1">
                          <Col md={9}>
                            {currentProject ? (item.attachmentId ?
                              <a href={'/api/file/' + item.attachmentId}>Yuklab
                                olish</a> : "Fayl mavjud emas") : ''
                            }
                          </Col>
                          <Col md={3}>
                            <div
                              className="project-persent">{Math.round((item.countCompletedSubSteps / item.resSubSteps.length) * 100)}%
                            </div>
                          </Col>
                        </Row>
                      </Card>

                    </div>
                  </div>
                </Col>
              ) : ''}
          </Row>
          <Row className="mt-5">
            <h5>Loyiha to'g'risida ma'lumot</h5>
            <Col md={12}>
              <Row className="about-project">
                <Col md={4} className="col-4"><h6>Boshlangan vaqti</h6></Col>
                <Col
                  md={8} className="col-8">{currentProject ? currentProject.startDate ? currentProject.startDate : "Boshlanmagan" : ''}</Col>
                <div className="col-border-right"/>
              </Row>
              <Row className="about-project">
                <Col md={4} className="col-4"><h6>Yakunlangan vaqt</h6></Col>
                <Col
                  md={8} className="col-8">{currentProject ? currentProject.endDate ? currentProject.endDate : currentProject.status : ''}</Col>
                <div className="col-border-right"/>
              </Row>
              <Row className="about-project">
                <Col md={4} className="col-4"><h6>Tugatish vaqti</h6></Col>
                <Col md={8} className="col-8">{currentProject ? currentProject.deadline : ''}</Col>
                <div className="col-border-right"/>
              </Row>
              <Row className="about-project">
                <Col md={4} className="col-4"><h6>Narxi</h6></Col>
                <Col
                  md={8} className="col-8">{currentProject ? new Intl.NumberFormat("fr-FR", {currency: 'UZS'}).format(currentProject.price)   : ''} UZS<span></span></Col>
                <div className="col-border-right"/>
              </Row>
              <Row className="about-project">
                <Col md={4} className="col-4"><h6>Loyihada ishtirok etgan xodimlar</h6></Col>
                <Col md={8} className="col-8">{currentProject ? currentProject.staffsCount : 0}</Col>
                <div className="col-border-right"/>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
