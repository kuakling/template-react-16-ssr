import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import { Card, Form, Input, Icon, Button, Modal, message } from 'antd';
import config from '../../../../shared/core/config';
import sessionQuery from '../../../gql/queries/session.gql';
import loginMutation from '../../../gql/mutations/auth/login.gql';

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

  trySubmit = async (e, formValues) => {
    e.preventDefault();
    this.setState({ loading: true })
    try {
      const { data: { login } } = await this.props.mutate({
        variables: formValues,
      });
      
      if (login.errors) {
        this.setState({ 
          errors: login.errors, 
          loading: false 
        });
        throw new Error('Form Input error');
      }else{
        if (!SERVER) {
          // window.localStorage.setItem(config.auth.storageName, login.jwt);
          document.cookie = `${config.auth.storageName}=${login.jwt}; path=/`;
        }
        this.props.form.resetFields();
        message.success('Login success');
        this.props.history.push('/');
        return;
      }
    } catch (err) {
      Modal.error({
        title: 'Error',
        // content: err.message,
        content: this.state.errors.map(e => e.message).join("\n")
      });
      this.setState({ loading: false })
      // Some kind of error was returned -- display it in the console
      // eslint-disable-next-line no-console
      console.error('GraphQL error: ', this.state.errors.map(e => e.message).join("\n"));
    }
    this.setState({ loading: false })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.trySubmit(e, values);
      }
    });
  }
  

  render() {
    const { data } = this.props;
    if(data.loading) return <div>Loading...</div>;
    if(data.session.ok) return <Redirect to="/" />;
    
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={`login-component inside-center-middle`}>
        <h1>Sign In</h1>
        <Card style={{ width: 300 }}>
          <Form onSubmit={this.handleSubmit} className="login-form">
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
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                Sign in
              </Button>
              <Link to="/auth/forgot-password">Forgot password</Link>
              Or <Link to="/signup">register now!</Link>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}
