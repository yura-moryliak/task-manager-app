import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {map, Subscription} from 'rxjs';

import {TasksService} from '../../../commons/services/tasks.service';
import {UsersService} from '../../../commons/services/users.service';
import {TaskStateEnum} from '../../../commons/enums/task-state.enum';
import {TaskInterface} from '../../../commons/interfaces/task.interface';
import {UserInterface} from '../../../commons/interfaces/user.interface';
import {UserSelectComponent} from '../../users/user-select/user-select.component';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';
import {TaskStateBadgesComponent} from '../task-state-badges/task-state-badges.component';
import {TaskStateBadgeInterface} from '../../../commons/interfaces/task-state-badge.interface';
import {TaskCreateUpdateFormInterface} from '../../../commons/interfaces/task-create-update-form-group.interface';

@Component({
  selector: 'app-task-create-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskStateBadgesComponent, UserSelectComponent],
  templateUrl: './task-create-update.component.html',
  styleUrls: ['./task-create-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCreateUpdateComponent implements OnInit, OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private usersService: UsersService = inject(UsersService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  private taskStateBadge: TaskStateBadgeInterface | undefined;

  form: FormGroup<TaskCreateUpdateFormInterface> = new FormGroup<TaskCreateUpdateFormInterface>({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required)
  });
  isUpdateMode: boolean = false;
  taskToUpdate: TaskInterface | undefined;
  assignee: UserInterface | undefined;

  showErrorWhenNoUserAssignedToTask: boolean = false;

  ngOnInit(): void {
    this.initUpdateTask();
  }

  createTask(): void {
    this.tasksService.create(this.form.value as Partial<TaskInterface>);
    this.dynamicSidebarService.close();
  }

  selectedTaskState(taskState: TaskStateBadgeInterface): void {
    this.taskStateBadge = taskState;

    const isTaskInProgressOrDone =
      taskState.state === TaskStateEnum.InProgress ||
      taskState.state === TaskStateEnum.Done;

    this.showErrorWhenNoUserAssignedToTask = !this.assignee && isTaskInProgressOrDone;
  }

  selectedUser(user: UserInterface | undefined): void {
    const isTaskInProgressOrDone: boolean =
      this.taskStateBadge?.state === TaskStateEnum.InProgress ||
      this.taskStateBadge?.state === TaskStateEnum.Done;

    if (user && user.task && user.task.id === this.taskToUpdate?.id) {
      this.assignee = user;
      return;
    }

    if (!user && isTaskInProgressOrDone) {
      this.showErrorWhenNoUserAssignedToTask = true;
    }

    if (!user && !isTaskInProgressOrDone) {
      this.showErrorWhenNoUserAssignedToTask = true;
      this.assignee = undefined;
      return;
    }

    if (user && isTaskInProgressOrDone) {
      this.showErrorWhenNoUserAssignedToTask = false;
    }

    this.assignee = user;
  }

  updateTask(): void {
    if (!this.taskToUpdate) {
      return;
    }

    this.taskToUpdate.name = <string>this.form.value.name;
    this.taskToUpdate.description = <string>this.form.value.description;
    this.taskToUpdate.modifiedAt = new Date();

    if (this.taskStateBadge) {
      this.taskToUpdate.state = this.taskStateBadge.state;

      if (this.taskToUpdate.state === TaskStateEnum.InQueue || this.taskToUpdate.state === TaskStateEnum.Done) {
        this.taskToUpdate.disabled = false;
      }

      if (this.taskToUpdate.state === TaskStateEnum.InProgress) {
        this.taskToUpdate.disabled = true;
      }
    }

    if (!this.assignee) {
      // REQUIREMENT: A task which is not assigned to any user can take 'in queue' state only.
      if (this.taskToUpdate && this.taskToUpdate.state === TaskStateEnum.InProgress) {
        this.taskToUpdate.state = TaskStateEnum.InQueue;
        this.taskToUpdate.disabled = false;
      }

      this.taskToUpdate.assignee = undefined;
      this.usersService.removeTaskFromUser(this.taskToUpdate.id);
      this.dynamicSidebarService.close();
      return;
    }

    this.taskToUpdate.assignee = this.assignee;
    this.dynamicSidebarService.close(this.assignee);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initUpdateTask(): void {
    const dataSubscription: Subscription = this.dynamicSidebarService.data$
      .pipe(map((data) => data as TaskInterface))
      .subscribe((task: TaskInterface): void => {
      if (task) {
        this.isUpdateMode = true;
        this.taskToUpdate = task;
        this.form.setValue({ name: task.name, description: task.description });
      }
    });
    this.subscriptions.add(dataSubscription);
  }
}
