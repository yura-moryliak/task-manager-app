import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {Subscription} from 'rxjs';

import {TasksService} from '../../../commons/services/tasks.service';
import {TaskStateEnum} from '../../../commons/enums/task-state.enum';
import {TaskInterface} from '../../../commons/interfaces/task.interface';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';
import {TaskStateBadgesComponent} from '../task-state-badges/task-state-labels.component';
import {TaskStateBadgeInterface} from '../../../commons/interfaces/task-state-badge.interface';
import {TaskCreateUpdateFormInterface} from '../../../commons/interfaces/task-create-update-form-group.interface';

@Component({
  selector: 'app-task-create-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskStateBadgesComponent],
  templateUrl: './task-create-update.component.html',
  styleUrls: ['./task-create-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCreateUpdateComponent implements OnInit, OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  private taskStateBadge: TaskStateBadgeInterface | undefined;

  form: FormGroup<TaskCreateUpdateFormInterface> = new FormGroup<TaskCreateUpdateFormInterface>({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required)
  });
  isUpdateMode: boolean = false;
  taskToUpdate: TaskInterface | undefined;

  ngOnInit(): void {
    this.initUpdateTask();
  }

  createTask(): void {
    this.tasksService.create(this.form.value as Partial<TaskInterface>);
    this.dynamicSidebarService.close();
  }

  selectedTaskState(taskState: TaskStateBadgeInterface): void {
    this.taskStateBadge = taskState;
  }

  updateTask(): void {
    if (!this.taskToUpdate) {
      return;
    }

    this.taskToUpdate.name = this.form.value.name as string;
    this.taskToUpdate.description = this.form.value.description as string;
    this.taskToUpdate.modifiedAt = new Date();

    this.dynamicSidebarService.close();

    if (this.taskStateBadge && !this.taskStateBadge?.selected) {
      this.taskToUpdate.state = TaskStateEnum.InQueue;
      return;
    }

    if (this.taskStateBadge) {
      this.taskToUpdate.state = this.taskStateBadge.state;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initUpdateTask(): void {
    const updateTaskDataSubscription: Subscription = this.tasksService.taskToUpdate$.subscribe((task: TaskInterface | undefined) => {
      if (task) {
        this.isUpdateMode = true;
        this.taskToUpdate = task;
        this.form.setValue({ name: task.name, description: task.description });
      }
    });
    this.subscriptions.add(updateTaskDataSubscription);
  }
}
