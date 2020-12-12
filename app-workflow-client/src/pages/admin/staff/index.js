import React from 'react';
import {Button, Card, Form, Icon, Input, message, Modal, Popover,
  Select, Upload} from 'antd';

import Container from "react-bootstrap/Container";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import EyeOutlined from "@ant-design/icons/es/icons/EyeOutlined";
import {Option} from "react-select";
import './style.less'
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error(' Siz faqat JPG/PNG fayl yuklashingiz mumkin!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Rasm 2MB dan kam bo\'lish kerak!');
  }
  return isJpgOrPng && isLt2M;
}

@connect(({staff, app}) => ({staff, app}))
class Index extends React.PureComponent {
  componentWillMount() {
    const {dispatch, staff} = this.props;
    dispatch({type: 'app/getStaffs'});
    // dispatch({type: 'staff/getStaffSearch'});
    dispatch({type: 'app/getSpecialtys'});
    dispatch({
      type: "staff/updateState",
      payload: {
        imageUrl: staff.currentBr.photo ? ("/api/file/" + staff.currentBr.photo.id) : '',
      }
    })
  }

  render() {
    const {Option} = Select;
    const {Search} = Input;
    const {staff, dispatch, app} = this.props;
    const {staffs, specialtys} = app;
    const {currentBr, isOpen, reset, views, imageUrl, loading, photoId, staffSearch} = staff;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {confirm} = Modal;
    if (reset) {
      this.props.form.resetFields();
      dispatch({
        type: 'staff/updateState',
        payload: {reset: false}
      });
    }
    const deleteStaff = (staffId) => {
      confirm({
        title: 'O\'chirishni xohlaysizmi ?',
        onOk() {
          dispatch({
            type: 'staff/deleteStaff',
            payload: {id: staffId}
          })
        },
        onCancel() {
        },
      });
    };
    const openModal = (i) => {
      if (i) {
        const y = staffs.filter(j => i === j.id);
        dispatch({
          type: 'staff/updateState',
          payload: {currentBr: y[0], isOpen: true, imageUrl: "http://localhost/api/file/" + y[0].photoId}
        });
      } else {
        dispatch({
          type: 'staff/updateState',
          payload: {currentBr: '', isOpen: true}
        });
      }
    };
    const viewModal = i => {
      if (i) {
        const y = staffs.filter(j => i === j.id);
        dispatch({
          type: 'staff/updateState',
          payload: {currentBr: y[0], isOpen: true, imageUrl: "http://localhost/api/file/" + y[0].photoId, views: true}
        });
      } else {
        dispatch({
          type: 'staff/updateState',
          payload: {currentBr: '', isOpen: true, views: true}
        });
      }
    };
    const closeModal = () => {
      dispatch({
        type: 'staff/updateState',
        payload: {
          currentBr: '', isOpen: false,
          views: false
        }
      });
      this.props.form.resetFields()
    };
    const handleSub = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'staff/save',
            payload: {
              ...values,
            }
          })
          this.props.form.resetFields();
        }
      });
    };
    const handleChange = info => {
      if (info.file.status === 'uploading') {
        dispatch({
          type: "staff/updateState",
          payload: {
            loading: true,
          }
        });
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, imageUrl =>
          dispatch({
            type: "staff/updateState",
            payload: {
              imageUrl,
              loading: false,
            }
          })
        );
      }
    };
    const uploadFile = (options) => {
      dispatch({
        type: 'staff/uploadAvatar',
        payload: {
          options,
          fileUpload: true
        }
      })
    };
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Rasm yuklash</div>
      </div>
    );
    return (
      <div>
        <section className="templete staff-page">
          <Container>
            <Row className="mt-3">
              <Col md={5}>
                <Button onClick={() => openModal(false)} type="primary"
                        style={{backgroundColor: "#11E498", color: "white"}}>Qo'shish</Button>
              </Col>
              <Col md={4}/>
              <Col md={3}>
                <Search className="staff-search"
                  placeholder="Qidirish ..."
                  onSearch={val =>
                    dispatch({
                      type: 'staff/getStaffSearch',
                      payload: {
                        staffSearch: val.toLowerCase()
                      }
                    })
                  }
                  style={{width: 265}}
                />
              </Col>
            </Row>
            <Row className="mt-3 staff-cards">
              {console.log(staffs)}
              {staffSearch.length !== 0 ? staffSearch.map(item =>
                  <Col md={4} className="mt-2">
                    <Card>
                      <Row>
                        <Col md={3}>
                          <div className="user-img">
                            <img src={item.photoId ? "/api/file/" + item.photoId : "/assets/images/user.jpg"}
                                 alt=""/>
                          </div>
                        </Col>
                        <Col md={9}>
                          <Row className="staff-about">
                            <Col md={4}><p className="staff-fio">F.I.Sh:</p></Col>
                            <Col md={8}><p>{item.firstName + ' ' + item.lastName}</p></Col>
                          </Row>
                          <Row className="staff-about">
                            <Col md={4}><p className="staff-fio">Mutaxasisligi:</p></Col>
                            <Col md={8}><p>{item.specialtyNameUz}</p></Col>
                          </Row>
                          <Row className="staff-about">
                            <Col md={4}><p className="staff-fio">Tel raqami:</p></Col>
                            <Col md={8}><p>{item.phoneNumber}</p>
                              <Row className="mt-2 staff-icons">
                           <span className="project-icon">
        <div className="d-inline-block circle delete-circle" onClick={() => deleteStaff(item.id)}>
         <Popover title="Xodimni o'chirish">
           <Icon type="delete"/>
         </Popover>

          </div>
        <div className="d-inline-block circle ml-2" onClick={() => openModal(item.id)}>
          <Popover title="Xodim ma'lumotlarini o'zgartirish">
                     <Icon type="edit"/>
          </Popover>
          </div>
          <div className="d-inline-block circle icon-eyes ml-2" onClick={() => viewModal(item.id)}>
          <Popover title="Xodim ma'lumotlarini ko'rish">
                        <EyeOutlined/>
          </Popover>
           </div>
                     </span>
                              </Row>
                            </Col>
                          </Row>

                        </Col>
                      </Row>

                    </Card>
                  </Col>
              ) : staffs ? staffs.map(item =>
                  <Col md={4} className="mt-2">
                    <Card>
                      <Row>
                        <Col md={3} className="col-3">
                          <div className="user-img">
                            <img src={item.photoId ? "/api/file/" + item.photoId : "/assets/images/user.jpg"} alt=""/>
                          </div>
                        </Col>
                        <Col md={9} className="col-9">
                          <Row className="staff-about">
                            <Col md={4} className="col-4"><p className="staff-fio">F.I.Sh:</p></Col>
                            <Col md={8} className="col-8"><p>{item.firstName + ' ' + item.lastName}</p></Col>
                          </Row>
                          <Row className="staff-about">
                            <Col md={4} className="col-4"><p className="staff-fio">Mutaxasisligi:</p></Col>
                            <Col md={8} className="col-8"><p>{item.specialtyNameUz}</p></Col>
                          </Row>
                          <Row className="staff-about">
                            <Col md={4} className="col-4"><p className="staff-fio">Tel raqami:</p></Col>
                            <Col md={8} className="col-8"><p>{item.phoneNumber}</p>
                              <Row className="mt-2 staff-icons">
                           <span className="project-icon">
        <div className="d-inline-block circle delete-circle" onClick={() => deleteStaff(item.id)}>
         <Popover title="Xodimni o'chirish">
           <Icon type="delete"/>
         </Popover>

          </div>
        <div className="d-inline-block circle ml-2" onClick={() => openModal(item.id)}>
          <Popover title="Xodim ma'lumotlarini o'zgartirish">
                     <Icon type="edit"/>
          </Popover>
          </div>
          <div className="d-inline-block circle icon-eyes ml-2" onClick={() => viewModal(item.id)}>
          <Popover title="Xodim ma'lumotlarini ko'rish">
                        <EyeOutlined/>
          </Popover>
           </div>
                     </span>
                              </Row>
                            </Col>
                          </Row>

                        </Col>
                      </Row>

                    </Card>
                  </Col>
              ) : ''}
            </Row>
          </Container>
        </section>

        <div>
          <Modal width={800} title={views ? 'Xodim haqida ma`lumot' : "Xodim qo'shish"} footer={null} visible={isOpen}
                 onCancel={closeModal}>
            <Form layout="inline" onSubmit={handleSub} getFieldsValue>
              <Row className="">
                <Row>
                  <Col md={6}>
                    <Form.Item className="m-auto">
                      {getFieldDecorator('photoId', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.file,
                      })(
                        <Upload
                          name="photoId"
                          listType="picture-card"
                          disabled={views}
                          className="avatar-uploader"
                          showUploadList={false}
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          beforeUpload={beforeUpload}
                          onChange={handleChange}
                          customRequest={uploadFile}
                        >
                          {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>
                      )}

                    </Form.Item>
                  </Col>
                </Row>

                <Col md={3} className="mt-2">
                  <p className="label_span mb-0">Ismi</p>
                  <Form.Item>
                    {getFieldDecorator('firstName', {
                      initialValue: currentBr ? currentBr.firstName : '',
                      rules: [{required: true, message: "To'ldirilmadi!"}],
                    }, getFieldValue)(
                      <Input disabled={views} placeholder="Ism"/>
                    )}
                  </Form.Item>
                </Col>
                <Col md={3} className="mt-2">
                  <p className="label_span mb-0">Familiyasi</p>
                  <Form.Item>
                    {getFieldDecorator('lastName', {
                      initialValue: currentBr ? currentBr.lastName : '',
                      rules: [{required: true, message: "To'ldirilmadi!"}],
                    }, getFieldValue)(
                      <Input disabled={views} placeholder="Familiya"/>
                    )}
                  </Form.Item>
                </Col>
                <Col md={3} className="mt-2">
                  <p className="label_span mb-0">Sharifi</p>
                  <Form.Item>
                    {getFieldDecorator('middleName', {
                      initialValue: currentBr ? currentBr.middleName : '',
                      rules: [{required: true, message: "To'ldirilmadi!"}],
                    }, getFieldValue)(
                      <Input disabled={views} placeholder="Sharifi"/>
                    )}
                  </Form.Item>
                </Col>
                <Col md={3} className="mt-2">
                  <p className="label_span mb-0">Mutaxassisligi</p>
                  <Form.Item>
                    {getFieldDecorator('specialtyId', {
                      initialValue: currentBr['specialtyId'],
                      rules: [{required: true, message: "To'ldirilmadi"}],
                    })(
                      <Select style={{width: "180px"}}
                              placeholder="Mutaxassislik"
                              disabled={views}
                      >
                        {specialtys.map(i =>
                          <Option value={i.id} key={i.id}>{i.nameUz}</Option>
                        )}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

              </Row>
              <Row>
                <Col md={4} className="mt-2">
                  <p className="label_span mb-0">Manzil</p>
                  <Form.Item>
                    {getFieldDecorator('address', {
                      initialValue: currentBr ? currentBr.address : '',
                    }, getFieldValue)(
                      <Input disabled={views} placeholder="Manzil"/>
                    )}
                  </Form.Item>
                </Col>
                <Col md={4} className="mt-2">
                  <p className="label_span mb-0">Telefon raqami</p>
                  <Form.Item>
                    {getFieldDecorator('phoneNumber', {
                      initialValue: currentBr ? currentBr.phoneNumber : '',
                    }, getFieldValue)(
                      <Input disabled={views} placeholder="+998 ** *** ** **"/>
                    )}
                  </Form.Item>
                </Col>
                <Col md={4} className="mt-2">
                  <p className="label_span mb-0">Qo'shimcha</p>
                  <Form.Item>
                    {getFieldDecorator('description', {
                      initialValue: currentBr ? currentBr.description : '',
                    }, getFieldValue)(
                      <Input disabled={views} type="textarea" placeholder="Qo'shimcha"/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <div className="d-flex mt-3 pt-3 border-top">
                {views ? ''
                  : <Button htmlType="submit" type={"primary"} className='mx-3 ml-auto'
                            style={{backgroundColor: "#11E498", color: "white"}}>Saqlash</Button>
                }

              </div>
            </Form>
          </Modal>
        </div>

      </div>
    );
  }
}

Index = Form.create({})(Index);
Index.propTypes = {
  hideModal: PropTypes.func,
  handleSubmit: PropTypes.func,
};
export default Index;
