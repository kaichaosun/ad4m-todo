import Login from './components/Login';
import './App.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Loader, Stack, Text, TextInput } from '@mantine/core';
import { Ad4mContext } from '.';
import TodoItem from './components/TodoItem';
import Footer from './components/Footer';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY, AD4M_ENDPOINT } from './config';
import Header from './components/Header';
import { buildAd4mClientJwt } from './util';
import { ExceptionInfo } from '@perspect3vism/ad4m/lib/src/runtime/RuntimeResolver';
import { ExceptionType } from '@perspect3vism/ad4m';
import { Capabilities, Capability } from 'app-capability';

const App = (props: IAppProps) => {
  const ad4mClient = useContext(Ad4mContext);

  const [connected, setConnected] = useState(false);
  const [isLogined, setIsLogined] = useState<Boolean>(false);
  const [did, setDid] = useState("");
  const [nowShowing, setNowShowing] = useState("");
  const [editing, setEditing] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [markAllComplete, setMarkAllComplete] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [phrase, setPhrase] = useState("");
  const [jwt, setJwt] = useState("");
  const [ad4mClientJwt, setAd4mClientJwt] = useState(ad4mClient);

  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   const checkConnection = async () => {
  //     try {
  //       let result = await ad4mClient.runtime.hcAgentInfos(); // TODO runtime info is broken
  //       console.log("get hc agent infos success.", result);
  //       setConnected(true);
  //     } catch (err) {
  //       setConnected(false);
  //     }
  //   }

  //   checkConnection();

  //   console.log("Check if ad4m service is connected.")
  // }, [ad4mClient]);

  useEffect(() => {
    const ad4mClientNew = buildAd4mClientJwt(AD4M_ENDPOINT, jwt);
    setAd4mClientJwt(ad4mClientNew)
  }, [jwt]);

  const handleLogin = (login: Boolean, did: string) => {
    setIsLogined(login);
    setDid(did);
  }

  const handleToggle = (todoToToggle: ITodo) => {
    props.model.toggle(todoToToggle);
    setRefresh(!refresh);
  }

  const handleDestroy = (todo: ITodo) => {
    props.model.destroy(todo);
    setRefresh(!refresh);
  }

  const handleEdit = (todo: ITodo) => {
    setEditing(todo.id);
    setRefresh(!refresh);
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
    setMarkAllComplete(checked)
  }

  const handleNewTodoKeyDown = (event) => {
    if (event.keyCode != ENTER_KEY) {
      return;
    }

    let val = inputRef.current?.value.trim();

    if (val) {
      props.model.addTodo(val);
      setRefresh(!refresh);
    }
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
          onChange={toggleAll}
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

  const requestCapability = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      let capabilities: Capabilities = [
        {with: {domain: "agent", pointers: ["*"]}, can: ["READ"]},
        {with: {domain: "runtime.exception", pointers: ["*"]}, can: ["SUBSCRIBE"]}
      ]
      let requestId = await ad4mClient.agent.requestCapability("demo-app", "demo-desc", "demo-url", JSON.stringify(capabilities));
      console.log("auth request id: ", requestId);
      ad4mClient.runtime.addExceptionCallback((exception: ExceptionInfo) => {
        console.log("hello in subscription from todo app")
        if (exception.type === ExceptionType.CapabilityRequested) {
          console.log("new capability request", JSON.stringify(exception))
        }
        return null
      })
      setRequestId(requestId);
    } catch (err) {
      console.log(err);
    }
  };

  const subscribeException = async (event: React.SyntheticEvent) => {
    console.log("subscribe here")
    try {
      ad4mClientJwt.runtime.addExceptionCallback((exception: ExceptionInfo) => {
        console.log("subscribe comes in")
        if (exception.type === ExceptionType.CapabilityRequested) {
          console.log("new capability request", JSON.stringify(exception))
        }
        return null
      })
    } catch (err) {
      console.log(err);
    }
  };

  const generateJwt = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      let jwt = await ad4mClient.agent.generateJwt(requestId, phrase);
      console.log("auth jwt: ", jwt);
      setJwt(jwt);
    } catch (err) {
      console.log(err);
    }
  };

  const checkJwt = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      let status = await ad4mClientJwt.agent.status();
      console.log("agent status: ", status);
    } catch (err) {
      console.log(err);
    }
  };

  const onPhraseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let { value } = event.target;
    setPhrase(value);
  }

  return (
    <div className="App">
      <Stack align="center" spacing="xl" style={{ margin: "auto" }}>
        <Header />
        {/* {!connected && (
          <Loader />
        )}
        {connected && !isLogined && (
          <Login handleLogin={handleLogin} />
        )} */}
        {isLogined && <Text>DID: {did}</Text>}
        <Button onClick={subscribeException} >
          Subscribe exception
        </Button>

        <Button onClick={requestCapability} >
          Request auth
        </Button>

        <TextInput
          type="text"
          placeholder="number"
          label="Input 6-digits number"
          onChange={onPhraseChange}
        />

        <Button onClick={generateJwt} >
          Generate JWT token
        </Button>

        <Button onClick={checkJwt} >
          Get capabilities of JWT token
        </Button>

        {/* <TextInput
          type="text"
          ref={inputRef}
          placeholder="What needs to be done?"
          label="Add a task"
          onKeyDown={handleNewTodoKeyDown}
          autoFocus={true}
        />

        {main}
        {footer} */}
      </Stack>
    </div>
  );
}

export default App;
