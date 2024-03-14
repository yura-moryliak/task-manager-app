import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from "rxjs";

import {TaskInterface} from "../interfaces/task.interface";
import {TaskStateEnum} from "../enums/task-state.enum";
import {DataStorageService} from "./data-storage.service";

export interface DataManageInterface<T> {
  getList(): T[];
  create(...args: any[]): void;
  update(...args: any[]): void;
  delete(...arg: any[]): void;
  deleteAll(...args: any[]): void;
  deleteSelected(...args: any[]): void;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService implements DataManageInterface<TaskInterface>{

  get tasksList$(): Observable<TaskInterface[]> {
    return this.tasksListBehaviorSubject.asObservable();
  }

  private tasksList: TaskInterface[] = [
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

  private dataStorageService: DataStorageService = inject(DataStorageService);
  private tasksListBehaviorSubject: BehaviorSubject<TaskInterface[]> = new BehaviorSubject<TaskInterface[]>(this.tasksList);

  getList(): TaskInterface[] {
    return this.tasksList;
  }

  create(model: TaskInterface): void {
    this.tasksList = [...this.tasksList, model];
    this.tasksListBehaviorSubject.next(this.tasksList);
  }

  update(taskId: number, updateModel: TaskInterface): void {
  }

  delete(taskId: number): void {
    this.tasksList = this.tasksList.filter((task) => task.id !== taskId);
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
