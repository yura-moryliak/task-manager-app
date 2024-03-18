import {Component, inject, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {map, Subscription} from 'rxjs';

import {TaskStateEnum} from '../../../commons/enums/task-state.enum';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';
import {TasksService} from '../../../commons/services/tasks.service';
import {TaskInterface} from '../../../commons/interfaces/task.interface';
import {UserInterface} from '../../../commons/interfaces/user.interface';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';
import {TaskCreateUpdateComponent} from '../task-create-update/task-create-update.component';

@Component({
  selector: 'app-task-table-row',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatePipe],
  templateUrl: './task-table-row.component.html',
  styleUrls: ['./task-table-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskTableRowComponent implements OnDestroy {

  private tasksService: TasksService = inject(TasksService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  @Input({required: true}) task: TaskInterface | undefined;

  TaskStateEnum = TaskStateEnum;

  updateOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();

    const closeSidebarDataSubscription: Subscription = this.dynamicSidebarService.open({componentData: task, component: TaskCreateUpdateComponent})
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
    this.tasksService.delete(task.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
