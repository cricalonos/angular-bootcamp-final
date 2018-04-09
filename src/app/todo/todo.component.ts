import { Component } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Observable } from 'rxjs/Observable';
import { ToDo } from '../interfaces/todo.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html'
})
export class TodoComponent {

  // Listado que contendrá todos los ToDo.
  todoList$: ToDo[];
  // Listado que contendrá los ToDo que serán mostrados.
  todoListShow: ToDo[];
  // Variable que representa el estado que será filtrado. 
  status: boolean;
  // Bandera que indica si se aplicará filtro a la lista.
  filter: boolean;
  // Contador de ToDo completos.
  toDoComplete: number;
  // Contador de ToDo por completar.
  toDoIncomplete: number;

  /**
   * Constructor del componente.
   * @param toDoService Inyección del servicio que se utilizará para comunicación con BD.
   */
  constructor(private toDoService: TodoService) {
    // Se realiza el llamado al método utilizado para consultar los ToDo.
    this.getTodo();
  }

  /**
   * Método que obtiene todos los ToDo y ejecuta el método de filtrado según el caso.
   */
  getTodo() {
    this.toDoService.getToDo().subscribe(content => {
      this.todoList$ = content;
      this.filter ?
        this.getTodoFilter(this.status) :
        this.getTodoAll();
      this.countToDo();
    });
  }

  /**
   * Método empleado para listar todos los ToDo sin aplicar filtro.
   */
  getTodoAll() {
    this.filter = false;
    this.todoListShow = this.todoList$;
  }

  /**
   * Método empleado para listar los ToDo según el filtro de estado enviado.
   * @param status Estado aplicado como filtro. true,  si son completos. false, si son ToDo incompletos.
   */
  getTodoFilter(status: boolean) {
    this.filter = true;
    this.status = status;
    this.todoListShow = this.todoList$.filter(todo => todo.status == this.status);
  }

  /**
   * Método empleado para eliminar los ToDo que se encuentran completos.
   */
  clearCompleted() {
    // Se aplica un filtro para seleccionar los ToDo que están completos.
    const clearList: ToDo[] = this.todoList$.filter(todo => todo.status == true);
    this.toDoService.clearCompleted(clearList);
  }

  /**
   * Método empleado para agregar un elemento más a la lista de ToDo.
   * @param input Input que contiene la información del ToDo a registrar.
   */
  addTodo(input: HTMLInputElement) {
    const todo: ToDo = {
      'id': '',
      'name': input.value,
      'status': false
    }
    this.toDoService.addToDo(todo);
    input.value = null;
  }

  /**
   * Método empleado para cambiar el estado a un ToDo.
   * @param id Id del Todo a completar.
   * @param name Nombre del ToDo a completar.
   * @param status Nuevo estado que se asignará al ToDo.
   */
  changeStatusTodo(id: string, name: string, status: boolean) {
    const todo: ToDo = {
      'id': id,
      'name': name,
      'status': status
    }
    this.toDoService.changeStatusTodo(todo);
  }

  /**
   * Método empleado para eliminar un ToDo según su Id.
   * @param id Id del ToDo a eliminar.
   */
  deleteTodo(id: string) {
    const todo: ToDo = {
      'id': id,
      'name': '',
      'status': null
    }
    this.toDoService.deleteTodo(todo);
  }

  /**
   * Método empleado para realizar el conteo de los ToDo completos e incompletos.
   */
  countToDo() {
    // Se reinician los contadores.
    this.toDoComplete = 0;
    this.toDoIncomplete = 0;
    this.todoList$.map(todo => {
      // Se realiza la sumatoria según el estado del ToDo.
      todo.status ? this.toDoComplete++ : this.toDoIncomplete++;
    });
  }

  /**
   * Método empleado para cambiar el estado de todos los ToDo.
   */
  changeStatusAll() {
    // Se valida si falta algún ToDo por completar.
    this.toDoIncomplete > 0 ?
      // Si todos los ToDo están completos se les cambia el estado.  
      this.toDoService.changeStatusAll(true, this.todoList$.filter(todo => todo.status == false)) :
      // Si algún ToDo está incompleto se completa.
      this.toDoService.changeStatusAll(false, this.todoList$.filter(todo => todo.status == true));
  }

}
