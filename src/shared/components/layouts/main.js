import React from 'react';
import { Layout, Icon } from 'antd';
import LayoutMenu from '../blocks/LayoutMenu';
import LayoutBreadcrumbs from '../blocks/LayoutBreadcrumbs';
import LayoutFooter from '../blocks/LayoutFooter';
import Logo from 'svg-react-loader?name=Logo!../../assets/images/logo.svg';
import style from './main.styl';

const { Header, Footer, Content } = Layout;

export default (props) => {
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
        { props.children }
      </Content>
      <LayoutFooter />
    </Layout>
  )
}
