import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import { Spin, Row, Form, Input, Icon, Button, List, notification, Modal } from 'antd';
import config from '../../../../shared/core/config';
import sessionQuery from '../../../gql/queries/session.gql';
import loginMutation from '../../../gql/mutations/auth/login.gql';
import style from './login.styl';
import Logo from 'svg-react-loader?name=Logo!../../../assets/images/logo.svg';

const FormItem = Form.Item;

@graphql(sessionQuery)
@graphql(loginMutation, {
  options: {
    update(proxy, { data: { login } }) {
      const data = proxy.readQuery({
        query: sessionQuery,
      });
      // console.log(login)
      data.session = login;
      proxy.writeQuery({ query: sessionQuery, data });
    },
  },
})
@Form.create()
export default class Login extends Component {
  state = {
    loading: false,
    errors: [],
    confirmDirty: false,
  };

  openNotificationWhenFormErrors = () => {
    const { errors } = this.state;
    if (errors.length > 0) {
      const notifyDescriptions = errors.map((error, i) => {
        this.props.form.setFields({
          [error.field]: {
            value: this.props.form.getFieldValue(error.field),
            errors: [new Error(error.message)]
          }
        })
        return <div><span style={{ fontWeight: 'bold' }}>{error.field}</span><br />{error.message}</div>
      })
      notification.error({
        message: 'Signup Fail!!',
        description: <List
          size="small"
          bordered
          dataSource={notifyDescriptions}
          renderItem={item => (<List.Item>{item}</List.Item>)}
        />
      });
    }
  }

  trySubmit = async (e, formValues) => {
    e.preventDefault();
    this.setState({ loading: true })
    try {
      const { data: { login } } = await this.props.mutate({
        variables: formValues,
      });

      if (login.errors) {
        this.setState({ errors: login.errors });
        login.errors.map((error, i) => {
          this.props.form.setFields({
            [error.field]: {
              value: this.props.form.getFieldValue(error.field),
              errors: [new Error(error.message)]
            }
          })
        });
        throw new Error(JSON.stringify(login.errors));
      } else {
        if (!SERVER) {
          // window.localStorage.setItem(config.auth.storageName, login.jwt);
          document.cookie = `${config.auth.storageName}=${login.jwt}; path=/`;
        }
        this.props.form.resetFields();
        notification.success({
          message: 'Login Success',
          description: 'Welcome',
        });
        this.props.history.push('/');
        return;
      }
    } catch (err) {
      this.openNotificationWhenFormErrors();
      console.error('Login Fail: ', JSON.parse(err.message));
    }
    this.setState({ loading: false })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.trySubmit(e, values);
      } else {
        const errors = [];
        Object.entries(err).forEach(([key, value]) => errors.push(err[key].errors[0]));
        this.setState({ errors }, () => this.openNotificationWhenFormErrors());
      }
    });
  }


  render() {
    const { data } = this.props;
    if (data.loading) return <div>Loading...</div>;
    if (data.session.ok) return <Redirect to="/" />;

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <h1 style={{ textAlign: 'center' }}>
          <Logo className="logo-spin" />
          <span style={{ color: '#61DAFB' }}>Universal React Fiber</span>
        </h1>
        <Spin spinning={this.state.loading} >
          <Form onSubmit={this.handleSubmit} className={style.form}>
            <FormItem>
              {getFieldDecorator('identity', {
                rules: [{ required: true, message: 'Please input your identity!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username or E-Mail" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>

            <Row>
              <Button type="primary" htmlType="submit" icon="login" loading={this.state.loading}>
                Login
            </Button>
              <p>
                <span><Link to="/auth/forgot-password">Forgot password</Link> </span>
                <span><Link to="/signup">register now!</Link></span>
              </p>
            </Row>
          </Form>
        </Spin>
        <Row style={{ marginTop: 15, textAlign: 'center' }}>
          <Link to="/"><Button type="dashed" icon="home">Home</Button></Link>
        </Row>
      </div>
    );
  }
}
