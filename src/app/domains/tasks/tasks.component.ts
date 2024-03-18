import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {Subscription} from 'rxjs';

import {TaskStatePipe} from '../../commons/pipes/task-state.pipe';
import {TasksService} from '../../commons/services/tasks.service';
import {TaskInterface} from '../../commons/interfaces/task.interface';
import {TaskTableRowComponent} from './task-table-row/task-table-row.component';
import {DynamicSidebarService} from '../../commons/services/dynamic-sidebar.service';
import {TaskCreateUpdateComponent} from './task-create-update/task-create-update.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatePipe, TaskTableRowComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit, OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  tasksList: TaskInterface[] = [];
  isDeleteAllButtonDisabled: boolean = false;

  trackByTaskId = (index: number, task: TaskInterface) => task.id;

  ngOnInit(): void {
    this.initTasksList();
  }

  deleteAll(): void {
    this.tasksService.deleteAll();
  }

  addNew(): void {
    this.dynamicSidebarService.open({component: TaskCreateUpdateComponent})
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initTasksList(): void {
    const tasksDataSubscription: Subscription = this.tasksService.tasksList$.subscribe(
      (tasksList: TaskInterface[]): void => {
        this.tasksList = tasksList;
        this.isDeleteAllButtonDisabled = this.tasksList.some((task: TaskInterface) => task.disabled);
      });
    this.subscriptions.add(tasksDataSubscription);
  }
}
