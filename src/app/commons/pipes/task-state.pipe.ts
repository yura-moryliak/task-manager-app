import {Pipe, PipeTransform} from '@angular/core';

import {TaskStateEnum} from '../enums/task-state.enum';

@Pipe({
  name: 'taskState',
  standalone: true
})
export class TaskStatePipe implements PipeTransform {

  // TODO Try to provide OCP here
  private taskStatesMap = {
    [TaskStateEnum.InQueue]: 'In queue',
    [TaskStateEnum.InProgress]: 'In progress',
    [TaskStateEnum.Done]: 'Done'
  }

  transform(taskState: TaskStateEnum, getValue: boolean = false): string | number {
    if (!getValue) {
      return this.taskStatesMap[taskState];
    }

    return taskState;
  }
}
