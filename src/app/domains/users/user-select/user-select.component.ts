import {Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Observable} from 'rxjs';

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
export class UserSelectComponent implements OnInit {

  private usersService: UsersService = inject(UsersService);

  @Input() user: UserInterface | undefined;
  @Output() onSelectedUser: EventEmitter<UserInterface | undefined> = new EventEmitter<UserInterface | undefined>();

  userList$: Observable<UserInterface[]> | undefined;
  isUsersListOpened: boolean = false;
  selectedUser: UserInterface | undefined;

  ngOnInit() :void {
    this.userList$ = this.usersService.usersList$;

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
    }
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selectedUser = undefined;
    this.onSelectedUser.emit(undefined);
  }

  clickedOutside(): void {
    this.isUsersListOpened = false;
  }
}
