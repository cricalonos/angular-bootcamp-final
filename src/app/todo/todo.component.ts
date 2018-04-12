import { Component } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Observable } from 'rxjs/Observable';
import { ToDo } from '../shared/todo.interface';

/**
 * Clase encargada de la gestión del componente ToDo.
 */
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
      // Se valida si se está empleando un filtro actualmente.
      this.filter ?
        this.getTodoFilter(this.status) :
        this.getTodoAll();
      // Se realiza el conteo de los ToDo
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
    // Se asigna al listado que será mostrado los ToDo que cumplan con el filtro.
    this.todoListShow = this.todoList$.filter(todo => todo.status === this.status);
  }

  /**
   * Método empleado para eliminar los ToDo que se encuentran completos.
   */
  clearCompleted() {
    // Se aplica un filtro para seleccionar los ToDo que están completos.
    const clearList: ToDo[] = this.todoList$.filter(todo => todo.status === true);
    this.toDoService.clearCompleted(clearList);
  }

  /**
   * Método empleado para agregar un elemento más a la lista de ToDo.
   * @param input Input que contiene la información del ToDo a registrar.
   */
  addTodo(input: HTMLInputElement) {
    // Se valida que el input no esté vacío.
    if (input.value !== '') {
      // Se crea el ToDo y se envía al servicio de registro.
      this.toDoService.addToDo(input.value);
      input.value = null;
    }
  }

  /**
   * Método empleado para cambiar el estado a un ToDo.
   * @param todo ToDo al que se le cambiará el estado.
   * @param status Nuevo estado que se asignará al ToDo.
   */
  changeStatusTodo(todo: ToDo, status: boolean) {
    todo.status = status;
    this.toDoService.changeStatusTodo(todo);
  }

  /**
   * Método empleado para eliminar un ToDo según su Id.
   * @param id Id del ToDo a eliminar.
   */
  deleteTodo(todo: ToDo) {
    this.toDoService.deleteTodo(todo);
  }

  /**
   * Método empleado para realizar el conteo de los ToDo completos e incompletos.
   */
  countToDo() {
    // Se reinician los contadores.
    this.toDoComplete = 0;
    this.toDoIncomplete = 0;
    // Se recorre el listado completo de los ToDo.
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
