import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Helmet } from "react-helmet";


const PageTitle = () => (
  <Helmet>
    <title>All films (Apollo Graphql)</title>
  </Helmet>
)

@graphql(gql`
{
  message {
    text
  }
}
`)
export default class Message extends Component {
  render() {
    if (this.props.data.loading) return (<div><PageTitle />Loading...</div>);
    const { message } = this.props.data;
    return (
      <div>
        <PageTitle />
        <h4> Message from Graphql Server: </h4>
        {message.text}
      </div>
    )
  }
}
