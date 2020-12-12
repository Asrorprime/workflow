/* global window */
/* global document */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import {connect} from 'dva'
import {Layout} from 'antd'
import {config} from 'utils'
import {Helmet} from 'react-helmet'
import {withRouter} from 'dva/router'
import '../themes/index.less'
import 'bootstrap/dist/css/bootstrap.min.css';
import MyHeader from "../components/MyHeader/MyHeader"

const {Content} = Layout;
const {prefix, openPages} = config;
let lastHref;

const App = ({children, dispatch, app, loading, location}) => {
    const {
        user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions, currentUser
    } = app;
    let {pathname} = location;
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const {iconFontJS, iconFontCSS, logo} = config;
    const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname));
    const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false;
    const {href} = window.location;

    if (lastHref !== href) {
        NProgress.start();
        if (!loading.global) {
            NProgress.done();
            lastHref = href
        }
    }

    const headerProps = {
        menu,
        user,
        location,
        siderFold,
        isNavbar,
        menuPopoverVisible,
        navOpenKeys,
        switchMenuPopover() {
            dispatch({type: 'app/switchMenuPopver'})
        },
        changeOpenKeys(openKeys) {
            dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: openKeys}})
        },
    };

    const siderProps = {
        menu,
        location,
        user,
        siderFold,
        darkTheme,
        navOpenKeys,
        changeTheme() {
            dispatch({type: 'app/switchTheme'})
        },
        changeOpenKeys(openKeys) {
            window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys));
            dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: openKeys}})
        },
    };

    const breadProps = {
        menu,
        location,
    };


    if (openPages && openPages.includes(pathname)) {
        return (<div>
            <Layout>
                <Content>{children}</Content>
                {/*<Footer className="text-center p-3">Footer</Footer>*/}
            </Layout>
        </div>)
    }

    return (
        <div>

            <Helmet>
                <title>Workflow </title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="icon" href={logo} type="image/x-icon"/>
                {iconFontJS && <script src={iconFontJS}/>}
                {iconFontCSS && <link rel="stylesheet" href={iconFontCSS}/>}
            </Helmet>
            <Layout>


                <MyHeader/>

                <Content>{children}</Content>
                {/*<Footer className="text-center p-3">Footer</Footer>*/}
            </Layout>
        </div>
    )
};

App.propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
    loading: PropTypes.object,
};

export default withRouter(connect(({app, loading}) => ({app, loading}))(App))
