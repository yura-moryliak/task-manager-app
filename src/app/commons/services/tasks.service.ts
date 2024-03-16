import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {TaskInterface} from '../interfaces/task.interface';
import {TaskStateEnum} from '../enums/task-state.enum';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  get tasksList$(): Observable<TaskInterface[]> {
    return this.tasksListBehaviorSubject.asObservable();
  }

  // In memory store
  tasksList: TaskInterface[] = [
    {
      id: 1,
      name: 'Task 1',
      checked: false,
      description: 'Description for task 1',
      createdAt: new Date(),
      modifiedAt: null,
      state: TaskStateEnum.InQueue
    },
    {
      id: 2,
      name: 'Task 2',
      checked: false,
      description: 'Description for task 2',
      createdAt: new Date(),
      modifiedAt: null,
      state: TaskStateEnum.InQueue
    }
  ];

  private tasksListBehaviorSubject: BehaviorSubject<TaskInterface[]> =
    new BehaviorSubject<TaskInterface[]>(this.tasksList);

  create(createModel: Partial<TaskInterface>): void {
    createModel.id = Date.now();
    createModel.createdAt = new Date();
    createModel.modifiedAt = null;
    createModel.state = TaskStateEnum.InQueue;

    this.tasksList = [...this.tasksList, createModel as TaskInterface];
    this.tasksListBehaviorSubject.next(this.tasksList);
  }

  update(updateModel: TaskInterface): void {
    this.tasksList.map((task: TaskInterface): TaskInterface => {
      if (updateModel.id === task.id) {
        task = { ...task, ...updateModel };
        return task;
      }

      return task;
    });
    this.tasksListBehaviorSubject.next(this.tasksList);
  }

  delete(taskId: number): void {
    this.tasksList = this.tasksList.filter((task: TaskInterface): boolean => task.id !== taskId);
    this.tasksListBehaviorSubject.next(this.tasksList);
  }

  deleteAll(): void {
    this.tasksList = [];
    this.tasksListBehaviorSubject.next(this.tasksList);
  }

  deleteSelected(tasksList: TaskInterface[]): void {
    this.tasksList = this.tasksList.filter((task: TaskInterface) => !tasksList.includes(task));
    this.tasksListBehaviorSubject.next(this.tasksList);
  }
}
