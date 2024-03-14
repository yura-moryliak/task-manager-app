import {Component, inject, Input, Type, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DynamicSidebarService} from '../../services/dynamic-sidebar.service';

@Component({
  selector: 'app-dynamic-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-sidebar.component.html',
  styleUrls: ['./dynamic-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicSidebarComponent {

  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);

  @Input({ required: true }) component: Type<any> | undefined;

  close(): void {
    this.dynamicSidebarService.close();
  }
}
