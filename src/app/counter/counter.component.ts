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

  constructor(private _store: Store) { }

  count$: Observable<number>;

  ngOnInit(): void {
    this.count$ = this._store.select(selectCount);
  }

  increaseCount(): void {
    this._store.dispatch(counterUp());
  }

  decreaseCount(): void {
    this._store.dispatch(counterDown());
  }
}
