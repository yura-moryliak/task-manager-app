import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {Observable} from 'rxjs';

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
export class UsersComponent implements OnInit {

  private usersService: UsersService = inject(UsersService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);

  usersList$: Observable<UserInterface[]> | undefined;

  trackByUserId = (index: number, userItem: UserInterface) => userItem.id;

  ngOnInit(): void {
    this.usersList$ = this.usersService.usersList$;
  }

  addNew(): void {
    this.dynamicSidebarService.open({ component: UserCreateUpdateComponent });
  }
}
