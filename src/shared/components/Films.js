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
query {
  allFilms {
    id
    title
    director
    createdAt
  }
}
`)
export default class Films extends Component {
  render() {
    if (this.props.data.loading) return (<div><PageTitle />Loading...</div>);
    const { allFilms } = this.props.data;
    return (
      <div>
        <PageTitle />
        <ul>
          {allFilms.map(film => (
            <li key={`film-${film.id}`}>{film.title}</li>
          ))}
        </ul>
      </div>
    )
  }
}
