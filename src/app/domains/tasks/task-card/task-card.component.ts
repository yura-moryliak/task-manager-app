import {Component, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TaskBase} from '../task.base';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, TaskStatePipe],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskCardComponent extends TaskBase { }
