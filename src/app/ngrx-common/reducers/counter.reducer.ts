import { Action, createReducer, on } from '@ngrx/store';
import * as counterActions from '../actions/counter.actions';

export interface CounterState {
    count: number;
}

export const initialState: CounterState = { count: 0 }

export const counterReducer = createReducer(
    initialState,
    on(counterActions.counterUp, (counterState) => {
        return { count: counterState.count+1 };
    }),
    on(counterActions.counterDown, (counterState) => {
        return { count: counterState.count-1 };
    })
)

export function reducer(state: CounterState | undefined, action: Action) {
    return counterReducer(state, action);
}