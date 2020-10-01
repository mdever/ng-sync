import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { POUCHDB_TOKEN } from '../app.module';
import { counterDown, counterUp } from '../ngrx-common/actions';
import { selectCount } from '../ngrx-common/selectors/counter.selector';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  constructor(private _store: Store, @Inject(POUCHDB_TOKEN) pouchdb: any) { 
    this._pouchdb = pouchdb;
  }

  private _pouchdb: any;
  count$: Observable<number>;
  name: string;
  purpose: string;
  docs: any;

  ngOnInit(): void {
    this.count$ = this._store.select(selectCount);
  }

  increaseCount(): void {
    this._store.dispatch(counterUp());
  }

  decreaseCount(): void {
    this._store.dispatch(counterDown());
  }

  addNewItem() {
    if (this.name === '' || this.purpose === '') {
      console.log('must add name and purpose');
    }
    this._pouchdb.post({name: this.name, purpose: this.purpose});
  }

  refreshItems() {
    this._pouchdb.allDocs({include_docs: true}).then((docs) => {
      this.docs = docs.rows;
    })
  }

}
