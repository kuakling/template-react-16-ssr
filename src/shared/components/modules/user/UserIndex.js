import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import sessionQuery from '../../../gql/queries/session.gql';
import { Layout, Menu, Icon } from 'antd';

import style from './userIndex.styl';
import Home from './Home';
import Profile from './Profile';
import LayoutFooter from '../../blocks/LayoutFooter';
import LayoutBreadcrumbs from '../../blocks/LayoutBreadcrumbs';

const { Header, Content, Footer, Sider } = Layout;
export const TO_PREFIX = '/user';

@graphql(sessionQuery)
export default class AuthIndex extends Component {
  render() {
    const { loading, session } = this.props.data;
    if (loading) return (<div>Loading...</div>);
    if (!session.ok) return (<div>403 Forbidden</div>)
    return (
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className={style.logo} />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.location.pathname]} selectedKeys={[this.props.location.pathname]}>
            <Menu.Item key="/">
              <Link to="/">
                <Icon type="home" />
                <span className="nav-text">Home</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/user/profile">
              <Link to="/user/profile">
                <Icon type="profile" />
                <span className="nav-text">Profile</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/auth/logout">
              <Link to="/auth/logout">
                <Icon type="logout" />
                <span className="nav-text">Logout</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff' }}>
            <h2>User Module</h2>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <LayoutBreadcrumbs />
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route exact path={`${TO_PREFIX}`} component={Home} />
                <Route path={`${TO_PREFIX}/profile`} component={Profile} />
              </Switch>
            </div>
          </Content>
          <LayoutFooter />
        </Layout>
      </Layout>
    )
  }
}
