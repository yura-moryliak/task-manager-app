import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TaskStateEnum} from '../../../commons/enums/task-state.enum';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';
import {TaskStateBadgeInterface} from '../../../commons/interfaces/task-state-badge.interface';

@Component({
  selector: 'app-task-state-badges',
  standalone: true,
  imports: [CommonModule, TaskStatePipe],
  templateUrl: './task-state-badges.component.html',
  styleUrls: ['./task-state-badges.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskStateBadgesComponent implements OnInit {

  @Input() initialBadgeState: TaskStateEnum = TaskStateEnum.InQueue;
  @Output() selectedBadge: EventEmitter<TaskStateBadgeInterface> = new EventEmitter<TaskStateBadgeInterface>();

  tasksStateBadgesList: TaskStateBadgeInterface[] = [
    {
      name: 'In Queue',
      state: TaskStateEnum.InQueue,
      selected: false
    },
    {
      name: 'In Progress',
      state: TaskStateEnum.InProgress,
      selected: false
    },
    {
      name: 'Done',
      state: TaskStateEnum.Done,
      selected: false
    }
  ];
  TaskStateEnum = TaskStateEnum;

  ngOnInit(): void {
    this.tasksStateBadgesList.map((badge: TaskStateBadgeInterface): TaskStateBadgeInterface => {

      if (badge.state === this.initialBadgeState) {
        badge.selected = true;
        return badge;
      }

      return badge;
    });
  }

  selectBadge(index: number): void {
    if (this.tasksStateBadgesList[index].selected) {
      this.tasksStateBadgesList[index].selected = false;
      this.selectedBadge.emit(this.tasksStateBadgesList[index]);
    } else {
      this.tasksStateBadgesList.forEach((badge: TaskStateBadgeInterface, labelIndex: number): void => {
        if (labelIndex !== index) {
          badge.selected = false;
        }
      });

      this.tasksStateBadgesList[index].selected = true;
      this.selectedBadge.emit(this.tasksStateBadgesList[index]);
    }
  }
}
