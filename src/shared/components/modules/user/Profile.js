import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Helmet } from "react-helmet";
import fontawesome from '@fortawesome/fontawesome';
import { faCheck, faSmile } from '@fortawesome/fontawesome-free-solid';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import sessionQuery from '../../../gql/queries/session.gql';
import updateProfileMutation from '../../../gql/mutations/user_profile/update.gql';

fontawesome.library.add(faCheck, faSmile)

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
export default class Profile extends Component {

  state = {
    loading: false,
    errors: [],
    firstName: this.props.data.session.user.profile.firstName,
    lastName: this.props.data.session.user.profile.lastName
  }

  handleFormChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = async (e) => {
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
        this.setState({ 
          errors: userProfileUpdate.errors, 
          loading: false 
        });
        return;
      }
      alert('Update success');
    } catch (err) {
      alert(err.message)
      // this.setState({ loading: false })
      // Some kind of error was returned -- display it in the console
      // eslint-disable-next-line no-console
      // console.error('update error: ', e.message);
    }
    this.setState({ loading: false })
  }

  render() {
    const errorMessages = {};
    this.state.errors.map(error => {
      errorMessages[error.field] = error.message;
    })
    return (
      <div className="flex-full-page flex-center-page">
        <Helmet>
          <title>Your profile</title>
        </Helmet>
        <div className="card" style={{ width: '400px' }}>
          <form onSubmit={this.handleSubmit} className="box-1">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <FontAwesomeIcon icon={["fas", "smile"]} />
                </span>
                <span>Update your profile</span>
              </p>
            </header>
            <div className="card-content">
              <div className="content">
                <div className="field">
                  <label className="label">Firstname</label>
                  <div className="control">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className={`input${errorMessages.firstName ? ' is-danger' : ''}`}
                      placeholder="Firstname"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.firstName}
                    />
                  </div>
                  { errorMessages.firstName ? <p className="help is-danger">{errorMessages.firstName}</p> : '' }
                </div>

                <div className="field">
                  <label className="label">Lastname</label>
                  <div className="control">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className={`input${errorMessages.email ? ' is-danger' : ''}`}
                      placeholder="Lastname"
                      required
                      onChange={this.handleFormChange}
                      value={this.state.lastName}
                    />
                  </div>
                  { errorMessages.lastName ? <p className="help is-danger">{errorMessages.lastName}</p> : '' }
                </div>

                <div>
                  <button type="submit" className="button is-primary">
                    <span className="icon">
                      <FontAwesomeIcon icon={["fas", "check"]} />
                    </span>
                    <span>Save</span>
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
