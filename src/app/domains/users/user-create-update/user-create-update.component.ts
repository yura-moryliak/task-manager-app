import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {Subscription} from 'rxjs';

import {UsersService} from '../../../commons/services/users.service';
import {UserInterface} from '../../../commons/interfaces/user.interface';
import {fallbackAvatar} from '../../../commons/fallback-avatar';
import {DynamicSidebarService} from '../../../commons/services/dynamic-sidebar.service';
import {UserCreateUpdateFormInterface} from "../../../commons/interfaces/user-create-update-form-group.interface";

@Component({
  selector: 'app-user-create-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create-update.component.html',
  styleUrls: ['./user-create-update.component.scss']
})
export class UserCreateUpdateComponent implements OnInit, OnDestroy {

  private usersService: UsersService = inject(UsersService)
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);
  private subscriptions: Subscription = new Subscription();

  private userToUpdate: UserInterface | undefined;

  form: FormGroup<UserCreateUpdateFormInterface> = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    avatarBae64: new FormControl(fallbackAvatar)
  });
  isUpdateMode: boolean = false;
  isAvatarMaxSizeError: boolean = false;

  ngOnInit(): void {
    this.initUpdateUser();
  }

  changeAvatar(event: Event): void {
    if (!event) {
      return;
    }

    let file = (event.target as any).files[0];

    if (!file) {
      return;
    }

    const maxSize: number = 1024 * 1024;

    if (file.size > maxSize) {
      this.isAvatarMaxSizeError = true;
      file = null;
      return;
    }

    this.isAvatarMaxSizeError = false;

    const reader: FileReader = new FileReader();

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.form.controls.avatarBae64.setValue(`data:image/jpeg;base64,${base64String}`);
      this.form.controls.avatarBae64.setErrors(null);
    }
    reader.onerror = (error: ProgressEvent<FileReader>) => console.log(error)
    reader.readAsDataURL(file);
  }

  createUser(): void {
    this.usersService.create(this.form.value as Partial<UserInterface>);
    this.dynamicSidebarService.close();
  }

  updateUser(): void {
    if (!this.userToUpdate) {
      return;
    }

    this.userToUpdate.firstName = this.form.value.firstName as string;
    this.userToUpdate.lastName = this.form.value.lastName as string;
    this.userToUpdate.avatarBae64 = this.form.value.avatarBae64 as string;
    this.usersService.update(this.userToUpdate);
    this.dynamicSidebarService.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initUpdateUser(): void {
    const updateUserDataSubscription: Subscription = this.usersService.userToUpdate$.subscribe((user: UserInterface | undefined) => {
      if (user) {
        this.isUpdateMode = true;
        this.userToUpdate = user;

        this.form.controls.avatarBae64.setValue(user.avatarBae64);
        this.form.controls.firstName.setValue(user.firstName);
        this.form.controls.lastName.setValue(user.lastName);
      }
    });
    this.subscriptions.add(updateUserDataSubscription);
  }
}
