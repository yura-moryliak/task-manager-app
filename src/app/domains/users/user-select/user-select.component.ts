import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Subscription} from 'rxjs';

import {UsersService} from '../../../commons/services/users.service';
import {TaskStateEnum} from '../../../commons/enums/task-state.enum';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';
import {UserInterface} from '../../../commons/interfaces/user.interface';
import {TaskInterface} from '../../../commons/interfaces/task.interface';
import {ClickOutsideDirective} from '../../../commons/directives/click-outside.directive';
import {UserAvatarComponent} from "../../../commons/components/user-avatar/user-avatar.component";

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, TaskStatePipe, UserAvatarComponent],
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserSelectComponent implements OnInit, OnDestroy {

  private usersService: UsersService = inject(UsersService);
  private subscriptions: Subscription = new Subscription();

  @Input() user: UserInterface | undefined;
  @Input() task: TaskInterface | undefined;
  @Output() onSelectedUser: EventEmitter<UserInterface | undefined>
    = new EventEmitter<UserInterface | undefined>();

  usersList: UserInterface[] = [];
  isUsersListOpened: boolean = false;
  selectedUser: UserInterface | undefined;

  ngOnInit(): void {
    this.initUsersList();

    if (!this.user) {
      return;
    }

    this.selectUser(this.user);
    this.initUserDisableState(this.user);
  }

  openList(): void {
    this.isUsersListOpened = !this.isUsersListOpened;
  }

  selectUser(user: UserInterface): void {
    if (!user) {
      return;
    }

    if (user.disabled) {
      return;
    }

    this.selectedUser = user;
    this.onSelectedUser.emit(user);
    this.clickedOutside();
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selectedUser = undefined;
    this.onSelectedUser.emit(undefined);
  }

  clickedOutside(): void {
    this.isUsersListOpened = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initUsersList(): void {
    const usersListDataSubscription: Subscription = this.usersService.usersList$.subscribe((usersList: UserInterface[]) => {
        this.usersList = usersList;
        this.checkUserDisableState(this.usersList);
      }
    );
    this.subscriptions.add(usersListDataSubscription);
  }

  private initUserDisableState(user: UserInterface): void {
    const { task } = user;

    if (!task || !this.task) {
      return;
    }

    if (task.id === this.task.id) {
      user.disabled = false;
    }
  }

  private checkUserDisableState(usersList: UserInterface[]): void {
    usersList.forEach((user: UserInterface): void => {
      const { task } = user;

      if (!task || !this.task) {
        return;
      }

      if (task.id === this.task.id) {
        user.disabled = false;
        return;
      }

      // REQUIREMENT: The same user cannot be assigned to more than one task which is ‘in progress’.
      if (task.id !== this.task.id && task.state === TaskStateEnum.InProgress) {
        user.disabled = true;
      }
    });
  }
}
