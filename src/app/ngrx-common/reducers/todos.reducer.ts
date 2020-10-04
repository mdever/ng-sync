import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on, State } from '@ngrx/store';
import * as todoActions from '../actions/todos.actions';

export interface Todo {
    todoText: string;
    todoId: string;
    dueDate: Date;
    done: boolean;
}

export interface TodoState extends EntityState<Todo> {

}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
    selectId: selectTodoId
});

function selectTodoId(todo: Todo) {
    return todo.todoId;
}

var i: number = 0;
const genNewId = () => '' + i++;

export const initialState: TodoState = adapter.getInitialState({})

export const todoReducer = createReducer(
    initialState,
    on(todoActions.addTodo, (state, { todoText }) => {
        var todo = {
            todoText,
            todoId: genNewId(),
            dueDate: new Date(),
            done: false
        };
        return adapter.upsertOne(todo, state);
    }),
    on(todoActions.removeTodo, (state, { todoId }) => adapter.removeOne(todoId, state))
)

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = adapter.getSelectors();
   
  // select the array of user ids
  export const selectTodoIds = selectIds;
   
  // select the dictionary of user entities
  export const selectTodoEntities = selectEntities;
   
  // select the array of users
  export const selectAllTodos = selectAll;
   
  // select the total user count
  export const selectTodoTotal = selectTotal;

export function reducer(state: TodoState | undefined, action: Action) {
    return todoReducer(state, action);
}