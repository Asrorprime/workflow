import React, {Component} from 'react';
import './style.less'
import {Col, Container, Row} from "react-bootstrap";
import {Badge, Button, DatePicker, Icon, Tabs} from 'antd';
import {Sticky, StickyContainer} from 'react-sticky';
import {connect} from "dva";
import download from "utils/download";
import router from "umi/router";

const {TabPane} = Tabs;
const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({style}) => (
      <DefaultTabBar {...props} style={{...style, zIndex: 1, background: '#fff'}}/>
    )}
  </Sticky>
);

@connect(({kpi, app}) => ({kpi, app}))
class Index extends Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  componentWillMount() {
    const {dispatch, app} = this.props;
    const {getProjects} = app;
    dispatch({
      type: 'app/getStaffs',
    });
    dispatch({
      type: 'kpi/getProjectsByStaff',
      payload: {
        staffId: this.props.match.params.id,
        page: 0,
        size: 10
      }
    });
  }

  disabledStartDate = startValue => {
    const {endValue} = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const {startValue} = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({endOpen: true});
    }
  };

  handleEndOpenChange = open => {
    this.setState({endOpen: open});
  };

  render() {
    const {kpi, dispatch, app} = this.props;
    const {afterDeadLineProjects, beforeDeadLineProjects, inProgressProjects} = kpi;

    /*function startDate(date, dateString) {
    }

    function endDate(date, dateString) {
    }*/

    const getOutputRange = () => {
      if (startValue !== null && endValue !== null) {
        dispatch({
          type: 'kpi/getProjectsByStaff',
          payload: {
            staffId: this.props.match.params.id,
            dan: download.convertToTimestamp(this.state.startValue._d, true),
            gacha: download.convertToTimestamp(this.state.endValue._d, false)
          }
        })
      }
    }
    const goOrqa = () => {
      dispatch({
        type: 'kpi/updateState',
        payload: {staffSearch: []}
      });
      router.push("/kpi")
    };
    const {startValue, endValue, endOpen} = this.state;

    return (
      <div className="kpi-id">
        <Container>
          <Row className="pt-5">
            <Col md={3}>
              {/*<DatePicker onChange={startDate} placeholder="Boshlanish sanasi"/>*/}
              <DatePicker
                disabledDate={this.disabledStartDate}
                format="YYYY-MM-DD"
                value={startValue}
                placeholder="Start"
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
              />
              <span className="ml-4"> dan</span>
            </Col>
            <Col md={3} className="kpi-end-date">
              {/*<DatePicker onChange={endDate} placeholder="Tugagan sanasi"/>*/}
              <DatePicker
                disabledDate={this.disabledEndDate}
                format="YYYY-MM-DD"
                value={endValue}
                placeholder="End"
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />
              <span className="ml-2"> gacha</span>
            </Col>
            <Col md={2} className="col-6 btn-next-prev">
              <Button type="primary" onClick={getOutputRange}>
                <Icon type="search"/>Hisobot</Button>
            </Col>
            <Col md={2} className="col-6 btn-next-prev">
              <Button type="danger" onClick={goOrqa}>Orqaga</Button>
            </Col>
          </Row>

          <Row className="pt-5">
            <Col md={12}>
              <Badge className="badge-one" count={inProgressProjects.length}><a href="#"
                                                                                className="head-example"/></Badge>
              <Badge className="badge-two" count={afterDeadLineProjects.length}><a href="#"
                                                                                   className="head-example"/></Badge>
              <Badge className="badge-three" count={beforeDeadLineProjects.length}><a href="#"
                                                                                      className="head-example"/></Badge>
              <StickyContainer>
                <Tabs defaultActiveKey="1" renderTabBar={renderTabBar}>
                  <TabPane tab="Ish Jarayonida bo'lgan loyihalar" key="1">
                    <Row className="pt-3 ml-3">
                      <p className="time-close">Ish Jarayonida bo'lgan loyihalar</p>
                      <Col md={12} className="pt-3">
                        <Row className="table-kpi">
                          <Col md={4} className="col-4"><h5>Loyiha nomi</h5></Col>
                          <Col md={4} className="col-4"><h5>Boshlangan vaqti</h5></Col>
                          <Col md={4} className="col-4"><h5>Tugash vaqti</h5></Col>
                        </Row>
                        {inProgressProjects.map((item, i) => (
                          <Row className="table-kpi-hover" key={i.id}>
                            <Col md={4} className="col-4"><h6>{item.name}</h6></Col>
                            <Col md={4} className="col-4">
                              <h6>{item.startDate == null ? "Boshlanmagan" : item.startDate}</h6></Col>
                            <Col md={4} className="col-4">
                              <h6>{item.endDate == null ? "Tugallanmagan" : item.endDate}</h6></Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="O'z vaqtida yakunlanmagan loyihalar" key="2">
                    <Row className="pt-3 ml-3">
                      <p className="time-close">O'z vaqtida yakunlanmagan loyihalar</p>
                      <Col md={12} className="pt-3">
                        <Row className="table-kpi">
                          <Col md={4} className="col-4"><h5>Loyiha nomi</h5></Col>
                          <Col md={4} className="col-4"><h5>Boshlangan vaqti</h5></Col>
                          <Col md={4} className="col-4"><h5>Tugash vaqti</h5></Col>
                        </Row>
                        {afterDeadLineProjects.map((item) => (
                          <Row className="table-kpi-hover">
                            <Col md={4} className="col-4"><h6>{item.name}</h6></Col>
                            <Col md={4} className="col-4">
                              <h6>{item.startDate == null ? "Boshlanmagan" : item.startDate}</h6></Col>
                            <Col md={4} className="col-4">
                              <h6>{item.endDate == null ? "Tugallanmagan" : item.endDate}</h6></Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="O'z vaqtida yakunlagan loyihalar" key="3">
                    <Row className="pt-3 ml-3">
                      <p className="time-close">O'z vaqtida yakunlagan loyihalar</p>
                      <Col md={12} className="pt-3">
                        <Row className="table-kpi">
                          <Col md={4} className="col-4"><h5>Loyiha nomi</h5></Col>
                          <Col md={4} className="col-4"><h5>Boshlangan vaqti</h5></Col>
                          <Col md={4} className="col-4"><h5>Tugash vaqti</h5></Col>
                        </Row>
                        {beforeDeadLineProjects.map((item) => (
                          <Row className="table-kpi-hover">
                            <Col md={4} className="col-4"><h6>{item.name}</h6></Col>
                            <Col md={4} className="col-4">
                              <h6>{item.startDate == null ? "Boshlanmagan " : item.startDate}</h6></Col>
                            <Col md={4} className="col-4">
                              <h6>{item.endDate == null ? "Tugallanmagan" : item.endDate}</h6></Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </StickyContainer>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
