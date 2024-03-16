import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {UserInterface} from '../interfaces/user.interface';
import {fallbackAvatar} from '../fallback-avatar';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get usersList$() {
    return this.usersListBehaviorSubject.asObservable();
  }

  // In memory store
  private usersList: UserInterface[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      avatarBae64: fallbackAvatar
    },
    {
      id: 2,
      firstName: 'Sara',
      lastName: 'Doe',
      avatarBae64: fallbackAvatar
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
        user = { ...updateModel };
        return user;
      }

      return user;
    });
    this.usersListBehaviorSubject.next(this.usersList);
  }

  delete(userId: number): void {
    this.usersList = this.usersList.filter((user: UserInterface) => user.id !== userId);
    this.usersListBehaviorSubject.next(this.usersList);
  }
}
