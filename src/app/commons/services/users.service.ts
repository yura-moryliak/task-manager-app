import {inject, Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {UserInterface} from '../interfaces/user.interface';
import {DataStorageService} from './data-storage.service';
import {fallbackAvatar} from '../fallback-avatar';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  get usersList$() {
    return this.usersListBehaviorSubject.asObservable();
  }

  get userToUpdate$(): Observable<UserInterface | undefined> {
    return this.userTransferBehaviorSubject.asObservable();
  }

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

  private dataStorageService: DataStorageService = inject(DataStorageService);
  private usersListBehaviorSubject: BehaviorSubject<UserInterface[]> = new BehaviorSubject(this.usersList);
  protected userTransferBehaviorSubject: BehaviorSubject<UserInterface | undefined> = new BehaviorSubject<UserInterface | undefined>(undefined);

  create(createModel: Partial<UserInterface>): void {
    createModel.id = Date.now();
    this.usersList = [...this.usersList, createModel as UserInterface];
    this.usersListBehaviorSubject.next(this.usersList);
  }

  update(updateModel: UserInterface): void {
    this.usersList.map((user: UserInterface): UserInterface => {
      if (updateModel.id === user.id) {
        user = { ...user, ...updateModel };
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

  transferUserToUpdate(updateModel: UserInterface | undefined = undefined): void {
    this.userTransferBehaviorSubject.next(updateModel);
  }
}
