import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {TaskInterface} from '../interfaces/task.interface';
import {TaskStateEnum} from '../enums/task-state.enum';
import {UsersService} from './users.service';
import {UserInterface} from '../interfaces/user.interface';

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
    },
    {
      id: 3,
      name: 'Task 3',
      checked: false,
      description: 'Description for task 3',
      createdAt: new Date(),
      modifiedAt: null,
      state: TaskStateEnum.InQueue
    }
  ];

  private usersService: UsersService = inject(UsersService);

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
        task = updateModel;
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

  assignUserToTask(taskId: number, userId: number): void {
    const task: TaskInterface | undefined = this.tasksList.find(
      (task: TaskInterface): boolean => task.id === taskId
    );
    const user: UserInterface | undefined = this.usersService.usersList.find(
      (user: UserInterface): boolean => user.id === userId);

    if (!task || !user) {
      return;
    }

    const previousTaskOfUser: TaskInterface | undefined = this.tasksList.find(
      (task: TaskInterface): boolean => task.assignee?.id === userId
    );

    if (previousTaskOfUser && previousTaskOfUser.id !== taskId) {
      this.clearUserFromTask(previousTaskOfUser.id);
    }

    task.assignee = user;

    // Avoid circular assignment for task
    const { assignee, ...pureTask } = task;
    user.task = pureTask;
  }

  clearUserFromTask(taskId: number): void {
    const task: TaskInterface | undefined = this.tasksList.find(
      (task: TaskInterface): boolean => task.id === taskId
    );

    if (!task) {
      return;
    }

    task.assignee = undefined;
  }
}
