import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {Subscription} from "rxjs";

import {TasksService} from "../../../commons/services/tasks.service";
import {TaskInterface} from "../../../commons/interfaces/task.interface";
import {DynamicSidebarService} from "../../../commons/services/dynamic-sidebar.service";
import {TaskCreateUpdateFormInterface} from "../../../commons/interfaces/task-create-update-form-group.interface";

@Component({
  selector: 'app-task-create-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-create-update.component.html',
  styleUrls: ['./task-create-update.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCreateUpdateComponent implements OnInit, OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  private taskToUpdate: TaskInterface | undefined;

  form: FormGroup<TaskCreateUpdateFormInterface> = new FormGroup<TaskCreateUpdateFormInterface>({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required)
  });
  isUpdateMode: boolean = false;

  ngOnInit(): void {
    this.initUpdateTask();
  }

  createTask(): void {
    this.tasksService.create(this.form.value as Partial<TaskInterface>);
    this.dynamicSidebarService.close();
  }

  updateTask(): void {
    if (!this.taskToUpdate) {
      return;
    }

    this.taskToUpdate.name = this.form.value.name as string;
    this.taskToUpdate.description = this.form.value.description as string;
    this.taskToUpdate.modifiedAt = new Date();

    this.tasksService.update(this.taskToUpdate);
    this.dynamicSidebarService.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initUpdateTask(): void {
    const updateTaskDataSubscription: Subscription = this.tasksService.taskToUpdate$.subscribe((task: TaskInterface | null) => {
      if (task) {
        this.isUpdateMode = true;
        this.taskToUpdate = task;
        this.form.setValue({ name: task.name, description: task.description });
      }
    });
    this.subscriptions.add(updateTaskDataSubscription);
  }
}
