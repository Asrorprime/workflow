import React, {Component} from 'react';
import {connect} from "dva";
import {Button, DatePicker, Form, Icon, Input, message, Upload} from 'antd';
import {goBack} from "umi/src/router";
import PropTypes from "prop-types";
import './index.less';
import moment from "moment";

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

@connect(({user, app}) => ({user, app}))
class Index extends Component {
  componentWillMount() {
    const {dispatch, app} = this.props;
    dispatch({
      type: "user/updateState",
      payload: {
        imageUrl: app.currentUser.photo ? ("/api/file/" + app.currentUser.photo.id) : '',
      }
    })
  }

  render() {
    const {dispatch, app, user} = this.props;
    const {imageUrl, loading} = user;
    const {getFieldDecorator, getFieldValue} = this.props.form;

    const handleChange = info => {
      if (info.file.status === 'uploading') {
        dispatch({
          type: "user/updateState",
          payload: {
            loading: true,
          }
        });
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, imageUrl =>
          dispatch({
            type: "user/updateState",
            payload: {
              imageUrl,
              loading: false,
            }
          })
        );
      }
    };
    const handleSub = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'user/save',
            payload: {
              ...values,
            }
          })
        }
      });
    };
    const uploadFile = (options) => {
      dispatch({
        type: 'user/uploadAvatar',
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
      <div className="container user_edit">
        <div className="row">
          <div className="col-md-2"/>
          <div className="col-md-8">
            <h3 className="header-title2 mt-4 text-center">Foydalanuvchi ma’lumotlari</h3>
            <div className="card">
              <div className="card-body p-sm-3 p-md-0 p-lg-5 p-0">
                <Form layout="inline" onSubmit={handleSub} getFieldsValue>
                  <div className="d-flex align-items-center justify-content-center">
                    <Form.Item className="m-auto">
                      {getFieldDecorator('photoId', {
                        valuePropName: 'fileList',
                        getValueFromEvent: this.file,
                      })(
                        <Upload
                          name="photoId"
                          listType="picture-card"
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
                  </div>
                  <div className="d-flex justify-content-around">
                    <div className="d-flex flex-column">
                      <span className="label_span">Ism</span>
                      <Form.Item>
                        {getFieldDecorator('firstName', {
                          initialValue: app.currentUser.firstName ? app.currentUser.firstName : '',
                          rules: [{required: true, message: 'ism kiritilmadi!'}],
                        }, getFieldValue)(
                          <Input placeholder="John"/>
                        )}
                      </Form.Item>
                    </div>
                    <div className="d-flex flex-column">
                      <span className="label_span">Familiya</span>
                      <Form.Item>
                        {getFieldDecorator('lastName', {
                          initialValue: app.currentUser.lastName ? app.currentUser.lastName : '',
                          rules: [{required: true, message: 'ism kiritilmadi!'}],
                        }, getFieldValue)(
                          <Input placeholder="Doe"/>
                        )}
                      </Form.Item>
                    </div>
                  </div>
                  <div className="d-flex justify-content-around">
                    <div className="d-flex flex-column">
                      <span className="label_span">Telefon raqam</span>
                      <Form.Item>
                        {getFieldDecorator('phoneNumber', {
                          initialValue: app.currentUser.phoneNumber ? app.currentUser.phoneNumber : '',
                          rules: [{required: true, message: 'ism kiritilmadi!'}],
                        }, getFieldValue)(
                          <Input placeholder="+998 *** ** **"/>
                        )}
                      </Form.Item>
                    </div>
                    <div className="d-flex flex-column">
                      <span className="label_span">Tug'ilgan Sana</span>
                      {getFieldDecorator('birthDate', {
                        initialValue: moment(app.currentUser.birthDate ? app.currentUser.birthDate.substring(0.10) : '1990/12/31'),
                        rules: [{required: true, message: "To'ldirilmadi!"}],
                      }, getFieldValue)(
                        <DatePicker format='DD/MM/YYYY'/>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <Button type="button" outline className="mr-4" onClick={goBack}>Bekor qilish</Button>
                    <Button htmlType="submit" type={"primary"} className='mr-3'>Saqlash</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
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
