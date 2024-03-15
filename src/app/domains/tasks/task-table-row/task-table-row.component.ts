import {Component, EventEmitter, inject, Input, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TaskStateEnum} from '../../../commons/enums/task-state.enum';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';
import {TaskInterface} from '../../../commons/interfaces/task.interface';
import {TasksService} from '../../../commons/services/tasks.service';
import {TaskCreateUpdateComponent} from '../task-create-update/task-create-update.component';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';

@Component({
  selector: 'app-task-table-row',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatePipe],
  templateUrl: './task-table-row.component.html',
  styleUrls: ['./task-table-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskTableRowComponent {

  private tasksService: TasksService = inject(TasksService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);

  @Input({ required: true }) task: TaskInterface | undefined;
  @Output() toggledTask: EventEmitter<TaskInterface> = new EventEmitter<TaskInterface>();

  TaskStateEnum = TaskStateEnum;

  updateOne(event: Event, task: TaskInterface): void {
    event.stopPropagation();
    this.tasksService.transferTaskToUpdate(task);
    this.dynamicSidebarService.open<TaskCreateUpdateComponent>(TaskCreateUpdateComponent);
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
}
