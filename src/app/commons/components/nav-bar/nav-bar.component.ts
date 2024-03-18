import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DeviceDetectorService} from 'ngx-device-detector';

import {SidebarToggleService} from '../../services/sidebar-toggle.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent {

  private deviceDetectorService: DeviceDetectorService = inject(DeviceDetectorService);
  private sidebarToggleService: SidebarToggleService = inject(SidebarToggleService);

  isDeviceMobile: boolean = this.deviceDetectorService.isMobile(this.deviceDetectorService.userAgent);

  toggleSidebar(): void {
    if (!this.isDeviceMobile) {
      return;
    }

    this.sidebarToggleService.toggle();
  }
}
