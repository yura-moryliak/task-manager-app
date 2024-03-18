import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserAvatarComponent {

  @Input({ required: true }) src: string | undefined;
  @Input({ required: true }) alt: string | undefined;
  @Input() width: number = 40;
  @Input() height: number = 40;

}
