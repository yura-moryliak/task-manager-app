import {Component, EventEmitter, inject, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {map, Subscription} from 'rxjs';

import {TaskStateEnum} from '../../../commons/enums/task-state.enum';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';
import {TasksService} from '../../../commons/services/tasks.service';
import {TaskInterface} from '../../../commons/interfaces/task.interface';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';
import {TaskCreateUpdateComponent} from '../task-create-update/task-create-update.component';
import {UserInterface} from '../../../commons/interfaces/user.interface';

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
  @Output() toggledTask: EventEmitter<TaskInterface> = new EventEmitter<TaskInterface>();

  TaskStateEnum = TaskStateEnum;

  updateOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();
    const sidebarDataSubscription: Subscription = this.dynamicSidebarService
      .open({componentData: task, component: TaskCreateUpdateComponent})
      .pipe(map((data: unknown) => data as [TaskInterface, UserInterface]))
      .subscribe((data: [TaskInterface, UserInterface]): void => {

        const [updatedTask, assignee] = data;

        if (task.id === updatedTask.id) {
          task.assignee = assignee;
        }

      });

    this.subscriptions.add(sidebarDataSubscription);
  }

  deleteOne(event: Event, task: TaskInterface): void {
    // TODO Check for task in progress and if added assignee
    // TODO If yes => show dialog with error
    event.stopPropagation();
    this.tasksService.delete(task.id);
  }

  toggleOne(task: TaskInterface): void {
    this.toggledTask.emit(task);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
