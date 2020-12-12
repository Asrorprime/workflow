import React, {Component} from 'react';
import {Card, Col, Row} from "antd";
import router from "umi/router";
import './style.less'
class Index extends Component {
  render() {
    return (
      <div className="not-found-page">
        <h1>Bunday sahifa topilmadi</h1>
            <div className="back-home">
              <Card className="border-0"
                    onClick={function () {
                      router.push("/kpi")
                    }}
              >Bosh sahifa</Card>
            </div>
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
