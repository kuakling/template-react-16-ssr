import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { Button, List } from 'antd';

import { addTodo } from '../../actions/todos';

/**
 * This method combines the state of the reducers with the props passed to the component.
 * A component that connects to the store is commonly referred to as 'container'.
 * To connect to the store, the '@connect' decorator is used.
 *
 * @param todos
 * @returns {{todos: *}}
 */
const mapStateToProps = ({ todos }) => ({
  todos
});

/**
 * The `App` component is the entry point for the react app.
 * It is rendered on the client as well as on the server.
 *
 * You can start developing your react app here.
 */
@connect(mapStateToProps, {
  addTodo
})
export default class Todos extends Component {

  handleAddTodoClick = () => {
    this.props.addTodo(`Random Todo #${Math.round(Math.random() * 100)}`);
  };

  render() {
    const { todos } = this.props;
    const data = todos.map(todo => todo.name)
    return (
      <Fragment>
        <Helmet>
          <title>Todos with Redux.</title>
        </Helmet>
        <List
          header={<h2 style={{ margin: 0 }}>
            Todos with Redux
            <Button type="primary" icon="plus" onClick={this.handleAddTodoClick} style={{ float: 'right' }}>
              Add random todo
            </Button>
          </h2>}
          dataSource={data}
          bordered
          renderItem={item => (<List.Item>{item}</List.Item>)}
          style={{ backgroundColor: '#fff' }}
        />
      </Fragment>
    );
  }

}