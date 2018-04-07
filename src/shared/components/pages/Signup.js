import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Helmet } from "react-helmet";
import { Spin, Card, Icon, Form, Input, Checkbox, Button, List, notification, Modal } from 'antd';
import { graphql } from 'react-apollo';
import sessionQuery from '../../gql/queries/session.gql';
import signUpMutation from '../../gql/mutations/user/signup.gql';
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

  showLicense = e => {
    e.preventDefault();
    Modal.info({
      title: '-:- License -:-',
      content: (
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. A iure neque quasi saepe maxime est nemo cum rerum voluptas! Sunt, consectetur! Doloribus iusto dolores itaque soluta ea amet molestias nam!
        </div>
      ),
    });
  }

  trySubmit = async (e, formValues) => {
    e.preventDefault();
    this.setState({ loading: true })
    try {
      const { data: { signup } } = await this.props.mutate({
        variables: formValues,
      });

      if (signup.errors) {
        this.setState({ errors: signup.errors });
        signup.errors.map((error, i) => {
          this.props.form.setFields({
            [error.field]: {
              value: this.props.form.getFieldValue(error.field),
              errors: [new Error(error.message)]
            }
          })
        });
        throw new Error(JSON.stringify(signup.errors));
      } else {
        this.props.form.resetFields();
        this.openNotification(signup.user.confirmationToken)
        // this.props.history.push('/');
      }
    } catch (err) {
      this.openNotificationWhenFormErrors();
      console.error('Signup Fail: ', JSON.parse(err.message));
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
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { data } = this.props;
    if (data.loading) return <div>Loading...</div>;
    if (data.session.ok) return <Redirect to="/" />;

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
      <div className={`flex-full-page flex-center-page`}>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <h1 style={{ textAlign: 'center', color: '#001529' }}>
          <Icon type="user-add" style={{
            border: '#001529 1px solid',
            padding: 10,
            borderRadius: '50%',
          }} />
          <span> Sign Up a New Nser</span>
        </h1>
        <Card style={{ width: 500, boxShadow: '0 0 100px rgba(0,0,0,.08)' }}>
        <Spin spinning={this.state.loading} >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="Username"
              hasFeedback
            >
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: 'Please input your Username!'
                }],
                //initialValue: 'test',
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
                //initialValue: 'test@test.com',
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
                  validator: this.validateToNextPassword,
                }],
                //initialValue: 'test',
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
                  validator: this.compareToFirstPassword,
                }],
                //initialValue: 'test',
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked',
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('Please check agrrement!');
                    } else {
                      callback();
                    }
                  },
                }],
              })(
                <Checkbox>I have read the <a href="" onClick={this.showLicense}>agreement</a></Checkbox>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout} style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" icon="check" loading={this.state.loading}>Register</Button>
            </FormItem>
          </Form>
          </Spin>
        </Card>
      </div>
    );
  }
}