import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromTodos from './todos.reducer';
import * as fromCounter from './counter.reducer';

export interface AppState {
  todos: fromTodos.TodoState;
  counter: fromCounter.CounterState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodos.reducer,
  counter: fromCounter.reducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
