import withRouter from 'umi/withRouter'
import App from './app'
import {Col, Layout, Menu, Row} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import "./index.less";
import Default from "../pages/kpi"

const {Content, Footer, Sider} = Layout;

export default withRouter((props) => {

  const pathname = props.location.pathname;
  let pageId = 1;
  let defaultPage = false;
  let adminPage = false;
  let reportPage = false;
  if (pathname.includes("/admin")) {
    adminPage = true;
    if (pathname.includes("staff")) {
      pageId = 1
    }
    if (pathname.includes("users")) {
      pageId = 2
    }
    if (pathname.includes("specialty")) {
      pageId = 3
    }
    if (pathname.includes("customers")) {
      pageId = 4
    }
    if (pathname.includes("payType")) {
      pageId = 5
    }
    if (pathname.includes("payment")) {
      pageId = 6
    }
    if (pathname.includes("step")) {
      pageId = 7
    }
  } else if (pathname.includes("/report")) {
    reportPage = true;

    if (pathname.includes("debtClients")) {
      pageId = 1
    }
    if (pathname.includes("payments")) {
      pageId = 2
    }
    if (pathname.includes("inProgressProjects")) {
      pageId = 3
    }
    if (pathname.includes("completedProjects")) {
      pageId = 4
    }
    if (pathname.includes("archivedProjects")) {
      pageId = 5
    }
    if (pathname.includes("onTimeCompletedProjects")) {
      pageId = 6
    }
    if (pathname.includes("notCompletedProjects")) {
      pageId = 7
    }
  } else if(pathname.includes("/kpi")){
    defaultPage = true;
}
  return (
    <App>
      {reportPage ?
        <Layout className="report">
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
            }}
            onCollapse={(collapsed, type) => {
            }}
          >
            <div className="logo "/>
            <Menu theme="dark" className="sidebar-scroll " mode="inline"
                  defaultSelectedKeys={["" + pageId]} style={{
              backgroundColor: "#E6EAED",
              width: "260px"
            }}>
              <Menu.Item className="product-style" key="1">
                <Link to="/report/debtClients">
                  <span className="nav-text">Qarzdor mijozlar</span>
                </Link>
              </Menu.Item>
              <Menu.Item className="product-style" key="2">
                <Link to="/report/payments">
                  <span className="nav-text">To'lovlar umumiy ro'yxati</span>
                </Link>
              </Menu.Item>
              <Menu.Item className="product-style" key="3">
                <Link to="/report/inProgressProjects">
                  <span className="nav-text">Ish jarayonidagi loyihalar ro'yxati</span>
                </Link>
              </Menu.Item>
              <Menu.Item className="product-style" key="4">
                <Link to="/report/completedProjects">
                  <span className="nav-text">Yakunlangan loyihalar ro'yxati</span>
                </Link>
              </Menu.Item>
              <Menu.Item className="product-style" key="5">
                <Link to="/report/archivedProjects">
                  <span className="nav-text">Arxivlangan loyihalar ro'yxati</span>
                </Link>
              </Menu.Item>
              <Menu.Item className="product-style" key="6">
                <Link to="/report/onTimeCompletedProjects">
                  <span className="nav-text">O'z vaqtida yakunlangan loyihalar</span>
                </Link>
              </Menu.Item>
              <Menu.Item className="product-style" key="7">
                <Link to="/report/notCompletedProjects">
                  <span className="nav-text">O'z vaqtida yakunlanmagan loyihalar</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{margin: '24px 16px 0'}}>
              <div className="ant-layout-content">
                <section>
                  <Row className="mt-3">
                    <Col span={20} className="offset-1">
                      {props.children}
                    </Col>
                  </Row>
                </section>
              </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Workflow</Footer>
          </Layout>
        </Layout> :
        <div>
          {adminPage ?
            <Layout>
            <Sider
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={broken => {
              }}
              onCollapse={(collapsed, type) => {
              }}
            >
              <div className="logo"/>
              <Menu theme="dark" className="sidebar-scroll navigation-user-edit" mode="inline" defaultSelectedKeys={["" + pageId]}>
                <Menu.Item key="1">
                  <Link to="/admin/staff">
                    <span className="nav-text">Xodim</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/admin/specialty">
                    <span className="nav-text">Mutaxassislik</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/admin/customers">
                    <span className="nav-text">Xaridorlar</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/admin/payType">
                    <span className="nav-text">To'lov turlari</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link to="/admin/payment">
                    <span className="nav-text">To`lov</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="6">
                  <Link to="/admin/step">
                    <span className="nav-text">Bosqich</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Content style={{margin: '24px 16px 0'}}>
                <div className="ant-layout-content">
                  <section>
                    <Row className="mt-3">
                      <Col span={24}>
                        {props.children}
                      </Col>
                    </Row>
                  </section>

                </div>
              </Content>
              <Footer style={{textAlign: 'center'}}>Workflow</Footer>
            </Layout>
          </Layout> : props.children}
          {pathname === "/" ? <Default/> : ''}
        </div>}


    </App>
  )
})

