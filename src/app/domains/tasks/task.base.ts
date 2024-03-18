import {Component, inject, Input, OnDestroy} from '@angular/core';

import {map, Subscription} from 'rxjs';

import {TaskStateEnum} from '../../commons/enums/task-state.enum';
import {TasksService} from '../../commons/services/tasks.service';
import {UsersService} from '../../commons/services/users.service';
import {UserInterface} from '../../commons/interfaces/user.interface';
import {TaskInterface} from '../../commons/interfaces/task.interface';
import {DynamicSidebarService} from '../../commons/services/dynamic-sidebar.service';
import {TaskCreateUpdateComponent} from './task-create-update/task-create-update.component';

@Component({
  selector: 'app-task-base',
  template: ''
})
export abstract class TaskBase implements OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private userService: UsersService = inject(UsersService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  @Input({required: true}) task: TaskInterface | undefined;

  TaskStateEnum = TaskStateEnum;

  updateOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();

    const closeSidebarDataSubscription: Subscription = this.dynamicSidebarService.open({
      componentData: task,
      component: TaskCreateUpdateComponent
    })
      .pipe(map((data) => data as UserInterface))
      .subscribe((user: UserInterface | undefined): void => {

        if (!user || !this.task) {
          return;
        }

        this.tasksService.assignUserToTask(task.id, user.id);
      });
    this.subscriptions.add(closeSidebarDataSubscription);
  }

  deleteOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();

    if (task.state === TaskStateEnum.Done && !!task.assignee) {
      this.tasksService.delete(task.id);
      task.assignee.task = undefined;
      this.userService.update(task.assignee);
      return;
    }

    this.tasksService.delete(task.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
