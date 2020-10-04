import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addTodo } from 'src/app/ngrx-common/actions';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.sass']
})
export class AddTodoComponent implements OnInit {

  todoForm = new FormGroup({
    todoText: new FormControl(''),
    dueDate: new FormControl('')
  });


  constructor(private _store: Store) { }

  ngOnInit(): void {

  }

  onSubmit() {
    let addTodoAction = addTodo({
      todoText: this.todoForm.get('todoText').value,
    })

    this._store.dispatch(addTodoAction);
    this.todoForm.reset();
  }

}
