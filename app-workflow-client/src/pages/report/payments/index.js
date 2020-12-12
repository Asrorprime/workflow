import React, {Component} from 'react';
import {Button, Card, Col, DatePicker, Row, Table} from "antd";
import {connect} from "react-redux";
// import download from "../../../utils/download";
import download from "utils/download";

@connect(({report}) => ({report}))
class Index extends Component {
  componentWillMount() {
    const {dispatch, report} = this.props;
    dispatch({
      type: 'report/getPaymentsReport',
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
    const {payments} = report;

    const getOutputRange = () => {
      if (startValue !== null && endValue !== null) {
        dispatch({
          type: 'report/getPaymentsReport',
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
        render: (text, record) => <a>{(payments.indexOf(record) + 1)}</a>
      },
      {
        title: 'Loyiha nomi',
        dataIndex: 'projectName',
      },
      {
        title: 'Xaridor',
        dataIndex: 'customerName',
      },
      {
        title: 'Summasi',
        dataIndex: 'projectPrice',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
      {
        title: 'To\'lagan summasi',
        dataIndex: 'sum',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
      {
        title: 'To\'lagan sanasi',
        dataIndex: 'date',
      },
    ];
    const print = () => {
      let w = window.open();
      w.document.write(document.getElementById('report-payments').innerHTML);
      w.print();
      w.close();
    };
    const downloadPayments = () => {
      dispatch({
        type: 'report/downloadPayments',
        payload: download.makeForm(columns)
      })
    };
    return (
      <div className="report">
        <Row className='mt-3'>
          <Col md={8} className=''>
            <Card className='CardLarder-report'>
              <Row>
                <Col span={24}>
                    <h5 style={{cursor: "pointer"}} className='laderText mb-0'>To'lovlar </h5>
                </Col>
              </Row>
              <Row className="pt-2 laderAllSumText-row">
                <Col span={20}>
                  <h6 className='mb-0 laderAllSumText'>To'lovlar umumiy summasi</h6>
                </Col>
              </Row>
              <Row>
                <Col span={20} className='mt-2'>
                  <h6
                    className='mb-0 laderAll'>{(new Intl.NumberFormat('fr-FR', {currency: 'USD'}).format(payments.reduce((prev, cur) => prev + cur.sum, 0)))}<span> UZS</span>
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
        <Row className="mt-2">
          <Col>
            <h4 className="text-center about-report-responsive">
              Umumiy to'lovlar <br/> ro'yxati
            </h4>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={24}>
            <Table className="payments-table-responsive" columns={columns} dataSource={payments}/>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={4} offset={20}>
            <div className="text-center">
              <Button type="primary" className="print" onClick={print}>Print</Button>
            </div>
          </Col>
        </Row>

        <div id="report-payments" style={{display: 'none'}}>
          <Row className="mt-2">
            <Col>
              <h4 style={{textAlign: "center"}}>
                To'lovlar umumiy
                <br/>
                ro'yxati
              </h4>
            </Col>
          </Row>
          <table border="1" style={{borderCollapse: 'collapse', width: '100%'}}>
            <thead>
            <tr style={{backgroundColor: "#FAFAFA"}}>
              <th>TR</th>
              <th>Loyiha nomi</th>
              <th>Xaridor</th>
              <th>Summasi</th>
              <th>To'lagan summasi</th>
              <th>To'lagan sanasi</th>
            </tr>
            </thead>
            <tbody>
            {payments.map((item, i) => <tr style={{textAlign: "center"}} key={i}>
              <td>{i + 1}</td>
              <td>{item.projectName}</td>
              <td>{item.customerName}</td>
              <td>{item.projectPrice}</td>
              <td>{item.sum}</td>
              <td>{item.date}</td>
            </tr>)}
            <tr style={{textAlign: "center"}}>
              <td></td>
              <td>Jami: </td>
              <td></td>
              <td>{payments.reduce((prev, cur) => prev + cur.projectPrice, 0)}</td>
              <td>{payments.reduce((prev, cur) => prev + cur.sum, 0)}</td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

export default Index;
