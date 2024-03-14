import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TaskInterface} from "../../../commons/interfaces/task.interface";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskComponent implements OnInit {

  @Input({required: true}) task: TaskInterface | undefined;

  ngOnInit(): void {
    console.log('Task init...');
  }

}
