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

function logReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log("Processing action: ");
    console.log(action);
    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logReducer] : [];
