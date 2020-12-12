import React, {Component} from 'react';
import {Button, Card, Col, DatePicker, Icon, Row, Table} from "antd";
import {connect} from "react-redux";
import router from "umi/router";
import download from "utils/download";

@connect(({report}) => ({report}))
class Index extends Component {
  componentWillMount() {
    const {dispatch, report} = this.props;
    dispatch({
      type: 'report/getArchivedProjects',
    });
  }

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

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
    const {dispatch, report} = this.props;
    const {archivedProjects} = report;
    const getDifferenceDate = (project) => {
      let a = project.startDate.substring(0, 10);
      let b = project.endDate.substring(0, 10);
      let date1 = a.split('.');
      let date2 = b.split('.');
      let endTime = date1[1] + '.' + date1[0] + '.' + date1[2];
      let startTime = date2[1] + '.' + date2[0] + '.' + date2[2];
      return Math.abs((new Date(endTime).getTime() - new Date(startTime).getTime())/(86400000));
    };

    const getOutputRange = () => {
      if (startValue !== null && endValue !== null) {
        dispatch({
          type: 'report/getArchivedProjects',
          payload: {
            staffId: this.props.match.params.id,
            dan: download.convertToTimestamp(this.state.startValue._d, true),
            gacha: download.convertToTimestamp(this.state.endValue._d, false)
          }
        })
      }
    }

    const {startValue, endValue, endOpen} = this.state;

    const columns = [
      {
        title: 'TR',
        dataIndex: 'id',
        render: (text, record) => <a>{(archivedProjects.indexOf(record) + 1)}</a>
      },
      {
        title: 'Loyiha nomi',
        dataIndex: 'name',
      },
      {
        title: 'Summasi',
        dataIndex: 'price',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
      {
        title: 'Olingan sanasi',
        dataIndex: 'startDate',
      },
      {
        title: 'Yakunlangan sanasi',
        dataIndex: 'endDate',
      },
      {
        title: 'Tugatilish sanasi',
        dataIndex: 'deadline',
        render: text => <span style={{"color":"red"}}>{text}</span>,
      },
      {
        title: 'Yakunlanishi uchun ketgan kun',
        key: 'projectId',
        render: text => <span>{getDifferenceDate(text)} kun</span>,
      },
    ];
    const print = () => {
      let w = window.open();
      w.document.write(document.getElementById('report-archivedProjects').innerHTML);
      w.print();
      w.close();
    };
    let sum = archivedProjects.reduce((prev, cur) => prev + cur.price, 0)
    return (
      <div className="report">
        <Row className='mt-3'>
          <Col md={8} className=''>
            <Card className='CardLarder-report'>
              <Row>
                <Col span={24}>
                  <h5 style={{cursor: "pointer"}} className='laderText mb-0'>Arxivlangan loyihalar </h5>
                </Col>
              </Row>
              <Row className="pt-2 laderAllSumText-row">
                <Col span={20}>
                  <h6 className='mb-0 laderAllSumText'>Arxivlangan loyihalar umumiy summasi</h6>
                </Col>
              </Row>
              <Row>
                <Col span={20} className='mt-2'>
                  <h6
                    className='mb-0 laderAll'>{(new Intl.NumberFormat('fr-FR', {currency: 'USD'}).format(sum))}<span> UZS</span>
                  </h6>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={1}/>
          <Col span={15}>
            <Row span={24} className="pt-3">
              <Col span={9}>
                {/*<DatePicker onChange={startDate} placeholder="Boshlanish sanasi"/>*/}
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  format="YYYY-MM-DD"
                  value={startValue}
                  placeholder="Start"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
                <span className=""> dan</span>
              </Col>
              <Col span={9} className="kpi-end-date">
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
                <span className=""> gacha</span>
              </Col>
              <Col span={4} className="btn-next-prev">
                <Button type="primary" onClick={getOutputRange} className="ml-2">
                  Hisobot</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col span={12}/>
        </Row>

        <Row className="mt-2">
          <Col>
            <h4 className="text-center about-report-responsive">
              Arxivlangan loyihalar <br/> ro'yxati
            </h4>
          </Col>
        </Row>
        <Row className="mt-3 ">
          <Col span={24}>
            <Table className="completedProject-responsive" columns={columns} dataSource={archivedProjects}/>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col span={8} offset={16}>
            <div className="text-center">
              <Button type="primary" className="ml-5 print" onClick={print}>Print</Button>
            </div>
          </Col>
        </Row>
        <div id="report-archivedProjects" style={{display: 'none'}}>
          <Row className="mt-2">
            <Col>
              <h4 style={{textAlign: "center"}}>
                Arxivlangan loyihalar
                <br/>
                RO'YXATI
              </h4>
            </Col>
          </Row>
          <table border="1" style={{borderCollapse: 'collapse', width: '100%'}}>
            <thead>
            <tr style={{backgroundColor: "#FAFAFA"}}>
              <th>TR</th>
              <th>Loyiha nomi</th>
              <th>Summasi</th>
              <th>Olingan sanasi</th>
              <th>Yakunlangan sanasi</th>
              <th>Tugatilish sanasi</th>
              <th>Boshlanish va tugash orasidagi vaqt</th>
            </tr>
            </thead>
            <tbody>
            {archivedProjects.map((item, i) =>
              <tr style={{textAlign: "center"}} key={i}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td>{item.deadline}</td>
              <td>{getDifferenceDate(item)}</td>
            </tr>)}
            <tr style={{textAlign: "center"}}>
              <td></td>
              <td>Jami:</td>
              <td>{archivedProjects.reduce((prev, cur) => prev + cur.price, 0)}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    )
      ;
  }
}

export default Index;
