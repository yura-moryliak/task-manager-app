import {TaskInterface} from './task.interface';

export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  avatarBase64: string;
  task?: TaskInterface | undefined;
  disabled: boolean;
}
