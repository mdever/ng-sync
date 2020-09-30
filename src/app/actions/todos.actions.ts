import { Action, createAction, props } from '@ngrx/store';

export const addTodo = createAction(
    '[Todo] Add',
    props<{ todoText: string }>()
);

export const removeTodo = createAction(
    '[Todo] Remove',
    props<{ todoId: string }>()
);