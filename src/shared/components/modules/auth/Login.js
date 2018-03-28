import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import fontawesome from '@fortawesome/fontawesome';
import { faUser, faKey, faLock, faSignInAlt } from '@fortawesome/fontawesome-free-solid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import config from '../../../../shared/core/config';
import sessionQuery from '../../../gql/queries/session.gql';
import loginMutation from '../../../gql/mutations/auth/login.gql';

fontawesome.library.add(faUser, faKey, faLock, faSignInAlt)

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
export default class Login extends Component {
  state = {
    loading: false,
    errors: [],
    identity: '',
    password: '',
  }

  trySubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true })
    try {
      const { data: { login } } = await this.props.mutate({
        variables: this.state,
      });
      // console.log(login)

      if (login.errors) {
        this.setState({
          errors: login.errors,
          loading: false
        });
        throw new Error('Form Input error');
      } else {
        if (!SERVER) {
          // window.localStorage.setItem(config.auth.storageName, login.jwt);
          document.cookie = `${config.auth.storageName}=${login.jwt}; path=/`;
        }
        console.log('Login success');
        this.props.history.push('/');
        return;
      }
    } catch (err) {
      // alert(this.state.errors.map(e => e.message).join("\n"))
      console.log(this.state.errors)
      this.setState({ loading: false })
      console.error('GraphQL error: ', this.state.errors.map(e => e.message).join("\n"));
    }
    this.setState({ loading: false })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.trySubmit(e);
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
          <title>Login</title>
        </Helmet>
        <div className="card" style={{ width: '400px' }}>
          <form onSubmit={this.handleSubmit}>
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <FontAwesomeIcon icon={["fas", "lock"]} />
                </span>
                <span>Login</span>
              </p>
            </header>
            <div className="card-content">
              <div className="content">
                <div className="field">
                  <label className="label">Identity</label>
                  <p className="control has-icons-left">
                    <input
                      type="text"
                      name="identity"
                      id="identity"
                      className={`input${errorMessages.identity ? ' is-danger' : ''}`}
                      placeholder="Username or E-mail"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.username}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={["fas", "user"]} />
                    </span>
                  </p>
                  { errorMessages.identity ? <p className="help is-danger">{errorMessages.identity}</p> : '' }
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <p className="control has-icons-left">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className={`input${errorMessages.password ? ' is-danger' : ''}`}
                      placeholder="Password"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.password}
                    />
                    <span className="icon is-small is-left">
                      <FontAwesomeIcon icon={["fas", "key"]} />
                    </span>
                  </p>
                  { errorMessages.password ? <p className="help is-danger">{errorMessages.password}</p> : '' }
                </div>

                <div>
                  <button type="submit" className="button is-primary">
                    <span className="icon">
                      <FontAwesomeIcon icon={["fas", "sign-in-alt"]} />
                    </span>
                    <span>Login</span>
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
