import {
  Component, ElementRef, inject, OnDestroy,
  OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {Subscription} from 'rxjs';

import {TaskInterface} from '../../commons/interfaces/task.interface';
import {TasksService} from '../../commons/services/tasks.service';
import {DynamicSidebarService} from '../../commons/services/dynamic-sidebar.service';
import {TaskCreateUpdateComponent} from './task-create-update/task-create-update.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit, OnDestroy {

  @ViewChild('toggleAllTasksElRef')
  private toggleAllTasksElRef: ElementRef<HTMLInputElement> | undefined;

  private tasksService: TasksService = inject(TasksService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  tasksList: TaskInterface[] = [];
  areAllTasksChecked: boolean | null = null;
  areSomeTasksCheckedToDelete: boolean = false;

  ngOnInit(): void {
    this.initTasksList();
  }

  toggleAll(): void {
    this.areAllTasksChecked = !this.areAllTasksChecked;

    this.tasksList.map((task: TaskInterface) => {
      task.checked = this.areAllTasksChecked as boolean;
      return task;
    });
  }

  toggleOne(task: TaskInterface): void {
    task.checked = !task.checked;

    const areSomeTasksUnChecked: boolean = this.tasksList.some((task: TaskInterface) => !task.checked);
    const areAllChecked: boolean = this.tasksList.every((task: TaskInterface) => task.checked);
    const areSomeTasksCheckedToDelete: boolean = this.tasksList.some((task: TaskInterface) => !task.checked);

    if (areSomeTasksUnChecked) {
      this.areAllTasksChecked = null;
      setTimeout(
          () => this.toggleAllTasksElRef!.nativeElement.checked = false,
          100
      );
    }

    if (areAllChecked && !this.areAllTasksChecked) {
      this.areAllTasksChecked = true;
      setTimeout(
          () => this.toggleAllTasksElRef!.nativeElement.checked = true,
          100
      );
    }

    if (areSomeTasksCheckedToDelete) {
      this.areSomeTasksCheckedToDelete = areSomeTasksCheckedToDelete;
    }
  }

  addNew(): void {
    this.tasksService.transferTaskToUpdate(null);
    this.dynamicSidebarService.open<TaskCreateUpdateComponent>(TaskCreateUpdateComponent);
  }

  updateOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();
    this.tasksService.transferTaskToUpdate(task);
    this.dynamicSidebarService.open<TaskCreateUpdateComponent>(TaskCreateUpdateComponent);
  }

  deleteOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();
    this.tasksService.delete(task.id);
  }

  deleteTasks(): void {
    if (this.areSomeTasksCheckedToDelete) {
      const tasksCheckedToDelete: TaskInterface[] = this.tasksList.filter((task: TaskInterface) => task.checked);
      this.tasksService.deleteSelected(tasksCheckedToDelete);
      this.areSomeTasksCheckedToDelete = false;
      return;
    }

    this.areAllTasksChecked = false;
    this.tasksService.deleteAll();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initTasksList(): void {
    const tasksDataSubscription: Subscription = this.tasksService.tasksList$.subscribe(
        (tasksList: TaskInterface[]) => {
          this.tasksList = tasksList;

          if (this.areAllTasksChecked) {
            this.updateTasksChecked();
          }
        });
    this.subscriptions.add(tasksDataSubscription);
  }

  private updateTasksChecked(): void {
    this.tasksList.map((task: TaskInterface) => {
      task.checked = true;
      return task;
    });
  }
}
