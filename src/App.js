import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // Setting up state
    this.state = {
      userInput: "",
      list: JSON.parse(localStorage.getItem('list')) || [],
    };
  }

  // Set a user input value
  updateInput(value) {
    this.setState({
      userInput: value,
    });
  }

  // Add item if user input is not empty
  addItem() {
    if (this.state.userInput !== "") {
      const userInput = {
        // Add a random id which is used to delete
        id: Math.random(),

        // Add a user value to list
        value: this.state.userInput,

        // Add a completed property
        completed: false,
      };

      // Update list
      const list = [...this.state.list];
      list.push(userInput);

      // reset state
      this.setState({
        list,
        userInput: "",
      }, () => {
        // Save to local storage
        localStorage.setItem('list', JSON.stringify(this.state.list));
      });
    }
  }

  // Function to delete item from list use id to delete
  deleteItem(key) {
    const list = [...this.state.list];

    // Filter values and leave value which we need to delete
    const updateList = list.filter((item) => item.id !== key);

    // Update list in state
    this.setState({
      list: updateList,
    }, () => {
      // Save to local storage
      localStorage.setItem('list', JSON.stringify(this.state.list));
    });
  }

  editItem(index) {
    const todos = [...this.state.list];
    const editedTodo = prompt('Edit the todo:', todos[index].value);
    if (editedTodo !== null && editedTodo.trim() !== '') {
      let updatedTodos = [...todos];
      updatedTodos[index].value = editedTodo;
      this.setState({
        list: updatedTodos,
      }, () => {
        // Save to local storage
        localStorage.setItem('list', JSON.stringify(this.state.list));
      });
    }
  }

  // Function to toggle task completion
  handleToggleComplete = (key) => {
    const updatedList = this.state.list.map((item) => {
      if (item.id === key) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    // Update list in state
    this.setState({
      list: updatedList,
    }, () => {
      // Save to local storage
      localStorage.setItem('list', JSON.stringify(this.state.list));
    });
  };

  // Function to set filter type
  setFilterType = (filterType) => {
    this.setState({ filterType });
  };
  // Function to filter tasks based on the filter type
  filterTasks = () => {
    const { filterType, list } = this.state;
    switch (filterType) {
      case 'completed':
        return list.filter(task => task.completed);
      case 'incomplete':
        return list.filter(task => !task.completed);
      case 'all':
      default:
        return list;
    }
  };


  render() {
    const filteredTasks = this.filterTasks();

    return (
      <Container className="container">
        <Row className="title">
          TODO LIST
        </Row>

        <hr />
        <Row>
          <Col md={{ span: 5, offset: 4 }}>
            <InputGroup className="mb-3 input-group">
              <FormControl
                placeholder="add item . . . "
                size="lg"
                value={this.state.userInput}
                onChange={(item) =>
                  this.updateInput(item.target.value)
                }
                aria-label="add something"
                aria-describedby="basic-addon2"
              />
              <InputGroup>
                <Button
                  variant="dark"
                  className="mt-2 btn-add"
                  onClick={() => this.addItem()}
                >
                  ADD
                </Button>
              </InputGroup>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 5, offset: 4 }}>
            <div className="filters mb-3">
              <Button variant="outline-dark" onClick={() => this.setFilterType('all')}>
                All
              </Button>
              <Button variant="outline-dark" onClick={() => this.setFilterType('completed')}>
                Completed
              </Button>
              <Button variant="outline-dark" onClick={() => this.setFilterType('incomplete')}>
                Incomplete
              </Button>
            </div>
            <ListGroup>
              {/* map over and print items */}
              {filteredTasks.map((item, index) => {
                return (
                  <ListGroup.Item
                    key={item.id}
                    variant="dark"
                    className={`list-group-item show`}
                    action
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => this.handleToggleComplete(item.id)}
                      style={{ marginRight: "10px" }}
                    />
                    <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                      {item.value}
                    </span>
                    <span style={{ float: "right" }}>
                      <Button
                        style={{ marginRight: "10px" }}
                        variant="light"
                        className="btn-delete"
                        onClick={() => this.deleteItem(item.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="light"
                        className="btn-edit"
                        onClick={() => this.editItem(index)}
                      >
                        Edit
                      </Button>
                    </span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
