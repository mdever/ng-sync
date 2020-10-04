import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoListComponent } from './todo-list/todo-list.component';



@NgModule({
  declarations: [AddTodoComponent, TodoListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddTodoComponent, TodoListComponent]
})
export class TodoModule { }
