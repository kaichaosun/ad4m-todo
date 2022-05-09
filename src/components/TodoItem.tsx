import { ESCAPE_KEY, ENTER_KEY } from '../config'
import { useRef, useState } from 'react';
import { Checkbox, Text, CloseButton, Group, List, ListItem } from '@mantine/core';

const TodoItem = (props: ITodoItemProps) => {
  const [editText, setEditText] = useState("");

  const editField = useRef<HTMLInputElement>(null);

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
    <List>
        <Group>
          <Checkbox
            checked={props.todo.completed}
            onChange={props.onToggle}
          />
          <Text onDoubleClick={handleEdit}>
            {props.todo.title}
          </Text>
          <CloseButton onClick={props.onDestroy} />
        </Group>
      <ListItem>
        <input
          ref={editField}
          className="edit"
          value={editText}
          onBlur={e => handleSubmit(e)}
          onChange={e => handleChange(e)}
          onKeyDown={e => handleKeyDown(e)}
        />
      </ListItem>
    </List>
  );
}

export default TodoItem