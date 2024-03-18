import {Component, inject, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SidebarToggleService} from '../../services/sidebar-toggle.service';
import {DeviceDetectorService} from "ngx-device-detector";

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
    this.sidebarToggleService.toggle();
  }
}
