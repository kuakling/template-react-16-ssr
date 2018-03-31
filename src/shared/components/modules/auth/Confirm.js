import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import jwt from 'jsonwebtoken';
import { Helmet } from "react-helmet";
import { Button } from 'antd';
import { base64Decode } from '../../../core/helpers'
import config from '../../../../shared/core/config';
import signUpConfirmMutation from '../../../gql/mutations/auth/signup-confirm.gql';

@graphql(signUpConfirmMutation)
export default class Confirm extends Component {

  state = {
    loading: false,
    errors: [],
  };

  constructor(props) {
    super(props);

    this.token = props.match.params.token
    this.tokenJwt = base64Decode(this.token);
    try {
      this.tokenOf = jwt.verify(this.tokenJwt, config.jwt.secretKey);
    } catch (err) {
      console.log(err)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.trySubmit(e);
  }

  trySubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    try {
      // console.log(this.token)
      const { data: { signupConfirm } } = await this.props.mutate({
        variables: {
          token: this.token
        }
      });

      if (signupConfirm.errors) {
        this.setState({
          errors: signupConfirm.errors,
          loading: false
        });
        throw new Error('Form Input error');
      } else {
        alert('Confirm success. Please login');
        this.props.history.push('/auth/login');
        return;
      }
    } catch (err) {
      alert('Confirm error !');
      this.setState({ loading: false })
    }
    this.setState({ loading: false })
  }

  render() {
    return (
      <div className="flex-full-page flex-center-page">
        <Helmet>
          <title>Confirmation</title>
        </Helmet>
        <form onSubmit={this.handleSubmit} style={{textAlign: 'center'}}>
          <h3>{!!this.tokenOf ? `Confirmation for: ${this.tokenOf.email}` : 'Error !'}</h3>
          <Button type="primary" htmlType="submit">
            <span>Confirm</span>
          </Button>
        </form>
      </div>
    )
  }
}
