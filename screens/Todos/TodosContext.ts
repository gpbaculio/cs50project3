import React from 'react'
import { TodoType } from './Todo';


export type FilterType = 'All' | 'Active' | 'Completed';


type TodosMethodContext = {
  setCurrentFilter: (filterType: FilterType) => void;
  todos: TodoType[];
  currentFilter: FilterType;
  setTodos: (newTodos: TodoType[]) => void;
  count: number;
};

 const TodosContext = React.createContext<TodosMethodContext>({
  setCurrentFilter: function() {},
  todos: [],
  currentFilter: 'All',
  setTodos: function() {},
  count: 0,
});

export default TodosContext