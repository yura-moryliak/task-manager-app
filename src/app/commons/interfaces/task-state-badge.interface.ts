import {TaskStateEnum} from '../enums/task-state.enum';

export interface TaskStateBadgeInterface {
  name: string;
  state: TaskStateEnum;
  selected: boolean;
}
