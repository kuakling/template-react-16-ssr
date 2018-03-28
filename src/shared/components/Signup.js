import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import fontawesome from '@fortawesome/fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import { faUserPlus, faUser, faKey, faCheck, faEnvelope } from '@fortawesome/fontawesome-free-solid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import sessionQuery from '../gql/queries/session.gql';
import signUpMutation from '../gql/mutations/user/signup.gql';

fontawesome.library.add(brands, faUserPlus, faUser, faKey, faCheck, faEnvelope)

const ConfirmUrl = props => (
  <div className="notification" style={{
    position: 'absolute',
    top: 60,
    right: 0,
    zIndex: 1
  }}>
    <h4>This url value for send e-mail for signup user</h4>
    <Link to={`/auth/confirm/${props.token}`}>
      Click here to confirm account
    </Link>
    <div className="field">
      <div className="control">
        <textarea
          className="textarea is-success"
          defaultValue={`${process.env.REACT_APP_WEB_URL}/${process.env.REACT_APP_BASE_URL}/auth/confirm/${props.token}`}
        />
      </div>
    </div>
  </div>
);

@graphql(sessionQuery)
@graphql(signUpMutation)
export default class Signup extends Component {
  state = {
    loading: false,
    errors: [],
    username: 'test',
    email: 'test@test.com',
    password: 'test',
    confirm: 'test',
    confirmationToken: null,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { password, confirm } = this.state;
    if (password !== confirm) {
      return alert('Confirm password no match.');
    }
    this.trySubmit(e);
  }

  trySubmit = async (e) => {
    this.setState({ loading: true })
    try {
      const { data: { signup } } = await this.props.mutate({
        variables: this.state,
      });

      console.log(signup)
      if (signup.errors) {
        this.setState({
          errors: signup.errors,
          loading: false
        });
        throw new Error('Form Input error');
      } else {
        this.setState({
          confirmationToken: signup.user.confirmationToken
        });
        // this.props.form.resetFields();
        // e.target.reset();
        alert('Signup Success ^_^ Please confirm your account ');
        // this.props.history.push('/');
        return;
      }
    } catch (err) {
      // alert('Signup fail ' + this.state.errors.map(e => e.message).join("\n"));
      this.setState({ loading: false })
      console.error('GraphQL error: ', this.state.errors);
    }
    this.setState({ loading: false })
  }

  handleFormChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const errorMessages = {};
    this.state.errors.map(error => {
      errorMessages[error.field] = error.message;
    })

    return (
      <div className="flex-full-page flex-center-page">
        <Helmet>
          <title>Register a new account</title>
        </Helmet>
        {this.state.confirmationToken ? <ConfirmUrl token={this.state.confirmationToken} /> : ''}
        <div className="card" style={{ width: '400px' }}>
          <form onSubmit={this.handleSubmit}>
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <FontAwesomeIcon icon={["fas", "user-plus"]} />
                </span>
                <span>Signup</span>
              </p>
            </header>
            <div className="card-content">
              <div className="content">
                <div className="field">
                  <label className="label">Username</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className={`input${errorMessages.username ? ' is-danger' : ''}`}
                      placeholder="Username"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.username}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={["fas", "user"]} />
                    </span>
                  </div>
                  {errorMessages.username ? <p className="help is-danger">{errorMessages.username}</p> : ''}
                </div>

                <div className="field">
                  <label className="label">E-Mail</label>
                  <div className="control has-icons-left">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className={`input${errorMessages.email ? ' is-danger' : ''}`}
                      placeholder="E-mail"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.email}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={["fas", "envelope"]} />
                    </span>
                  </div>
                  {errorMessages.email ? <p className="help is-danger">{errorMessages.email}</p> : ''}
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="input"
                      placeholder="Password"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.password}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={["fas", "key"]} />
                    </span>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Comfirm password</label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      name="confirm"
                      id="confirm"
                      className="input"
                      placeholder="Comfirm password"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.confirm}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={["fas", "key"]} />
                    </span>
                  </div>
                </div>

                <div>
                  <button type="submit" className="button is-primary">
                    <span className="icon">
                      <FontAwesomeIcon icon={["fas", "check"]} />
                    </span>
                    <span>Signup</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
