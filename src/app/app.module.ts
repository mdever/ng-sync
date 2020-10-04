import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Action, ActionReducer, Store, StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './ngrx-common/reducers';
import { CounterModule } from './counter/counter.module';

import * as PouchDB from 'pouchdb-browser';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TodoModule } from './todo/todo.module';

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
    remotedb = new PouchDB('http://localhost:5984/user_sessions', {
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
  constructor(public doneObs: Subject<any>) {}
}

export class RemoteStateReceived implements Action {
  type = REMOTE_STATE_RECEIVED;
  constructor(public remoteState: any) { }
}

function pouchdbMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {

  let rev;
  let documentName = null;
  return function(state, action: Action) {
    if (documentName === null) {
      documentName = localStorage.getItem(SESSION_ID_KEY);
    }
    let nextState;
    let pouchdb = localdbFactory();
    console.log('Current action is: ');
    console.log(action);
    console.log('Current state is: ');
    console.log(state);
    if (action.type === REHYDRATE_FROM_REMOTE) {
      let done$ = (<RehydrateFromRemote> action).doneObs;
      nextState = reducer(state, action);
      pouchdb.get(documentName).then(savedState => {
        done$.next(savedState);
      }, err => {
        console.log('could not retrieve');
        pouchdb.put({_id: documentName, ...nextState});
      });

    } else if (action.type === REMOTE_STATE_RECEIVED) {
      nextState = (<RemoteStateReceived> action).remoteState;
      rev = nextState._rev;

    } else if (pouchdb) {
      console.log('pouchdb exists');
      nextState = reducer(state, action);
      pouchdb.get(documentName).then(previousState => {
        let nextRemote = {_id: documentName, _rev: previousState._rev, ...nextState };
        pouchdb.put(nextRemote);
      });
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
    CounterModule,
    TodoModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initPouchDB, multi: true },
    { provide: POUCHDB_TOKEN, useFactory: localdbFactory }, // We have to use useFactory because if we used `useValue: localdb`, then localdb would be null at the time this exeecutes
    { provide: POUCHDB_OBSERVABLE_TOKEN, useValue: pouchdb$ }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
