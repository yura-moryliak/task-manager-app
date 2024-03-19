import {Component, inject, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';

import {NavBarComponent} from './commons/components/nav-bar/nav-bar.component';
import {SidebarComponent} from './commons/components/sidebar/sidebar.component';
import {DynamicSidebarService} from './commons/services/dynamic-sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  private rootVcr: ViewContainerRef = inject(ViewContainerRef);
  private dynamicSidebarService: DynamicSidebarService = inject(DynamicSidebarService);

  ngOnInit(): void {
    this.dynamicSidebarService.setViewContainerRef(this.rootVcr);
  }
}
