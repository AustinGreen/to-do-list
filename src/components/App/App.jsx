import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AppContainer = styled.section`
  max-width: 1080px;
  margin: 0 auto;
`;

const FullWidthContainer = styled.p`
  width: 100%;
`;

const ListItem = styled.span`
  font-size: 1.05rem;
  width: 100%;
  margin: 5px 0;
  border: 1px solid darkgray;
  justify-content: space-between;
`;

const AddToDoForm = ({ onSubmit, onToDoChange, isError }) => (
  <form onSubmit={onSubmit} className="field has-addons">
    <FullWidthContainer className="control">
      <input
        onChange={onToDoChange}
        className={isError ? 'input is-danger' : 'input'}
        type="text"
        placeholder="Add a to-do"
      />
    </FullWidthContainer>
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

const ToDoList = ({ toDos, onDismiss, isEditing, toggleChecked }) => (
  <ul>
    {toDos.map(todo => (
      <li key={todo.key}>
        <ListItem className="tag">
          <input type="checkbox" onChange={() => toggleChecked(todo)} checked={todo.isChecked} />
          {todo.toDoName}
          <button className="delete is-small" onClick={() => onDismiss(todo.key)} />
        </ListItem>
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
      isEditing: false,
    };

    this.onToDoSubmit = this.onToDoSubmit.bind(this);
    this.onToDoChange = this.onToDoChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
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
        toDos: [...prevState.toDos, { key: 0, toDoName, isChecked: false }],
        toDoName: '',
      }));
    } else {
      this.setState(prevState => ({
        toDos: [
          ...prevState.toDos,
          { key: prevState.toDos[prevState.toDos.length - 1].key + 1, toDoName, isChecked: false },
        ],
        toDoName: '',
      }));
    }
    e.preventDefault();
    e.target.reset();
  }

  toggleEditing(key) {
    // this.setState({ isEditing: !this.state.isEditing });
  }

  toggleChecked(item) {
    const updatedToDos = this.state.toDos.filter(todo => todo.key !== item.key);
    const checkedTodo = this.state.toDos.find(todo => todo.key === item.key);
    checkedTodo.isChecked = !checkedTodo.isChecked;
    this.setState({
      toDos: [...updatedToDos, checkedTodo],
    });
  }

  render() {
    const { toDos, isError, isEditing } = this.state;
    return (
      <AppContainer>
        <AddToDoForm onSubmit={this.onToDoSubmit} onToDoChange={this.onToDoChange} isError={isError} />
        {toDos.length === 0
          ? <h3 className="subtitle is-3 has-text-centered">You have nothing to do. Enjoy! 😜</h3>
          : <ToDoList
            isEditing={isEditing}
            toggleChecked={this.toggleChecked}
            toggleEditing={this.toggleEditing}
            toDos={toDos}
            onDismiss={this.onDismiss}
          />}
      </AppContainer>
    );
  }
}

export default App;
