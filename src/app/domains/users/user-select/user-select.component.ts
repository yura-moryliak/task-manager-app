import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Subscription} from 'rxjs';

import {UsersService} from '../../../commons/services/users.service';
import {UserInterface} from '../../../commons/interfaces/user.interface';
import {ClickOutsideDirective} from '../../../commons/directives/click-outside.directive';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserSelectComponent implements OnInit, OnDestroy {

  private usersService: UsersService = inject(UsersService);
  private subscriptions: Subscription = new Subscription();

  @Input() user: UserInterface | undefined;
  @Output() onSelectedUser: EventEmitter<UserInterface | undefined> = new EventEmitter<UserInterface | undefined>();

  usersList: UserInterface[] = [];
  isUsersListOpened: boolean = false;
  selectedUser: UserInterface | undefined;

  ngOnInit() :void {
    this.initUsersList();

    if (this.user) {
      this.selectUser(this.user);
    }
  }

  openList(): void {
    this.isUsersListOpened = !this.isUsersListOpened;
  }

  selectUser(user: UserInterface): void {
    if (user) {
      this.selectedUser = user;
      this.onSelectedUser.emit(user);
      this.clickedOutside();
    }
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.openList();
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
    const usersDataListSubscription: Subscription = this.usersService.usersList$.subscribe((usersList: UserInterface[]): void => {
      this.usersList = usersList;
    });
    this.subscriptions.add(usersDataListSubscription);
  }
}
