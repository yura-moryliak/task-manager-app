import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersService} from '../../../commons/services/users.service';
import {UserInterface} from '../../../commons/interfaces/user.interface';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';
import {UserCreateUpdateComponent} from '../user-create-update/user-create-update.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent {

  private usersService: UsersService = inject(UsersService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);

  @Input({required: true}) user: UserInterface | undefined;

  update(user: UserInterface): void {
    this.usersService.transferUserToUpdate(user);
    this.dynamicSidebarService.open(UserCreateUpdateComponent);
  }

  delete(): void {
    if (!this.user) {
      return;
    }

    this.usersService.delete(this.user.id);
  }

}
