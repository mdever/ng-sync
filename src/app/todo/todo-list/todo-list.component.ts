import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from 'src/app/ngrx-common/reducers/todos.reducer';
import { selectAllTodos } from 'src/app/ngrx-common/selectors/todos.selector';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.sass']
})
export class TodoListComponent implements OnInit {

  todos$: Observable<Todo[]>

  constructor(private _store: Store) { }

  ngOnInit(): void {
    this.todos$ = this._store.select(selectAllTodos)
  }

}
