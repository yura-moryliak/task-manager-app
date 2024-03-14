import {ComponentRef, Injectable, Type, ViewContainerRef} from '@angular/core';

import {DynamicSidebarComponent} from '../components/dynamic-sidebar/dynamic-sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicSidebarService {

  set viewContainerRef(vcr: ViewContainerRef) {
    if (!vcr) {
      throw new Error('View container reference must be passed at root component');
    }
    this.vcr = vcr;
  }

  private vcr: ViewContainerRef | undefined;
  private dynamicSidebarComponentRef: ComponentRef<DynamicSidebarComponent> | undefined;

  open<ComponentType>(componentType: Type<ComponentType>): void {
    if (!this.vcr) {
      return;
    }

    this.dynamicSidebarComponentRef = this.vcr.createComponent(DynamicSidebarComponent);

    if (!this.dynamicSidebarComponentRef) {
      throw new Error('Can not create dynamic component');
    }

    this.dynamicSidebarComponentRef.instance.component = componentType;
  }

  close(): void {
    if (!this.vcr) {
      return;
    }

    this.vcr.clear();
    this.dynamicSidebarComponentRef = undefined;
  }
}
