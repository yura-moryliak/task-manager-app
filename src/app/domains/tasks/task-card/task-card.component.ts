import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskInterface} from "../../../commons/interfaces/task.interface";

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input({required: true}) task!: TaskInterface | undefined;

}
