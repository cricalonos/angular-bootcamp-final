import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToDo } from '../interfaces/todo.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TodoService {

  // Nombre de la colección donde se almacenarán los ToDo.
  collectionName = 'todos';

  /**
   * Constructor de la clase en el que se inyecta la dependencia a AngularFirestore.
   */
  constructor(private db: AngularFirestore) {
  }

  /**
   * Método empleado para obtener todos los registros de ToDo.
   */
  getToDo(): Observable<ToDo[]> {
    return this.db.collection<ToDo>(this.collectionName).valueChanges();
  }

  /**
   * Método empleado para agregar un nuevo ToDo a los registros.
   * @param todo, el ToDo a agregar. 
   */
  addToDo(todo: ToDo) {
    const id = this.db.createId();
    this.db
      .collection(this.collectionName)
      .doc(id)
      .set({ id, 'name': todo.name, 'status': todo.status });
  }

  /**
   * Método empleado para cambiar el estado a un ToDo.
   * @param todo, ToDo al que se le cambiará el estado.
   */
  changeStatusTodo(todo: ToDo) {
    this.db.collection(this.collectionName).doc(todo.id).set({ 'id': todo.id, 'name': todo.name, 'status': todo.status });
  }

  /**
   * Método empleado para eliminar un ToDo de los registros.
   * @param todo, ToDo a eliminar de los registros.
   */
  deleteTodo(todo: ToDo) {
    this.db.collection(this.collectionName).doc(todo.id).delete();
  }

  /**
   * Método empleado para eliminar los registros de los ToDo completados.
   * @param todoList Listado de los ToDo completado a eliminar de los registros.
   */
  clearCompleted(todoList: ToDo[]) {
    todoList.map(todo => {
      this.deleteTodo(todo);
    });
  }

  /**
   * Método empleado para cambiar el estado de un listado de ToDo.
   * @param status Nuevo estado que se asignará al listado de ToDo.
   * @param todoList Listado de ToDo a los que se les cambiará el estado.
   */
  changeStatusAll(status: boolean, todoList: ToDo[]) {
    todoList.map(todo => {
      this.db.collection(this.collectionName).doc(todo.id).set({ 'id': todo.id, 'name': todo.name, 'status': status });
    })
  }

}
