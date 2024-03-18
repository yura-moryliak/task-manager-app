import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';

import {Observable} from 'rxjs';

import {DeviceDetectorService} from 'ngx-device-detector';
import {SidebarToggleService} from '../../services/sidebar-toggle.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

  private deviceDetectorService: DeviceDetectorService = inject(DeviceDetectorService);
  private sidebarToggleService: SidebarToggleService = inject(SidebarToggleService);

  isDeviceMobile: boolean = this.deviceDetectorService.isMobile(this.deviceDetectorService.userAgent);
  sidebarToggle$: Observable<boolean> = this.sidebarToggleService.toggle$;

  closeSidebar(): void {
    this.sidebarToggleService.toggle();
  }
}
