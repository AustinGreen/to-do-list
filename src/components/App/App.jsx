import React, { Component } from 'react';
import PropTypes from 'prop-types';

const AddToDoForm = ({ onSubmit, onToDoChange, isError }) => (
  <form onSubmit={onSubmit} className="field has-addons has-addons-centered">
    <p className="control">
      <input
        onChange={onToDoChange}
        className={isError ? 'input is-danger' : 'input'}
        type="text"
        placeholder="Add a to-do"
      />
    </p>
    <p className="control">
      <button type="submit" className="button is-primary">+</button>
    </p>
  </form>
);

AddToDoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onToDoChange: PropTypes.func.isRequired,
  isError: PropTypes.bool,
};

AddToDoForm.defaultProps = {
  isError: false,
};

const ToDoList = ({ toDos, onDismiss }) => (
  <ul>
    {toDos.map(todo => (
      <li key={todo.key}>
        <span className="tag" style={{ fontSize: '1.05rem' }}>
          {todo.toDoName}
          <button className="delete is-small" onClick={() => onDismiss(todo.key)} />
        </span>
      </li>
    ))}
  </ul>
);

ToDoList.propTypes = {
  toDos: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      toDoName: PropTypes.string,
    }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDoName: '',
      toDos: [],
      isError: false,
    };

    this.onToDoSubmit = this.onToDoSubmit.bind(this);
    this.onToDoChange = this.onToDoChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  onDismiss(key) {
    const isNotId = item => item.key !== key;
    const updatedToDos = this.state.toDos.filter(isNotId);
    this.setState({
      toDos: updatedToDos,
    });
  }

  onToDoChange(e) {
    this.setState({ toDoName: e.target.value });
    if (e.target.value !== 0) {
      this.setState({ isError: false });
    }
  }

  onToDoSubmit(e) {
    const { toDoName, toDos } = this.state;
    if (toDoName.length === 0) {
      this.setState({ isError: true });
    } else if (!toDos.length) {
      this.setState(prevState => ({
        toDos: [...prevState.toDos, { key: 0, toDoName }],
        toDoName: '',
      }));
    } else {
      this.setState(prevState => ({
        toDos: [...prevState.toDos, { key: prevState.toDos[prevState.toDos.length - 1].key + 1, toDoName }],
        toDoName: '',
      }));
    }
    e.preventDefault();
    e.target.reset();
  }

  render() {
    const { toDos, isError } = this.state;
    return (
      <section className="section column is-half is-offset-one-quarter">
        <AddToDoForm onSubmit={this.onToDoSubmit} onToDoChange={this.onToDoChange} isError={isError} />
        <ToDoList toDos={toDos} onDismiss={this.onDismiss} />
      </section>
    );
  }
}

export default App;
