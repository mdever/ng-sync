import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers';
import { CounterState } from '../reducers/counter.reducer';

export const selectCounterState = (state: AppState) => state.counter;

export const selectCount = createSelector(
    selectCounterState,
    (state: CounterState) => state.count
);