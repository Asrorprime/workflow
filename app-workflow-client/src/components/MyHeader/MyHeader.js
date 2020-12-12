import React, {Component} from 'react'
import {Button, Col, Dropdown, Icon, Menu, Row} from 'antd'
import './index.less';
import {connect} from "dva";
import {router} from 'umi'
import {Link} from "react-router-dom";


@connect(({app}) => ({app}))
class MyHeader extends Component {


  render() {
    const logout = (e) => {
      localStorage.removeItem('workflow-token');
      router.push('/kpi')
    };
    const menu = (
      <Menu className="navigation-catalog-edit" style={{width: "180px", marginTop: "15px"}}>
        <Menu.Item key="1">
          <Link to="/dashboard">
            Dashboard
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/project">
            Loyihalar
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/order">
            Jarayon
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/kpi">
            Xodimlar
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/payment">
            To'lovlar
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/report">
            Hisobotlar
          </Link>
        </Menu.Item>
      </Menu>
    );
    const menu2 = (<Menu className="navigation-user-edit" style={{marginTop: "8px"}}>
      <Menu.Item key="1">
        <Link to="/user/edit">
          Sozlamalar
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/user/editPassword">
          Parolni o'zgartirish
        </Link>
      </Menu.Item>
      <Menu.Item onClick={(e) => logout(e)}>
        Chiqish
      </Menu.Item>
    </Menu>);
    const {app} = this.props;
    const {currentUser, pathname} = app;

    return (
      <header className="bg-white navbar-menu">
        <div className="container">
          <Row>

            <Col md={6}>
             <span style={{cursor: "pointer"}}>
               <Link to="/">
               <img className="logo" src="/assets/images/logo-workflow.png" alt=""/>
               </Link>
               </span>
            </Col>
            {currentUser ?
              <Col md={18}>
                <Row>
                  <Col md={5} className="menus-responsive">
                    <div className="menus">
                      <Dropdown overlay={menu}>
                        <div><Button type="primary"
                                     size="small">{pathname === "/dashboard" ? "D"
                          : pathname === "/order" ? "J" : pathname === "/kpi" ? "X"
                            : pathname === "/payment" ? "T" : pathname === "/project" ? "L"
                              : pathname.includes("/report") ? "H"
                                : "K"}</Button> {pathname === "/dashboard" ? " Dashboard"
                          : pathname === "/order" ? " Jarayon" :
                            pathname === "/project" ? "Loyihalar" :
                              pathname === "/kpi" ? "Xodimlar" :
                                pathname === "/payment" ? "To'lovlar" :
                                  pathname.includes("/report") ? "Hisobotlar" : "Katalog"}
                          <Icon type="down"/></div>
                      </Dropdown>
                    </div>

                  </Col>
                  <Col md={4} offset={1} className="text-catalog-edit-responsive">
                    <div className="text-catalog-edit">
                      <Link to="/admin/staff">
                        Katalog
                      </Link>
                    </div>
                  </Col>
                  <Col md={6} offset={8} style={{cursor: 'pointer'}} className="user-info pt-2">
                    <Dropdown overlay={menu2} trigger={['click']}>
                      <div>
                        <div className="d-flex align-items-center h-100">
                          <div className="">
                            <img style={{
                              objectFit: 'cover',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              marginRight: '.5rem',
                            }}
                                 src={currentUser ? currentUser.photo ? "/api/file/" + currentUser.photo.id : "/images/home_page/user.jpg" : ""}
                                 alt=""/>
                          </div>
                          <div className="">
                            <p className="mb-0"
                               style={{display: 'inline-block'}}>{currentUser ? currentUser.firstName + " " + currentUser.lastName : ""}</p>
                            <p className="mb-0"
                               style={{fontSize: "12px"}}>{currentUser ? currentUser.roles && currentUser.roles.map(item =>
                              item.name === 'ROLE_DIRECTOR' ? "Direktor" :
                                item.name === 'ROLE_ADMIN' ? "Administrator" :
                                  item.name === 'ROLE_COORDINATOR' ? "Boshqaruvchi" : ''
                            ) : ""}</p>
                          </div>
                        </div>
                      </div>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>

              :
              <Col span={4} offset={14} style={{cursor: "pointer"}}>
                <h6 className="login-kpi-menu"
                    onClick={function () {
                      router.push("/login")
                    }} style={{marginTop: "15px"}}
                >Kirish</h6>
              </Col>
            }

          </Row>
        </div>
      </header>
    )
  }
}

MyHeader.propTypes = {}

export default MyHeader
