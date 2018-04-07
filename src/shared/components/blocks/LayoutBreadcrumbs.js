import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Breadcrumb } from 'antd';

@withRouter
export default class LayoutBreadcrumbs extends Component {

  genBreadcrumb = () => {
    const { pathname } = this.props.location;
    const linkPath = [];
    return pathname.split('/').map( (item, index) => {
      linkPath.push(item);
      const linkString = linkPath.join('/');
      const label = index === 0 ? 'Home' : item.charAt(0).toUpperCase() + item.substr(1);
      return (
        <Breadcrumb.Item key={linkString}>
          <Link to={linkString}>{ label }</Link>
        </Breadcrumb.Item>
      )
    })
  }

  render() {
    return (
      <Breadcrumb style={{ margin: '16px 0' }}>
        { this.props.location.pathname !== '/' ? this.genBreadcrumb() : '' }
      </Breadcrumb>
    )
  }
}

