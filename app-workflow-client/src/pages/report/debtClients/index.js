import React, {Component} from 'react';
import {Button, Card, Col, Input, Row, Table} from "antd";
import "../index.less";
import {connect} from "react-redux";
import download from "utils/download";
import './style.less'

@connect(({report}) => ({report}))
class Index extends Component {
  componentWillMount() {
    const {dispatch, report} = this.props;
    dispatch({
      type: 'report/getDebtClients',
    });
    dispatch({
      type: 'report/getDebtClientSearch',
    });
  }


  render() {
    const {Search} = Input;
    const {dispatch, report} = this.props;
    const {debtClients, debtClientsSearch} = report;

    const columns = [
      {
        title: 'TR',
        dataIndex: 'id',
        render: (text, record) => <a>{(debtClientsSearch.indexOf(record) + 1)}</a>
      },
      {
        title: 'Xaridor',
        dataIndex: 'customer.fullName',
      },
      {
        title: 'Nomi',
        dataIndex: 'name',

      },
      {
        title: 'Summasi',
        dataIndex: 'price',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
      {
        title: "To'langan summasi",
        dataIndex: 'paidSum',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
      {
        title: 'Qarzi',
        dataIndex: 'leftOver',
        render: text => <span>{(new Intl.NumberFormat('fr-FR', {currency: 'UZS'}).format(text))}</span>
      },
    ];
    const print = () => {
      let w = window.open();
      w.document.write(document.getElementById('report-debtClients').innerHTML);
      w.print();
      w.close();
    };
    const downloadDebtClients = () => {
      dispatch({
        type: 'report/downloadDebtClients',
        payload: download.makeForm(columns)
      })
    };
    let a = debtClients.reduce((prev, cur) => prev + cur.leftOver, 0)
    return (
      <div className="report">
        <Row className='mt-3'>
          <Col md={8} className=''>
            <Card className='CardLarder-report'>
              <Row>
                <Col md={24}>
                  <h5 className='laderText mb-0'>Qarzdor Mijozlar</h5>
                </Col>
              </Row>
              <Row className="pt-2 laderAllSumText-row">
                <Col md={20}>
                  <h6 className='mb-0 laderAllSumText'>Qarzdor mijozlar umumiy summasi</h6>
                </Col>
              </Row>
              <Row>
                <Col md={20} className='mt-2'>
                  <h6 className='mb-0 laderAll'>{(new Intl.NumberFormat('fr-FR', {currency: 'USD'}).format(a))}
                    <span> UZS</span>
                  </h6>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <h4 className="text-center about-report-responsive">
              Qarzdor mijozlar <br/> ro'yxati
            </h4>
          </Col>
        </Row>
        <Row>
          <Col span={17}/>
          <Col span={7}>
            <Search
              placeholder="Xaridor va Nomi bo'yicha qidirish..."
              onSearch={value =>
                dispatch({
                  type: 'report/getDebtClientSearch',
                  payload: {
                    searchName: value.toLowerCase()
                  }
                })}
              // style={{width: 200}}
            />
          </Col>
        </Row>
        <Row className="mt-3 ">
          <Col span={24}>
            <Table className="debClients-table" columns={columns} dataSource={debtClientsSearch.length == 0 ? debtClients : debtClientsSearch}/>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col span={4} offset={20}>
            <div className="text-center">
              <Button type="primary" className="print" onClick={print}>Print</Button>
            </div>
          </Col>
        </Row>
        <div id="report-debtClients" style={{display: 'none'}}>
          <Row className="mt-2">
            <Col>
              <h4  style={{textAlign: "center"}}>
                Qarzdor mijozlar
                <br/>
                RO'YXATI
              </h4>
            </Col>
          </Row>
          <table className="debClients-table" border="1" style={{borderCollapse: 'collapse', width: '100%'}}>
            <thead>
            <tr style={{backgroundColor: "#FAFAFA"}}>
              <th>TR</th>
              <th>Xaridor</th>
              <th>Nomi</th>
              <th>Summasi</th>
              <th>To'lagan summasi</th>
              <th>Qarzi</th>
            </tr>
            </thead>
            <tbody>
            {debtClients.map((item, i) => <tr style={{textAlign: "center"}} key={i}>
              <td>{i + 1}</td>
              <td>{item.customerName}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.paidSum}</td>
              <td>{item.leftOver}</td>
            </tr>)}
            <tr style={{textAlign: "center"}}>
              <td/>
              <td>Jami:</td>
              <td/>
              <td>{debtClients.reduce((prev, cur) => prev + cur.price, 0)}</td>
              <td>{debtClients.reduce((prev, cur) => prev + cur.paidSum, 0)}</td>
              <td>{debtClients.reduce((prev, cur) => prev + cur.leftOver, 0)}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

export default Index;
