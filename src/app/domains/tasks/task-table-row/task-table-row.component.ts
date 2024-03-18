import {Component,  ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TaskBase} from '../task.base';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';

@Component({
  selector: 'app-task-table-row',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskStatePipe],
  templateUrl: './task-table-row.component.html',
  styleUrls: ['./task-table-row.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskTableRowComponent extends TaskBase { }
