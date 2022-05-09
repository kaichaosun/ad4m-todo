import classNames from 'classnames'
import { ESCAPE_KEY, ENTER_KEY } from '../config'
import { useState } from 'react';

const TodoItem = (props: ITodoItemProps) => {
  const [editText, setEditText] = useState("");

  const handleEdit = () => {
    props.onEdit();
    setEditText(props.todo.title);
  }

  const handleSubmit = (event) => {
    let text = editText.trim();
    if (text) {
      props.onSave(text);
    } else {
      props.onDestroy();
    }
  }

  const handleChange = (event) => {
    let input = event.target;
    setEditText(input);
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === ESCAPE_KEY) {
      setEditText(props.todo.title)
      props.onCancel(event);
    } else if (event.keyCode === ENTER_KEY) {
      handleSubmit(event);
    }
  }
  
  return (
    <li className={classNames({
      completed: props.todo.completed,
      editing: props.editing
    })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={props.todo.completed}
          onChange={props.onToggle}
        />
        <label onDoubleClick={ e => handleEdit() }>
          {props.todo.title}
        </label>
        <button className="destroy" onClick={props.onDestroy} />
      </div>
      <input
        ref="editField"
        className="edit"
        value={editText}
        onBlur={ e => handleSubmit(e) }
        onChange={ e => handleChange(e) }
        onKeyDown={ e => handleKeyDown(e) }
      />
    </li>
  );
}

export default TodoItem