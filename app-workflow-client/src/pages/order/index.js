import React, {PureComponent} from 'react';
import {connect} from "dva";
import {Button, Card, Col, Collapse, Form, Layout, Modal, Row, Upload} from 'antd';
import "./index.less";
import LeftSideList from "../../components/LeftSideList/LeftSideList";
import CheckCircleOutlined from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";

const {Panel} = Collapse;

@connect(({order, dashboard, app}) => ({order, dashboard, app}))
class Dashboard extends PureComponent {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'order/getTaskList'
    });
    dispatch({
      type: 'order/getUnCompletedProjects'
    });
    dispatch({
      type: 'app/getProjectStepStatus'
    });
    dispatch({
      type: 'order/getProjectSteps'
    });
  }

  render() {

    const {dispatch, order, app} = this.props;
    const {projectStepStatuses} = app;
    const {confirm} = Modal;
    const {projectSteps, showProjectSteps, curProject, thisProject} = order;

    const getProjectSteps = (project) => {
      dispatch({
        type: 'order/getProjectSteps',
        payload: {
          path: project.projectId,
          project
        }
      });
    };
    const undoSubStep = (subStepId) => {
      confirm({
        title: 'Amalni bajarishga rozimisiz?',
        onOk() {
          dispatch({
            type: 'order/undoSubStep',
            payload: {
              path: subStepId,
              curProject
            }
          })
        },
        onCancel() {

        }
      })
    };
    const completeSubStep = (subStepId,undo) => {
      confirm({
        title: undo===true ? 'Bosqichni tugatmoqchimisiz?' : "Bosqichni ortga qaytarmoqchimisiz?",
        onOk() {
          dispatch({
            type: 'order/completeSubStep',
            payload: {
              subStepId: subStepId,
              undo:undo,
              curProject
            }
          })
        },
        onCancel() {

        }
      })
    };
    const uploadFile = (options, projectStepId) => {
      dispatch({
        type: 'order/uploadFile',
        payload: {
          options,
          fileUpload: true,
          type: projectStepId
        }
      })
    };
    const deleteAttachment = (attachmentId) => {
      confirm({
        title: 'Faylni o\'chirishni xoxlaysizmi!',
        onOk() {
          dispatch({
            type: 'order/deleteAttachment',
            payload: {
              id: attachmentId
            }
          })
        },
        onCancel() {
        }
      });
    };
    return (
      <div>
        <Layout>
          <section className="task">
            <div className="container-fluid pt-3 p-0">
              <Row>
                <Col md={6} className="task-col-6-style" >
                  <LeftSideList
                    getProjectSteps={getProjectSteps}
                  />
                </Col>
                <Col md={18} className="px-2">
                  <Row>
                    <Col span={24}>
                      <div className="rightsitelist">
                        {showProjectSteps ?
                          (thisProject && thisProject.byOrder === true
                              ?
                              <div>
                                <h4>Barcha bosqichlar</h4>
                                <div className="main-right-div">
                                  {projectSteps.map((item, i) =>
                                    <div className="ml-2 mt-3">
                                      <div
                                        className={item.complete===true ? "project-green" : (item.startDate ? "project-yellow" : "project-disabled")}>
                                        <h5>{item.step.nameUz}<span>{"#" + (i + 1)}</span></h5>
                                      </div>
                                      <div className={item.startDate ? "projects mt-2" : "mt-2 disabled-project"}>

                                        <Card>
                                          {item.startDate ? <div></div> : <div className="wall"></div>}
                                          <Row>
                                            <Col span={20}>
                                              <p className="client">Biriktirilgan
                                                xodimlar</p>
                                            </Col>
                                            <Col span={4}>
                                              <p className="clients-count">{item.staffs.length}</p>
                                            </Col>
                                            <Col span={24}
                                                 className="accordions-client">
                                              <div className="bordered-accordion"/>
                                              <div className="bordered-accordion"/>
                                              <Collapse accordion>
                                                <Panel key="1">
                                                  {
                                                    item.staffs.map(item =>
                                                      <p className="mb-0">{item.firstName + ' ' + item.lastName}</p>
                                                    )
                                                  }
                                                </Panel>
                                              </Collapse>
                                            </Col>
                                          </Row>
                                          {item.startDate ? <div></div> : <div className="wall"></div>}
                                          <Row className="mt-3">
                                            <Col span={20}>
                                              <p className="client-two">Bo'limlar</p>
                                            </Col>
                                            <Col span={4}>
                                              <p className="clients-count">{item.resSubSteps.length}</p>
                                            </Col>
                                            <Col span={24}
                                                 className="accordions-client">
                                              <div className="bordered-accordion"/>
                                              <div className="bordered-accordion"/>
                                              <Collapse accordion
                                                        className="checkCircleOutlined">
                                                <Panel key="1">
                                                  {item.resSubSteps.map(item =>
                                                    <Row>
                                                      <Col span={20}>
                                                        <p className="mb-0">{item.name}</p>
                                                      </Col>
                                                      {item.completed === true ?
                                                        <Col onClick={() => completeSubStep(item.subStepId,false)}
                                                             span={2}
                                                             className="checked">
                                                          <CheckCircleOutlined/>
                                                        </Col>
                                                        :
                                                        <Col onClick={() => completeSubStep(item.subStepId,true)}
                                                             span={2}
                                                             className="unchecked">
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
                                            <Col span={12}>
                                              <p className="start-date">Boshlanish
                                                vaqti</p>
                                              <h6>{item.startDate === null ? 'Boshlanmagan' : item.startDate.substring(0, 10)}</h6>
                                            </Col>
                                            <Col span={12} className="pl-2">
                                              <p className="start-date">Tugash
                                                vaqti</p>
                                              <h6>{item.deadline.substring(0, 10)}</h6>
                                            </Col>
                                          </Row>
                                          <Row className="add-progress-project mt-2 pt-1">
                                            <Col span={20}>
                                              {item.attachmentId === null ?
                                                <Upload className="mt-2"
                                                        multiple={false}
                                                        name="attachmentId"
                                                        fileList={false}
                                                        customRequest={(options) => {
                                                          uploadFile(options, item.projectStepId)
                                                        }}
                                                >
                                                  <Button size="small">
                                                    <UploadOutlined
                                                    />Fayl yuklash
                                                  </Button>
                                                </Upload>
                                                :
                                                <div>
                                                  <a href={'/api/file/' + item.attachmentId}>Yuklab olish</a>
                                                  <span style={{"cursor":"pointer"}} onClick={() => deleteAttachment(item.attachmentId)}
                                                        className="ml-5"><DeleteOutlined/></span>
                                                  <p className="d-inline-block mb-0">{item.fileName}</p>
                                                </div>
                                              }
                                            </Col>
                                            <Col span={4}>
                                              <div
                                                className="project-persent">{Math.round((item.countCompletedSubSteps / item.resSubSteps.length) * 100)}%
                                              </div>
                                            </Col>
                                          </Row>
                                        </Card>

                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              :
                              <div>
                                {projectSteps.filter(item => item.stepByOrder === true).length > 0 ?
                                  <div>
                                    <h4>Bosqichlar navbat bilan</h4>
                                    <div className="main-right-div">
                                      {projectSteps.filter(item => item.stepByOrder === true).map((item, i) =>
                                        <div className="ml-2 mt-3">
                                          <div
                                            className={item.complete===true ? "project-green" : (item.startDate ? "project-yellow" : "project-disabled")}>
                                            <h5>{item.step.nameUz}<span>{"#" + (i + 1)}</span></h5>
                                          </div>

                                          <div className={item.startDate ? "projects mt-2" : "mt-2 disabled-project"}>
                                            <Card>
                                              {item.startDate ? <div></div> : <div className="wall"></div>}
                                              <Row>
                                                <Col span={20}>
                                                  <p className="client">Biriktirilgan
                                                    xodimlar</p>
                                                </Col>
                                                <Col span={4}>
                                                  <p className="clients-count">{item.staffs.length}</p>
                                                </Col>
                                                <Col span={24}
                                                     className="accordions-client">
                                                  <div className="bordered-accordion"/>
                                                  <div className="bordered-accordion"/>
                                                  <Collapse accordion>
                                                    <Panel key="1">
                                                      {
                                                        item.staffs.map(item =>
                                                          <p className="mb-0">{item.firstName + ' ' + item.lastName}</p>
                                                        )
                                                      }
                                                    </Panel>

                                                  </Collapse>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col span={20}>
                                                  <p className="client-two">Bo'limlar</p>
                                                </Col>
                                                <Col span={4}>
                                                  <p className="clients-count">{item.resSubSteps.length}</p>
                                                </Col>
                                                <Col span={24}
                                                     className="accordions-client">
                                                  <div className="bordered-accordion"/>
                                                  <div className="bordered-accordion"/>
                                                  <Collapse accordion
                                                            className="checkCircleOutlined">
                                                    <Panel key="1">
                                                      {item.resSubSteps.map(item =>
                                                        <Row>
                                                          <Col span={22}>
                                                            <p className="mb-0">{item.name}</p>
                                                          </Col>
                                                          {item.completed === true ?
                                                            <Col onClick={() => completeSubStep(item.subStepId,false)}
                                                                 span={2}
                                                                 className="checked">
                                                              <CheckCircleOutlined/>
                                                            </Col>
                                                            :
                                                            <Col onClick={() => completeSubStep(item.subStepId,true)}
                                                                 span={2}
                                                                 className="unchecked">
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
                                                <Col span={12}>
                                                  <p className="start-date">Boshlanish
                                                    vaqti</p>
                                                  <h6>{item.startDate === null ? 'Boshlanmagan' : item.startDate.substring(0, 10)}</h6>
                                                </Col>
                                                <Col span={12} className="pl-2">
                                                  <p className="start-date">Tugash
                                                    vaqti</p>
                                                  <h6>{item.deadline.substring(0, 10)}</h6>
                                                </Col>
                                              </Row>
                                              <Row className="add-progress-project mt-2 pt-1">
                                                <Col span={20}>
                                                  {item.attachmentId === null ?
                                                    <Upload className="mt-2"
                                                            multiple={false}
                                                            name="attachmentId"
                                                            fileList={false}
                                                            customRequest={(options) => {
                                                              uploadFile(options, item.projectStepId)
                                                            }}
                                                    >
                                                      <Button size="small">
                                                        <UploadOutlined
                                                        />Fayl yuklash
                                                      </Button>
                                                    </Upload>
                                                    :
                                                    <div>
                                                      <a href={'/api/file/' + item.attachmentId}>Yuklab olish</a>
                                                      <span style={{"cursor":"pointer"}} onClick={() => deleteAttachment(item.attachmentId)}
                                                            className="ml-5"><DeleteOutlined/></span>
                                                      <p className="d-inline-block mb-0">{item.fileName}</p>
                                                    </div>
                                                  }
                                                </Col>
                                                <Col span={4}>
                                                  <div
                                                    className="project-persent">{Math.round((item.countCompletedSubSteps / item.resSubSteps.length) * 100)}%
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Card>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div> : ''}
                                {projectSteps.filter(item => item.stepByOrder === false).length > 0 ?
                                  <div>
                                    <h4>Bosqichlar navbatsiz</h4>
                                    <div className="main-right-div">
                                      {projectSteps.filter(item => item.stepByOrder === false).map((item, i) =>
                                        <div className="ml-2 mt-3">
                                          <div
                                            className={item.complete===true ? "project-green" : (item.startDate ? "project-yellow" : "project-disabled")}>
                                            <h5>{item.step.nameUz}<span>{"#" + (i + 1)}</span></h5>
                                          </div>
                                          <div className={item.startDate ? "projects mt-2" : "mt-2 disabled-project"}>
                                            <Card>
                                              {item.startDate ? <div></div> : <div className="wall"></div>}
                                              <Row>
                                                <Col span={20}>
                                                  <p className="client">Biriktirilgan
                                                    xodimlar</p>
                                                </Col>
                                                <Col span={4}>
                                                  <p className="clients-count">{item.staffs.length}</p>
                                                </Col>
                                                <Col span={24}
                                                     className="accordions-client">
                                                  <div className="bordered-accordion"/>
                                                  <div className="bordered-accordion"/>
                                                  <Collapse accordion>
                                                    <Panel key="1">
                                                      {
                                                        item.staffs.map(item =>
                                                          <p className="mb-0">{item.firstName + ' ' + item.lastName}</p>
                                                        )
                                                      }
                                                    </Panel>

                                                  </Collapse>
                                                </Col>
                                              </Row>
                                              <Row className="mt-3">
                                                <Col span={20}>
                                                  <p className="client-two">Bo'limlar</p>
                                                </Col>
                                                <Col span={4}>
                                                  <p className="clients-count">{item.resSubSteps.length}</p>
                                                </Col>
                                                <Col span={24}
                                                     className="accordions-client">
                                                  <div className="bordered-accordion"/>
                                                  <div className="bordered-accordion"/>
                                                  <Collapse accordion
                                                            className="checkCircleOutlined">
                                                    <Panel key="1">
                                                      {item.resSubSteps.map(item =>
                                                        <Row>
                                                          <Col span={22}>
                                                            <p className="mb-0">{item.name}</p>
                                                          </Col>
                                                          {item.completed === true ?
                                                            <Col onClick={() => completeSubStep(item.subStepId,false)}
                                                                 span={2}
                                                                 className="checked">
                                                              <CheckCircleOutlined/>
                                                            </Col>
                                                            :
                                                            <Col onClick={() => completeSubStep(item.subStepId,true)}
                                                                 span={2}
                                                                 className="unchecked">
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
                                                <Col span={12}>
                                                  <p className="start-date">Boshlanish
                                                    vaqti</p>
                                                  <h6>{item.startDate === null ? 'Boshlanmagan' : item.startDate.substring(0, 10)}</h6>
                                                </Col>
                                                <Col span={12} className="pl-2">
                                                  <p className="start-date">Tugash
                                                    vaqti</p>
                                                  <h6>{item.deadline.substring(0, 10)}</h6>
                                                </Col>
                                              </Row>
                                              <Row className="add-progress-project mt-2 pt-1">
                                                <Col span={20}>
                                                  {item.attachmentId === null ?
                                                    <Upload className="mt-2"
                                                            multiple={false}
                                                            name="attachmentId"
                                                            fileList={false}
                                                            customRequest={(options) => {
                                                              uploadFile(options, item.projectStepId)
                                                            }}
                                                    >
                                                      <Button size="small">
                                                        <UploadOutlined
                                                        />Fayl yuklash
                                                      </Button>
                                                    </Upload>
                                                    :
                                                    <div>
                                                      <a href={'/api/file/' + item.attachmentId}>Yuklab olish</a>
                                                      <span style={{"cursor":"pointer"}} onClick={() => deleteAttachment(item.attachmentId)}
                                                            className="ml-5 badge badge-danger"><DeleteOutlined/></span>
                                                      <p className="d-inline-block mb-0">{item.fileName}</p>
                                                    </div>
                                                  }
                                                </Col>
                                                <Col span={4}>
                                                  <div
                                                    className="project-persent">{Math.round((item.countCompletedSubSteps / item.resSubSteps.length) * 100)}%
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Card>

                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div> : ''}
                              </div>
                          )
                          :
                          <div>
                            <Col span={24} className="default-right-item">
                              <Row>
                                {projectStepStatuses.map((item, i) =>
                                  <Col md={6} offset={1} className="default-project-col">
                                    <Card>
                                      <Row>
                                        <Col md={24}>
                                          <h6 className="project-name">{item.nameUz}</h6>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col md={2}>1</Col>
                                        <Col md={20}>Loyihalar</Col>
                                        <Col md={2}>{item.projectCount}</Col>
                                      </Row>
                                      <Row>
                                        <Col md={2}>2</Col>
                                        <Col md={20}>Jami Xodimlar</Col>
                                        <Col md={2}>{item.totalStaff}</Col>
                                      </Row>
                                      <Row>
                                        <Col md={2}>3</Col>
                                        <Col md={20}>Bajarilgan loyihalar</Col>
                                        <Col md={2}>{item.doneCount}</Col>
                                      </Row>
                                      <Row>
                                        <Col md={2}>4</Col>
                                        <Col md={20}>Ish jarayonidagi</Col>
                                        <Col md={2}>{item.inProgressCount}</Col>
                                      </Row>
                                    </Card>
                                  </Col>
                                )}
                              </Row>
                            </Col>
                          </div>
                        }
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </section>
        </Layout>


        <Modal
          title="Taskni ochish"
        >
          <p>Taskni ochishni xoxlaysizmi?</p>
        </Modal>

      </div>
    );
  }
}

Dashboard.propTypes = {};

export default Form.create()(Dashboard);
