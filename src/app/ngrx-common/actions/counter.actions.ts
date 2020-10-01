import { createAction, props } from '@ngrx/store';

export const counterUp = createAction(
    '[Counter] Up'
);

export const counterDown = createAction(
    '[Counter] Down'
);