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

export function reducer(state: TodoState | undefined, action: Action) {
    return todoReducer(state, action);
}