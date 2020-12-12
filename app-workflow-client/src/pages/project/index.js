import React from 'react';
import {Button, Col, Icon, Input, Modal, Popover, Row, Select, Table} from 'antd';
import "./style.less";
import Container from "react-bootstrap/Container";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import PlayCircleOutlined from "@ant-design/icons/lib/icons/PlayCircleOutlined";
import EyeOutlined from "@ant-design/icons/es/icons/EyeOutlined";
import router from "umi/router";
import BookOutlined from "@ant-design/icons/lib/icons/BookOutlined";
import IssuesCloseOutlined from "@ant-design/icons/lib/icons/IssuesCloseOutlined";


@connect(({app, project}) => ({app, project}))
class Index extends React.PureComponent {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'project/getProjects'
    })
  }

  render() {
    const {dispatch, app, project} = this.props;
    const {confirm} = Modal;
    const {projects, projectsSearch} = project;
    const {Search} = Input;
    const columns = [
      {
        title: 'TR',
        dataIndex: 'TR',
        key: 'TR',
      },
      {
        title: 'Loyiha raqami',
        dataIndex: 'applicationNumber',
        key: 'applicationNumber',
      },
      {
        title: 'Nomi',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Summasi',
        dataIndex: 'price',
        key: 'price',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
      {
        title: 'Xaridor',
        dataIndex: 'customer',
        key: 'customer',
      },
      {
        title: 'Xaridor statusi',
        dataIndex: 'customerStatus',
        key: 'customerStatus',
        render: (text, record) => record.customerStatus ? <span>{record.customerStatus}</span> :
          <span>Mavjud emas</span>
      },
      {
        title: 'Bosqichlar soni',
        dataIndex: 'level',
        key: 'level',
      },
      {
        title: 'Boshlangan vaqti',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: 'Tugash vaqti',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: 'Holati',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Amallar',
        dataIndex: 'Action',
        key: 'Action',
      },
    ];
    const data = projects.map((item, i) => {
      return {
        key: {i},
        TR: i + 1,
        applicationNumber: item.applicationNumber,
        name: item.name,
        price: item.price,
        customer: item.customer.fullName,
        customerStatus: item.customerStatus,
        level: item.resProjectSteps.length,
        startDate: item.startDate === null ? "Boshlanmagan" : item.startDate.substring(0, 10),
        endDate: item.deadline.substring(0, 10),
        status: item.status,
        Action:
          <span className="project-icon">
                  <div className="d-inline-block circle icon-eyes ml-2" onClick={() => route(item.projectId)}>
                <Popover title="Loyihani ko'rish">
                    <EyeOutlined/>
                  </Popover>
              </div>


            {item.projectStatus === 'CLOSED' ?
              <div onClick={() => toArchive(item.projectId, false)}
                   style={{"color": "white", "background-color": "#FFD913"}} className="d-inline-block circle ml-2">
                <Popover title="Loyihani arxivdan ochish">
                  <IssuesCloseOutlined/>
                </Popover>
              </div>
              : ''
            }
            {item.projectStatus === 'COMPLETED' ?
              <div onClick={() => toArchive(item.projectId, true)} className="d-inline-block circle icon-plus ml-2">
                <Popover title="Loyihani arxivlash">
                  <BookOutlined/>
                </Popover>

              </div>
              : ''
            }
            {item.projectStatus === 'NEW' ?
              <div className="d-inline-block circle ml-2" onClick={() => startProject(item.projectId)}>
                <Popover title="Loyihani jarayonga o'tkazish">
                  <PlayCircleOutlined/>

                </Popover>
              </div>
              : ''
            }
            {item.projectStatus === 'NEW' ?
              <div className="d-inline-block ml-2 circle delete-circle" onClick={() => deleteProject(item.projectId)}>
                <Popover title="Loyihani o'chirish">
                  <Icon type="delete"/>

                </Popover>
              </div>
              : ''
            }
            </span>
      }
    });
    const data1 = projectsSearch.map((item, i) => {
      return {
        key: {i},
        TR: i + 1,
        applicationNumber: item.applicationNumber,
        name: item.name,
        price: item.price,
        customer: item.customer.fullName,
        customerStatus: item.customerStatus,
        level: item.resProjectSteps.length,
        startDate: item.startDate === null ? "Boshlanmagan" : item.startDate.substring(0, 10),
        endDate: item.deadline.substring(0, 10),
        status: item.status,
        Action:
          <span className="project-icon">

              <div className="d-inline-block circle icon-eyes ml-2" onClick={() => route(item.projectId)}>
                <EyeOutlined/>
              </div>
            {item.projectStatus === 'CLOSED' ?
              <div onClick={() => toArchive(item.projectId, false)}
                   style={{"color": "white", "background-color": "#FFD913"}} className="d-inline-block circle ml-2">
                <IssuesCloseOutlined/>
              </div>
              : ''
            }
            {item.projectStatus === 'COMPLETED' ?
              <div onClick={() => toArchive(item.projectId, true)} className="d-inline-block circle icon-plus ml-2">
                <BookOutlined/>
              </div>
              : ''
            }
            {item.projectStatus === 'NEW' ?
              <div className="d-inline-block circle ml-2" onClick={() => startProject(item.projectId)}>
                <PlayCircleOutlined/></div>
              : ''
            }
            {item.projectStatus === 'NEW' ?
              <div className="d-inline-block ml-2 circle delete-circle" onClick={() => deleteProject(item.projectId)}>
                <Icon type="delete"/></div>
              : ''
            }
            </span>
      }
    });
    const cancelProject = (projectId) => {
      confirm({
        title: 'Loyihani bekor qilishni xoxlaysizmi!',
        onOk() {
          dispatch({
            type: 'project/cancelProject',
            payload: {
              path: projectId
            }
          })
        },
        onCancel() {

        }
      });
      dispatch({
        type: 'app/updateState',
        payload: {
          modalShow: true
        }
      })
    };
    const deleteProject = (projectId) => {
      confirm({
        title: 'Loyihani o\'chirishni xoxlaysizmi!',
        onOk() {
          dispatch({
            type: 'project/deleteProject',
            payload: {
              id: projectId
            }
          })
        },
        onCancel() {

        }
      });
      dispatch({
        type: 'app/updateState',
        payload: {
          modalShow: true
        }
      })
    };
    const startProject = (projectId) => {
      confirm({
        title: 'Loyihani jarayonga o\'tkazmoqchimisiz!',
        onOk() {
          dispatch({
            type: 'project/startProject',
            payload: {
              path: projectId
            }
          })
        },
        onCancel() {

        }
      });
      dispatch({
        type: 'app/updateState',
        payload: {
          modalShow: true
        }
      })
    };
    const toArchive = (projectId, status) => {
      confirm({
        title: status ? 'Eslatma! Loyihani arxivga joylash uchun loyiha uchun to\'lov to\'liq bo\'lishi kerak! \n Loyihani arxivlashga rozimisiz?'
          : 'Loyihani arxivdan ochishga rozimisiz?'
        ,
        onOk() {
          dispatch({
            type: 'project/toArchive',
            payload: {
              projectId: projectId,
              status: status
            }
          })
        },
        onCancel() {

        }
      });
      dispatch({
        type: 'app/updateState',
        payload: {
          modalShow: true
        }
      })
    };
    const {Option} = Select;
    const route = (id) => {
      router.push('project/' + id);
    };

    const getEvents = (e, v) => {
      dispatch({
        type: 'project/updateState',
      });
      dispatch({
        type: 'project/getProjects',
        payload: {
          status: e,
        }
      });

    };
    return (
      <div>
        <section className="project-section">
          <Container>
            <Row className="mt-5">
              <Col md={4} className="mt-2">
                <Button type="primary" style={{backgroundColor: "#11E498", color: "white"}}>
                  <Link to="project/add">
                    Qo'shish
                  </Link>
                </Button>
              </Col>
              <Col md={4} className="mt-2">
                <Select
                  className="product"
                  showSearch
                  placeholder="Status"
                  defaultValue="all"
                  name="status"
                  onChange={getEvents}
                  style={{width: "150px"}}
                >
                  <Option value="all">Barchasi</Option>
                  <Option value="NEW">Yangi</Option>
                  <Option value="IN_PROGRESS">Jarayonda</Option>
                  <Option value="COMPLETED">Yakunlangan</Option>
                  <Option value="CLOSED">Arxiv</Option>
                </Select>
              </Col>
              <Col md={4} className="mt-2">
                <Search
                  placeholder="Loyiha nomi bo'yicha qidirish..."
                  onSearch={value =>
                    dispatch({
                      type: 'project/getProjectSearchName',
                      payload: {
                        name: value
                      }
                    })
                  }
                  style={{width: 250}}
                />
              </Col>
            </Row>
            <Row className="mt-3 table-project">
              <Col span={24}>
                <Table columns={columns} dataSource={projectsSearch.length === 0 ? data : data1}/>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }
}

export default Index;
