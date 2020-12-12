import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.less';
import {Col, Input, Row} from 'antd'
import PropTypes from "prop-types";
import {connect} from "react-redux";


@connect(({app, order}) => ({app, order}))
class LeftSideList extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'order/getUnCompletedProjects'
    })
  }

  render() {
    const {dispatch, getProjectSteps, app, order} = this.props;
    const {unCompletedProjects} = order;
    const {Search} = Input;
    return (
      <div className="orderMain">
        <div className="orderHeader px-3 py-2 bg-white">
          <div className="orderName  mr-2">
            Loyihalar
          </div>
        </div>
        <div className="orderListMain bg-white">
          {/*<form className='mt-1'>
            <div className="d-flex mainSearch justify-content-between">
              <div className="input-group-append">
                <button className="input-group-text srch_btn"/>
              </div>
              <input type="text" className="search" id="exampleEmail"
                     placeholder="qidirish "/>

            </div>
          </form>*/}
          <Search
            placeholder="qidirish ..."
            onSearch={value =>
              dispatch({
                type: 'order/getProjectSearchName',
                payload: {
                  name: value
                }
              })
            }
            // style={{width: 200}}
          />
          <Col span={24}>
            {unCompletedProjects.map((list, i) =>
              list.projectStatus === 'COMPLETED' ?
                <Row onClick={() => getProjectSteps(list, i)} key={i}
                     className="orderList pt-1 px-3 border-bottom mb-1">
                  <Col span={2} className="model">
                    {list.applicationNumber}
                  </Col>
                  <Col span={18} className="brand">
                    {list.name}
                  </Col>
                  <Col span={4} className="brandProduct d-inline">
                    <div className="persent-project-completed">
                      <item className="project-persent">
                        {(((list.resProjectSteps.filter(item => item.complete === true).length) / (list.resProjectSteps.length)) * 100) === 0 ? 0 :
                          Math.floor(((list.resProjectSteps.filter(item => item.complete === true).length) / (list.resProjectSteps.length)) * 100)
                        }%
                      </item>
                    </div>
                  </Col>
                </Row>
                :
                list.projectStatus === 'IN_PROGRESS' ?
                <Row onClick={() => getProjectSteps(list, i)} key={i}
                     className="orderList pt-1 px-3 border-bottom mb-1"
                     style={{cursor: "pointer"}}>
                  <Col span={2} className="model">
                    {list.applicationNumber}
                  </Col>
                  <Col span={18} className="brand">
                    {list.name}
                  </Col>
                  <Col span={4} className="brandProduct d-inline">
                    <div className="persent-project-div">
                      <item className="project-persent">
                        {(((list.resProjectSteps.filter(item => item.complete === true).length) / (list.resProjectSteps.length)) * 100) === 0 ? 0 :
                          Math.floor(((list.resProjectSteps.filter(item => item.complete === true).length) / (list.resProjectSteps.length)) * 100)
                        }%
                      </item>
                    </div>
                  </Col>
                </Row>
                  : ''
            )}
          </Col>
        </div>
      </div>

    );
  }
}

LeftSideList.propTypes = {
  getProjectSteps: PropTypes.func

};

export default LeftSideList;
