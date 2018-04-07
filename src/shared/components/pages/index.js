import React, { Fragment } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Layout, Breadcrumb, Icon } from 'antd';
import LayoutMenu from '../blocks/LayoutMenu';
import LayoutBreadcrumbs from '../blocks/LayoutBreadcrumbs';
import LayoutFooter from '../blocks/LayoutFooter';
import Logo from 'svg-react-loader?name=Logo!../../assets/images/logo.svg';
import style from './index.styl';

const { Header, Footer, Content } = Layout;

import Home from './Home';
import About from './About';
import Todos from './Todos';
import Message from './Message';
import Signup from './Signup';
import NotFound from './NotFound';

export default () => {
  return (
    <Layout className="layout">
      <Header>
        <div className={style.logo}>
          <Logo className="logo-spin" /> Universal React Fiber
        </div>
        <LayoutMenu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
        />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <LayoutBreadcrumbs />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/about' component={About} />
          <Route path='/todos' component={Todos} />
          <Route path='/message' component={Message} />
          <Route path='/signup' component={Signup} />
          <Route component={NotFound} />
        </Switch>
      </Content>
      <LayoutFooter />
    </Layout>
  )
}
