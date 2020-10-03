import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Action, ActionReducer, Store, StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './ngrx-common/reducers';
import { CounterModule } from './counter/counter.module';

import * as PouchDB from 'pouchdb-browser';
import { Observable, ReplaySubject, Subject } from 'rxjs';

let localdb = null;
let remotedb = null;

export const POUCHDB_TOKEN = new InjectionToken<any>('pouchdb.token');
export const POUCHDB_OBSERVABLE_TOKEN = new InjectionToken<any>('pouchdb.observable.token');
export const DB_NAME = 'thesession'
export const REHYDRATE_FROM_REMOTE = '[Init] Hydrate From Remote';
export const REMOTE_STATE_RECEIVED = '[Init] Remote State Received';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const SESSION_ID_KEY = 'sessionid';
const SESSION_ID_PREFIX = 'user-session-';

const pouchdb$ = new ReplaySubject<any>();

function initPouchDB() {
  return () => {
    let sessionId = null;
    if (localStorage.getItem(SESSION_ID_KEY)) {
      sessionId = localStorage.getItem(SESSION_ID_KEY);
    } else {
      sessionId = SESSION_ID_PREFIX + uuidv4();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    localdb = new PouchDB(sessionId);
    remotedb = new PouchDB('http://localhost:5984/' + sessionId, {
      ajax: {
        headers: {
          Authorization: 'Basic ' + window.btoa('admin' + ':' + 'password')
        }
      }
    });
    localdb.sync(remotedb);
    pouchdb$.next(localdb);
  }
}

function localdbFactory() {
  return localdb;
}

const INIT_ACTION = '@ngrx/store/init';
const UPDATE_ACTION = '@ngrx/store/update-reducers';

export class RehydrateFromRemote implements Action {
  type = REHYDRATE_FROM_REMOTE;
  constructor(public pouchdb: any, public store: Store) {}
}

export class RemoteStateReceived implements Action {
  type = REMOTE_STATE_RECEIVED;
  constructor(public remoteState: any) { }
}

function pouchdbMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {

  return function(state, action: Action) {
    let nextState;
    let pouchdb = localdbFactory();
    console.log('Current action is: ');
    console.log(action);
    console.log('Current state is: ');
    console.log(state);
    if (action.type === REHYDRATE_FROM_REMOTE) {
      pouchdb = (<RehydrateFromRemote> action).pouchdb;
      let store = (<RehydrateFromRemote> action).store;
      
      pouchdb.get(DB_NAME).then(savedState => {
        store.dispatch(new RemoteStateReceived(savedState));
      });

    } else if (action.type === REMOTE_STATE_RECEIVED) {
      nextState = (<RemoteStateReceived> action).remoteState.doc;

    } else if (pouchdb) {
      console.log('pouchdb exists');
      nextState = reducer(state, action);
      pouchdb.put(JSON.parse(JSON.stringify({_id: DB_NAME, ...nextState})));
    } else {
      nextState = reducer(state, action);
    }

    return nextState;
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers: [...metaReducers, pouchdbMetaReducer] 
    }),
    CounterModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initPouchDB, multi: true },
    { provide: POUCHDB_TOKEN, useFactory: localdbFactory }, // We have to use useFactory because if we used `useValue: localdb`, then localdb would be null at the time this exeecutes
    { provide: POUCHDB_OBSERVABLE_TOKEN, useValue: pouchdb$ }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
