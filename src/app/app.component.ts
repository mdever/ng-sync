import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { POUCHDB_OBSERVABLE_TOKEN, RehydrateFromRemote } from './app.module';
import { filter, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-sync';

  constructor(@Inject(POUCHDB_OBSERVABLE_TOKEN) pouchdb$: Observable<any>, private _store: Store) {
    pouchdb$.pipe(
      filter(pouchdb => !!pouchdb),
      take(1)
    ).subscribe(pouchdb => {
      this._store.dispatch(new RehydrateFromRemote(pouchdb, _store));
    });
  }
}
