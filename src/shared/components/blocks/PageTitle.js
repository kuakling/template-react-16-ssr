import React from 'react';
import { Helmet } from "react-helmet";

export default ({ title }) => {
  return (
    <Helmet>
      <title>{ title }</title>
    </Helmet>
  )
}
