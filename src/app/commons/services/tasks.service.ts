import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {UsersService} from './users.service';
import {TaskStateEnum} from '../enums/task-state.enum';
import {TaskInterface} from '../interfaces/task.interface';
import {UserInterface} from '../interfaces/user.interface';

import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  get tasksList$(): Observable<TaskInterface[]> {
    return this.tasksListBehaviorSubject.asObservable();
  }

  // In memory store
  private tasksList: TaskInterface[] = environment.isDemo ?
    [] :
    [
      {
        id: 1,
        name: 'Task 1',
        disabled: false,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        createdAt: new Date(),
        modifiedAt: null,
        state: TaskStateEnum.InQueue
      },
      {
        id: 2,
        name: 'Task 2',
        disabled: false,
        description: 'Description for task 2',
        createdAt: new Date(),
        modifiedAt: null,
        state: TaskStateEnum.InQueue
      },
      {
        id: 3,
        name: 'Task 3',
        disabled: false,
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

  assignUserToTask(taskId: number, userId: number): void {
    const taskIndex: number = this.tasksList.findIndex((task: TaskInterface): boolean => task.id === taskId);
    const userIndex: number = this.usersService.usersList.findIndex((user: UserInterface): boolean => user.id === userId);

    if (taskIndex === -1 || userIndex === -1) {
      return;
    }

    const task: TaskInterface = this.tasksList[taskIndex];
    const user: UserInterface = this.usersService.usersList[userIndex];

    // Remove user from any other task if already assigned
    this.tasksList.forEach((task: TaskInterface): void => {
      if (task.assignee && task.assignee.id === userId && task.id !== taskId) {
        task.assignee = undefined;
      }
    });

    // Assign the user to the task
    task.assignee = user;
    this.update(task);

    // Avoid circular copying for task
    const {assignee, ...pureTask} = task;
    user.task = pureTask;
    this.usersService.update(user);
  }


}
