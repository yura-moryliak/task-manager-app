import {TaskStateEnum} from '../enums/task-state.enum';
import {UserInterface} from './user.interface';

export interface TaskInterface {
  id: number;
  name: string;
  disabled: boolean;
  description: string;
  createdAt: Date;
  modifiedAt: Date | null;
  state: TaskStateEnum;
  assignee?: UserInterface | undefined;
}
