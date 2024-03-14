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

  get userToUpdate$(): Observable<UserInterface | null> {
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
  protected userTransferBehaviorSubject: BehaviorSubject<UserInterface | null> = new BehaviorSubject<UserInterface | null>(null);

  create(createModel: Partial<UserInterface>): void {
    createModel.id = Date.now();
    this.usersList = [...this.usersList, createModel as UserInterface];
    this.usersListBehaviorSubject.next(this.usersList);
  }

  transferUserToUpdate(updateModel: UserInterface | null): void {
    this.userTransferBehaviorSubject.next(updateModel);
  }

  delete(userId: number): void {
    this.usersList = this.usersList.filter((user: UserInterface) => user.id !== userId);
    this.usersListBehaviorSubject.next(this.usersList);
  }
}
