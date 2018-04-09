import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToDo } from '../interfaces/todo.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TodoService {

  collectionName = 'todos';

  constructor(private db: AngularFirestore) {
  }

  getToDo(): Observable<ToDo[]> {
    return this.db.collection<ToDo>(this.collectionName).valueChanges();
  }

  addToDo(todo: ToDo) {
    const id = this.db.createId();
    this.db
      .collection(this.collectionName)
      .doc(id)
      .set({ id, 'name': todo.name, 'status': todo.status });
  }

  changeStatusTodo(todo: ToDo) {
    this.db.collection(this.collectionName).doc(todo.id).set({ 'id': todo.id, 'name': todo.name, 'status': todo.status });
  }

  deleteTodo(todo: ToDo) {
    this.db.collection(this.collectionName).doc(todo.id).delete();
  }

  clearCompleted(todoList: ToDo[]) {
    todoList.map(todo => {
      this.db.collection(this.collectionName).doc(todo.id).delete();
    });
  }

}
