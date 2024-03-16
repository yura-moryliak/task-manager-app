import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersService} from '../../../commons/services/users.service';
import {TaskStatePipe} from '../../../commons/pipes/task-state.pipe';
import {UserInterface} from '../../../commons/interfaces/user.interface';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';
import {UserCreateUpdateComponent} from '../user-create-update/user-create-update.component';
import {TaskStateEnum} from "../../../commons/enums/task-state.enum";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, TaskStatePipe],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent {

  private usersService: UsersService = inject(UsersService);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);

  @Input({required: true}) user: UserInterface | undefined;

  update(user: UserInterface): void {
    this.dynamicSidebarService.open({component: UserCreateUpdateComponent, componentData: user});
  }

  delete(): void {
    if (!this.user) {
      return;
    }

    this.usersService.delete(this.user.id);
  }

  protected readonly TaskStateEnum = TaskStateEnum;
}
