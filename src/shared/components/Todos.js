import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addTodo } from '../actions/todos';

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
    return (
      <div>
        <h1>Todos with Redux.</h1>
        <button onClick={this.handleAddTodoClick} className={`btn btn-primary`}>Add random todo</button>
        <ul>
          {todos.map(todo =>
            <li key={todo.id}>{todo.name}</li>
          )}
        </ul>
      </div>
    );
  }

}