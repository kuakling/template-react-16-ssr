import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Card, Form, Input, Checkbox, Button, Modal, message, notification } from 'antd';
import { graphql } from 'react-apollo';
import sessionQuery from '../gql/queries/session.gql';
import signUpMutation from '../gql/mutations/user/signup.gql';
const FormItem = Form.Item;

@graphql(sessionQuery)
@graphql(signUpMutation)
@Form.create()
export default class SignUp extends React.Component {
  state = {
    loading: false,
    errors: [],
    confirmDirty: false,
  };

  redirectToConfirm = (uri, notiKey) => {
    this.props.history.push(uri);
    notification.close(notiKey)
  }

  openNotification = (token) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" onClick={() => this.redirectToConfirm(`/auth/confirm/${token}`, key)}>
        Click here to confirm account
      </Button>
    );
    const args = {
      message: 'Please confirm account before login',
      description: `${process.env.REACT_APP_WEB_URL}/${process.env.REACT_APP_BASE_URL}/auth/confirm/${token}`,
      duration: 0,
      btn,
      key,
    };
    notification.warning(args);
  };

  trySubmit = async (e, formValues) => {
    e.preventDefault();
    this.setState({ loading: true })
    try {
      const { data: { signup } } = await this.props.mutate({
        variables: formValues,
      });
      
      if (signup.errors) {
        this.setState({ 
          errors: signup.errors, 
          loading: false 
        });
        throw new Error('Form Input error');
      }else{
        this.props.form.resetFields();
        message.success('Update success');
        this.openNotification(signup.user.confirmationToken)
        // this.props.history.push('/');
      }
    } catch (err) {
      Modal.error({
        title: 'Signup error',
        // content: err.message,
        content: this.state.errors.map(e => err.message).join("\n")
      });
      this.setState({ loading: false })
      // Some kind of error was returned -- display it in the console
      // eslint-disable-next-line no-console
      console.error('GraphQL error: ', this.state.errors.map(e => err.message).join("\n"));
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
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { data } = this.props;
    if(data.loading) return <div>Loading...</div>;
    if(data.session.ok) return <Redirect to="/" />;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
      <div className={`inside-center-middle signup-component`}>
        <h1>Sign Up</h1>
        <Card style={{ width: 500 }}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="Username"
              hasFeedback
            >
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: 'Please input your Username!',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="E-mail"
              hasFeedback
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: 'Please input your E-mail!',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Password"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Please input your password!',
                }, {
                  validator: this.checkConfirm,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Confirm Password"
              hasFeedback
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: this.checkPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked',
              })(
                <Checkbox>I have read the <a href="">agreement</a></Checkbox>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Register</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}