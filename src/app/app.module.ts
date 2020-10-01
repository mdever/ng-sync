import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './ngrx-common/reducers';
import { CounterModule } from './counter/counter.module';

import * as PouchDB from 'pouchdb-browser';

let localdb = null;
let remotedb = null;

export const POUCHDB_TOKEN = new InjectionToken<any>('pouchdb.token');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const SESSION_ID_KEY = 'sessionid';
const SESSION_ID_PREFIX = 'user-session-';

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
  }
}

function localdbFactory() {
  return localdb;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    CounterModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initPouchDB, multi: true },
    { provide: POUCHDB_TOKEN, useFactory: localdbFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
