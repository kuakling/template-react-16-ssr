import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Helmet } from "react-helmet";


const PageTitle = () => (
  <Helmet>
    <title>Message (Apollo Graphql)</title>
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
    const { loading, message, error } = this.props.data;
    if (loading) return (<div><PageTitle />Loading...</div>);
    if (error){
      // console.log(error)
      return (<div>{error.message}</div>);
    }

    return (
      <div>
        <PageTitle />
        <h4> Message from Graphql Server: </h4>
        {message.text}
      </div>
    )
  }
}
