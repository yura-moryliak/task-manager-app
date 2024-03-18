import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {Subscription} from 'rxjs';

import {DeviceDetectorService} from "ngx-device-detector";

import {TaskCardComponent} from './task-card/task-card.component';
import {TaskStatePipe} from '../../commons/pipes/task-state.pipe';
import {TasksService} from '../../commons/services/tasks.service';
import {TaskInterface} from '../../commons/interfaces/task.interface';
import {TaskTableRowComponent} from './task-table-row/task-table-row.component';
import {DynamicSidebarService} from '../../commons/services/dynamic-sidebar.service';
import {TaskCreateUpdateComponent} from './task-create-update/task-create-update.component';
import {TaskStateEnum} from "../../commons/enums/task-state.enum";
import {UsersService} from "../../commons/services/users.service";
import {UserInterface} from "../../commons/interfaces/user.interface";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatePipe, TaskTableRowComponent, TaskCardComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TasksComponent implements OnInit, OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private usersService: UsersService = inject(UsersService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private deviceDetectorService: DeviceDetectorService = inject(DeviceDetectorService);
  private subscriptions: Subscription = new Subscription();

  isDeviceMobile: boolean = this.deviceDetectorService.isMobile(this.deviceDetectorService.userAgent);
  tasksList: TaskInterface[] = [];
  isDeleteAllButtonDisabled: boolean = false;

  trackByTaskId = (index: number, task: TaskInterface) => task.id;

  ngOnInit(): void {
    this.initTasksList();
  }

  deleteAll(): void {
    const areAllTasksDone: boolean = this.tasksList.every((task: TaskInterface): boolean => task.state === TaskStateEnum.Done);

    if (areAllTasksDone) {
      this.tasksList.forEach((task: TaskInterface) => {
        const { assignee, ...pureTask } = task;

        if (!assignee) {
          return;
        }

        assignee.task = undefined;
        this.usersService.update(assignee);
      });

      this.tasksService.deleteAll();
      return;
    }

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
