import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {fallbackAvatar} from '../fallback-avatar';
import {UserInterface} from '../interfaces/user.interface';

import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get usersList$() {
    return this.usersListBehaviorSubject.asObservable();
  }

  // In memory store
  // Test case
  usersList: UserInterface[] = environment.isDemo ?
    [] :
    [
      {
        id: 1,
        firstName: 'Arnold',
        lastName: 'Schwarzenegger',
        avatarBase64: fallbackAvatar,
        disabled: false
      },
      {
        id: 2,
        firstName: 'Lillu',
        lastName: 'Dallas',
        avatarBase64: fallbackAvatar,
        disabled: false
      },
      {
        id: 3,
        firstName: 'Pogo',
        lastName: 'Duranga',
        avatarBase64: fallbackAvatar,
        disabled: false
      }
    ];

  private usersListBehaviorSubject: BehaviorSubject<UserInterface[]> = new BehaviorSubject(this.usersList);

  create(createModel: Partial<UserInterface>): void {
    createModel.id = Date.now();
    this.usersList = [...this.usersList, createModel as UserInterface];
    this.usersListBehaviorSubject.next(this.usersList);
  }

  update(updateModel: UserInterface): void {
    this.usersList.map((user: UserInterface): UserInterface => {
      if (updateModel.id === user.id) {
        user = updateModel;
        return user;
      }

      return user;
    });
    this.usersListBehaviorSubject.next(this.usersList);
  }

  delete(userId: number): void {
    this.usersList = this.usersList.filter((user: UserInterface): boolean => user.id !== userId);
    this.usersListBehaviorSubject.next(this.usersList);
  }

  deleteAll(): void {
    this.usersList = [];
    this.usersListBehaviorSubject.next(this.usersList);
  }

  removeTaskFromUser(taskId: number): void {
    const user: UserInterface | undefined = this.usersList.find((user: UserInterface) => user.task && user.task.id === taskId);

    if (!user) {
      return;
    }

    user.task = undefined;
  }
}
