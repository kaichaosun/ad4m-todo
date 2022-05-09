import { pluralize } from '../util'
import classNames from 'classnames'
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../config'

const Footer = (props: ITodoFooterProps) => {

  let clearButton: any = null;

  if (props.completedCount > 0) {
    clearButton = (
      <button
        className="clear-completed"
        onClick={props.onClearCompleted}>
        Clear completed
      </button>
    );
  }

  const nowShowing = props.nowShowing;
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{props.count}</strong> {pluralize(props.count, 'item')} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={classNames({ selected: nowShowing === ALL_TODOS })}>
            All
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/active"
            className={classNames({ selected: nowShowing === ACTIVE_TODOS })}>
            Active
          </a>
        </li>
        {' '}
        <li>
          <a
            href="#/completed"
            className={classNames({ selected: nowShowing === COMPLETED_TODOS })}>
            Completed
          </a>
        </li>
      </ul>
      {clearButton}
    </footer>
  )
}

export default Footer