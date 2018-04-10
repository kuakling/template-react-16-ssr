import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MainLayout from '../layouts/main';

import Home from './Home';
import About from './About';
import Todos from './Todos';
import Message from './Message';
import Signup from './Signup';

export const pageRoutes = [
  {
    exact: true,
    path: '/',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/todos',
    component: Todos
  },
  {
    path: '/message',
    component: Message
  },
  {
    path: '/signup',
    component: Signup
  },
];

const fncPageReg = () => {
  const paths = pageRoutes.map(item => (
    item.path
  ));
  return paths.join('|');
}

export const pageReg = fncPageReg();




export default () => {
  return (
    <MainLayout>
      <Switch>
        {
          pageRoutes.map(item => (
            <Route key={item.path} {...item} />
          ))
        }
      </Switch>
    </MainLayout>
  )
}
