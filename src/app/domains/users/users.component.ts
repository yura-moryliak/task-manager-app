import {Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {Subscription} from 'rxjs';

import {UserComponent} from './user/user.component';
import {UsersService} from '../../commons/services/users.service';
import {UserInterface} from '../../commons/interfaces/user.interface';
import {UserSelectComponent} from './user-select/user-select.component';
import {DynamicSidebarService} from '../../commons/services/dynamic-sidebar.service';
import {UserCreateUpdateComponent} from './user-create-update/user-create-update.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UserComponent, UserSelectComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit, OnDestroy {

  private usersService: UsersService = inject(UsersService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  usersList: UserInterface[] = [];

  trackByUserId = (index: number, userItem: UserInterface) => {
    return userItem.id;
  }

  ngOnInit(): void {
    this.initUsersList();
  }

  addNew(): void {
    this.dynamicSidebarService.open({ component: UserCreateUpdateComponent });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initUsersList(): void {
    const usersListsDataSubscription: Subscription = this.usersService.usersList$.subscribe(
      (usersList: UserInterface[]) => this.usersList = usersList
    );
    this.subscriptions.add(usersListsDataSubscription);
  }
}
