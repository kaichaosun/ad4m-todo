import Login from './components/Login';
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { Loader, Stack } from '@mantine/core';
import { Ad4mContext } from '.';
import TodoItem from './components/TodoItem';
import Footer from './components/Footer'
import {ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY} from './config';

const App = (props: IAppProps) => {
  const ad4mClient = useContext(Ad4mContext);

  const [connected, setConnected] = useState(false);
  const [isLogined, setIsLogined] = useState<Boolean>(false);
  const [did, setDid] = useState("");
  const [nowShowing, setNowShowing] = useState("");
  const [editing, setEditing] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await ad4mClient.runtime.hcAgentInfos(); // TODO runtime info is broken
        console.log("get hc agent infos success.");
        setConnected(true);
      } catch (err) {
        setConnected(false);
      }
    }

    checkConnection();

    console.log("Check if ad4m service is connected.")
  }, [ad4mClient]);

  const handleLogin = (login: Boolean, did: string) => {
    setIsLogined(login);
    setDid(did);
  }

  const handleToggle = (todoToToggle: ITodo) => {
    props.model.toggle(todoToToggle);
  }

  const handleDestroy = (todo: ITodo) => {
    props.model.destroy(todo);
  }

  const handleEdit = (todo: ITodo) => {
    setEditing(todo.id);
  }

  const handleSave = (todo: ITodo, text) => {
    props.model.save(todo, text);
    setEditing("");
  }

  const handleCancel = () => {
    setEditing("");
  }

  const clearCompleted = () => {
    props.model.clearCompleted();
  }

  const toggleAll = (event) => {
    let checked = event.target.checked;
    props.model.toggleAll(checked);
  }

  const handleNewTodoKeyDown = (event) => {
    if (event.keyCode != ENTER_KEY) {
      return;
    }

    event.preventDefault();

  }

  let footer;
  let main;
  const todos = props.model.todos;

  let shownTodos = todos.filter((todo) => {
    switch (nowShowing) {
      case ACTIVE_TODOS:
        return !todo.completed;
      case COMPLETED_TODOS:
        return todo.completed;
      default:
        return true;
    }
  });

  let todoItems = shownTodos.map((todo) => {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={() => handleToggle(todo)}
        onDestroy={() => handleDestroy(todo)}
        onEdit={() => handleEdit(todo)}
        editing={editing === todo.id}
        onSave={() => handleSave} // TODO fix this
        onCancel={e => handleCancel()}
      />
    );
  });

  // Note: It's usually better to use immutable data structures since they're
  // easier to reason about and React works very well with them. That's why
  // we use map(), filter() and reduce() everywhere instead of mutating the
  // array or todo items themselves.
  var activeTodoCount = todos.reduce(function (accum, todo) {
    return todo.completed ? accum : accum + 1;
  }, 0);

  var completedCount = todos.length - activeTodoCount;

  if (activeTodoCount || completedCount) {
    footer =
      <Footer
        count={activeTodoCount}
        completedCount={completedCount}
        nowShowing={nowShowing}
        onClearCompleted={e => clearCompleted()}
      />;
  }

  if (todos.length) {
    main = (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={e => toggleAll(e)}
          checked={activeTodoCount === 0}
        />
        <label
          htmlFor="toggle-all"
        >
          Mark all as complete
        </label>
        <ul className="todo-list">
          {todoItems}
        </ul>
      </section>
    );
  }

  return (
    <div className="App">
      {!connected && (
        <Stack align="center" spacing="xl" style={{ margin: "auto" }}>
          <Loader />
        </Stack>
      )}
      {connected && !isLogined && (
        <Stack align="center" spacing="xl" style={{ margin: "auto" }}>
          <Login handleLogin={handleLogin} />
        </Stack>
      )}
      {isLogined && <p>DID: {did}</p>}
      <header className="header">
        <h1>todos</h1>
        <input
          ref="newField"
          className="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={e => handleNewTodoKeyDown(e)}
          autoFocus={true}
        />
      </header>
      {main}
      {footer}
    </div>
  );
}

export default App;
