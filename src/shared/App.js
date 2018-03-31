import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from "react-helmet"; 
import { Layout } from 'antd';

import './style.global.styl';

import Home from './components/Home';
import About from './components/About';
import Todos from './components/Todos';
import Message from './components/Message';
import Signup from './components/Signup';
import NotFound from './components/NotFound';

import AuthIndex from './components/modules/auth/AuthIndex';
import UserIndex from './components/modules/user/UserIndex';

import LayoutMenu from './components/blocks/LayoutMenu';

const { Header, Content, Footer, Sider } = Layout;
/**
 * The `App` component is the entry point for the react app.
 * It is rendered on the client as well as on the server.
 *
 * You can start developing your react app here.
 */
export default class App extends Component {

  render() {
    return (
      <Layout>

        <Helmet
          titleTemplate="%s | React 16 SSR "
          defaultTitle="My Default Title"
        />
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className="logo" />
          <LayoutMenu />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <h1 style={{marginLeft: 15, color: 'rgba(0,0,0,.65)'}}>Universal React Fiber</h1>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/about' component={About} />
                <Route path='/todos' component={Todos} />
                <Route path='/message' component={Message} />
                <Route path='/signup' component={Signup} />
                <Route path='/auth' component={AuthIndex} />
                <Route path='/user' component={UserIndex} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }

}
