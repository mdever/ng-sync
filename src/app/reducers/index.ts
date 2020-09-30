import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromTodos from './todos.reducer';

export interface AppState {
  todos: fromTodos.TodoState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodos.todoReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
