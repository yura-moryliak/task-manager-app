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
  @Input() disableId: string | undefined;
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

  trackByIndex = (index: number) => {
    return index;
  }

  ngOnInit(): void {
    this.initialSelection();
  }

  selectBadge(badge: TaskStateBadgeInterface, index: number): void {
    this.tasksStateBadgesList.forEach((badgeItem: TaskStateBadgeInterface, badgeIndex: number): void => {
      if (index !== badgeIndex) {
        badgeItem.selected = false;
      }
    });

    badge.selected = true;
    this.selectedBadge.emit(badge);
  }

  private initialSelection(): void {
    this.tasksStateBadgesList.map((badge: TaskStateBadgeInterface): TaskStateBadgeInterface => {

      if (badge.state === this.initialBadgeState) {
        badge.selected = true;
        return badge;
      }

      return badge;
    });
  }
}
