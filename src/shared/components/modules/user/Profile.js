import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import { Spin, Form, Icon, Input, Button, List, notification, Modal } from 'antd';
import sessionQuery from '../../../gql/queries/session.gql';
import updateProfileMutation from '../../../gql/mutations/user_profile/update.gql';

const FormItem = Form.Item;

const formItems = [
  {
    label: "First name",
    input: {
      type: 'text',
      placeholder: "First name",
      name: "firstName",
    },
    rules: [{ required: true, message: 'Please input your first name!' }],
  },
  {
    label: "Last name",
    input: {
      placeholder: "Last name",
      name: "lastName",
    },
    // rules: [{ required: true, message: 'Please input your last name!' }],
  },
];

@graphql(sessionQuery)
@graphql(updateProfileMutation, {
  options: {
    update(proxy, { data: { userProfileUpdate } }) {
      const data = proxy.readQuery({
        query: sessionQuery,
      });
      // console.log('Profile.js', updateProfile)
      data.session.user.profile = userProfileUpdate.profile;
      proxy.writeQuery({ query: sessionQuery, data });
    },
  },
})
@Form.create()
export default class Profile extends Component {

  // constructor(props) {
  //   super(props)

  //   this.user = props.data.session.user;
  //   const { id, username, email } = this.user;
  //   const { firstName, lastName } = this.user.profile;
  //   this.state = {
  //     firstName,
  //     lastName,
  //     loading: false,
  //     errors: [],
  //   }
  // }

  state = {
    loading: false,
    errors: [],
    // firstName: this.props.data.session.user.profile.firstName,
    // lastName: this.props.data.session.user.profile.lastName,
  }

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

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
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

  trySubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true })
    try {
      const { data: { userProfileUpdate } } = await this.props.mutate({
        variables: {
          user_id: this.state.id,
          ...this.state
        },
      });

      if (userProfileUpdate.errors) {
        this.setState({ errors: userProfileUpdate.errors });
        userProfileUpdate.errors.map((error, i) => {
          this.props.form.setFields({
            [error.field]: {
              value: this.props.form.getFieldValue(error.field),
              errors: [new Error(error.message)]
            }
          })
        });
        throw new Error(JSON.stringify(userProfileUpdate.errors));
      } else {
        notification.success({
          message: 'Update Profile Success',
        });
      }
    } catch (err) {
      console.log(err.message);
      this.openNotificationWhenFormErrors();
      console.error('Update profile Fail: ', JSON.parse(err.message));
    }
    this.setState({ loading: false })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formLayout = 'horizontal';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    } : null;
    const buttonItemLayout = formLayout === 'horizontal' ? {
      wrapperCol: { span: 20, offset: 4 },
    } : null;
    const { profile } = this.props.data.session.user;

    return (
      <Fragment>
        <h2>Update your profile</h2>
        <Spin spinning={this.state.loading} >
          <Form onSubmit={this.handleSubmit} layout={'horizontal'}>
            {formItems.map(item => (
              <FormItem
                key={`form-item-${item.input.name}`}
                label={item.label}
                {...formItemLayout}
              >
                {getFieldDecorator(item.input.name, {
                  rules: item.rules || [],
                  initialValue: profile[item.input.name],
                })(
                  <Input {...item.input} onChange={this.handleChange} />
                )}
              </FormItem>
            ))}

            <FormItem {...buttonItemLayout}>
              <Button type="primary" htmlType="submit" icon="check" loading={this.state.loading}>
                Submit
            </Button>
            </FormItem>
          </Form>
        </Spin>
      </Fragment>
    );
  }
}
