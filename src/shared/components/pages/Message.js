import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import allMessages from '../../gql/queries/all_messages.gql';
import PageTitle from '../blocks/PageTitle';


@graphql(allMessages)
export default class Message extends Component {
  render() {
    const { loading, message, error } = this.props.data;
    if (loading) return (<div><PageTitle title="Loading Message (Apollo Graphql)" />Loading...</div>);

    return (
      <div>
        <PageTitle title="Message (Apollo Graphql)" />
        <h2> Message from Graphql Server </h2>
        { message.text }
      </div>
    )
  }
}
