import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap
} from '@ngrx/store';

import * as fromTodos from '../reducers/todos.reducer';

export const selectTodosState = createFeatureSelector<fromTodos.TodoState>('todos');

export const selectAllTodos = createSelector(
    selectTodosState,
    fromTodos.selectAllTodos);