import React from 'react'
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select} from 'antd'
import "./style.less"
import {connect} from "react-redux";
import moment from 'moment';
import CurrencyInput from "react-currency-input";

const {Option} = Select;
let arr = [];
let selectedItems = [false];

@connect(({project, app}) => ({project, app}))
class Index extends React.Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'app/getSteps'
    });
    dispatch({
      type: 'app/getCustomers'
    });
    dispatch({
      type: 'app/getStaffs'
    });
  }


  render() {
    const {dispatch, project, app, form} = this.props;
    const {projectSteps, projectByOrder, deadlineDate} = project;
    const {getFieldDecorator, getFieldValue} = form;
    const {steps, customers, staffs} = app;
    const openModal = () => {
      dispatch({
        type: 'project/openModal',
      })
    };
    const getImage = (v) => {
      dispatch({
        type: 'project/getFile',
        payload: {
          path: v
        }
      })
    };
    const uploadFile = (options) => {
      dispatch({
        type: 'project/uploadFile',
        payload: {
          options,
          fileUpload: true
        }
      })
    };

    const save = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, form) => {
        if (!err) {
          let reqProjectSteps = [];
          let a = Object.keys(form);
          for (let i = 0; i < a.length; i++) {
            if (a[i].includes("step/")) {
              let ii = a[i].split('/')[1];
              let reqProjectStep = {
                stepId: form['step/' + ii],
                deadline: form['deadline/' + ii],
                staffsId: form['staffsId/' + ii],
                stepByOrder: form['stepByOrder/' + ii]
              };
              let subSteps = [];
              for (let j = 0; j < a.length; j++) {
                if (a[j].includes('name/' + ii)) {
                  let jj = a[j].split('/')[2];
                  subSteps.push({name: form['name/' + ii + '/' + jj]});
                }
              }
              reqProjectStep.subSteps = subSteps;
              reqProjectSteps.push(reqProjectStep);
            }
          }
          let data = {...form, reqProjectSteps};
          dispatch({
            type: 'project/addProject',
            payload: {
              ...data,
              price: form['price'].replace(/ /g, '')
            }
          })
        }
      });
    };
    const allProjectByOrder = (e, v) => {
      dispatch({
        type: 'project/updateState',
        payload: {
          projectByOrder: e.target.checked
        }
      });
    };
    const addProjectStep = () => {
      let stepsList = projectSteps;
      stepsList.push({index: stepsList [stepsList.length - 1].index + 1, subSteps: [0]});
      dispatch({
        type: 'project/updateState',
        payload: {
          projectSteps: stepsList
        }
      });
    };
    const selectStep = (e, v) => {
      dispatch({
        type: 'project/updateState',
        payload: {
          selectedItem: true
        }
      });
    };
    const handleDatePickerChange = (date) => {
      dispatch({
        type: 'project/updateState',
        payload: {
          deadlineDate: date
        }
      })
    };
    const selectStep2 = (index, value) => {
      arr.splice(index, 1, value);
      selectedItems.splice(index, 1, true);
    };
    const addSubStep = (step) => {
      let stepsList = projectSteps;
      const s = stepsList.filter(i => i.index === step.index)[0];
      s.subSteps.push(s.subSteps[s.subSteps.length - 1] + 1);
      dispatch({
        type: 'project/updateState',
        payload: {
          projectSteps: stepsList.map(i => i.index === s.index ? s : i)
        }
      });
    };


    function disabledDate(current) {
      return current && current <= moment().endOf('day').subtract(1, 'days');
    }

    function deadDate(current) {
      return (moment(deadlineDate).add(1, 'days') < current || current < moment().endOf('day').subtract(1, 'days'));
    }

    return (
      <div className="project-add">
        <div className="container">
          <Form onSubmit={save}>
            <Card className="project-add-card mt-5">
              <Row>
                <h3 className="mb-3 mt-1">Loyiha</h3>
              </Row>
              <Row>
                <Col md={6} className="mr-2">
                  <Form.Item>
                    {getFieldDecorator('name', {
                      rules: [{required: true, message: 'Loyiha nomi kiritilmadi!'}],
                    }, getFieldValue)(
                      <Input placeholder="Loyiha nomi" type="text"/>
                    )}
                  </Form.Item>
                </Col>
                <Col md={4} className="mr-2">
                  <Form.Item>
                    {getFieldDecorator('price', {
                      rules: [{required: true, message: 'Loyiha summasi kiritilmadi!'}],
                    }, getFieldValue)(
                      <CurrencyInput thousandSeparator=" " precision="0" className="currency-input"/>
                      // <CurrencyInput thousandSeparator=" " precision="0" className="currency-input" />
                    )}
                  </Form.Item>
                </Col>
                <Col md={4} className="mr-2 customer-select" style={{marginLeft: "24px"}}>
                  <Form.Item>
                    {getFieldDecorator('customerId', {
                      rules: [{required: true, message: 'Bosqichni tanlang'}],
                    })(
                      <Select
                        className="product"
                        showSearch
                        placeholder="Xaridor"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                        {customers.map((item, i) =>
                          <Option value={item.id}>{item.fullName}</Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <Form.Item>
                    {getFieldDecorator('deadline', {
                      rules: [{required: true, message: 'Tugash vaqti kiritilmadi!'}],
                    }, getFieldValue)(
                      <DatePicker
                        disabledDate={disabledDate}
                        onChange={(date) => handleDatePickerChange(date)}
                        format="YYYY-MM-DD"
                        placeholder="tugash vaqti"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col md={4} className="pl-3">
                  <Form.Item>
                    {getFieldDecorator('byOrder', {
                      valuePropName: 'checked'
                    }, getFieldValue)(<Checkbox onChange={allProjectByOrder}>Loyiha tartibli</Checkbox>)}
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {projectSteps.map((s, j) =>
              <div className="project-step">
                <Row>
                  <Col md={5}>
                    <Row>
                      <Col span={4} className="mt-1 steps">
                        <div className="font-weight-bold">{j + 1}-</div>
                      </Col>
                      <Col span={20}>
                        <Form.Item>
                          {getFieldDecorator('step/' + j, {
                            rules: [{required: true, message: 'Bosqichni tanlang'}],
                          })(
                            <Select
                              className="product"
                              showSearch
                              onSelect={selectStep}
                              placeholder="Bosqichni tanlang"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }>
                              {steps.map((item, i) =>
                                <Option onClick={() => selectStep2(s.index, item.nameUz)}
                                        value={item.id}>{item.nameUz}</Option>
                              )}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>


                </Row>
                {selectedItems[s.index] ?
                  <div>
                    <Row>
                      <Col md={6}>
                        <Form.Item>
                          {getFieldDecorator('staffsId/' + j, {
                            rules: [{required: true, message: 'Xodimlarni tanlang'}],
                          }, getFieldValue)(
                            <Select
                              mode="multiple"
                              style={{width: '100%'}}
                              placeholder="Xodimlar"
                            >
                              {staffs && staffs.map(i => <Select.Option key={i.id} className="Option"
                                                                        value={i.id}>{i.firstName}
                              </Select.Option>)}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col md={4}>
                        <Form.Item className="ml-2">
                          {getFieldDecorator('deadline/' + j, {
                            rules: [{required: true, message: 'Tugash vaqti kiritilmadi!'}],
                          }, getFieldValue)(
                            <DatePicker
                              disabledDate={deadDate}
                              format="YYYY-MM-DD"
                              placeholder="tugash vaqti"
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col md={4}>
                        <Form.Item className="ml-2">
                          {getFieldDecorator('stepByOrder/' + j, {
                            valuePropName: 'checked'
                          }, getFieldValue)(<Checkbox style={{display: !projectByOrder ? "" : 'none'}}>Bosqich tartib
                            bilan</Checkbox>)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row className="task-name">
                      {s.subSteps.map((item, k) =>
                        <Col md={6} className="mr-2">
                          <Form.Item>
                            {getFieldDecorator('name/' + j + '/' + k, {
                              rules: [{required: true, message: 'Vazifalar!'}],
                            }, getFieldValue)(
                              <Input placeholder="Vazifa nomi" type="text"/>
                            )}
                          </Form.Item>
                        </Col>
                      )}
                      <Col md={2}>
                        <Button type="default" icon="plus" className="mt-1 ml-4"
                                onClick={() => addSubStep(s)}
                                style={{backgroundColor: "#11E498", color: "white"}}/>
                      </Col>
                    </Row>
                  </div>

                  : ''
                }
              </div>)}
            {selectedItems[selectedItems.length - 1] ?
              <Row>
                <Col span={8} className="mt-3">
                  <Button onClick={addProjectStep}
                          className="add-button" type="default">Bosqich qo'shish</Button>
                </Col>
              </Row> : ''
            }
            <Row className="mt-3 mb-3">
              <Col span={6} offset={18}>
                <Button htmlType="submit"
                        style={{backgroundColor: "#11E498", color: "white", float: "right"}}>Saqlash</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}

Index = Form.create({})(Index);
export default Index;
