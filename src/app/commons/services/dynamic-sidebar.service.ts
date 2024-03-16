import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';

import {BehaviorSubject, Observable, Subject, take} from 'rxjs';

import {DynamicSidebarComponent} from '../components/dynamic-sidebar/dynamic-sidebar.component';
import {DynamicSidebarConfigInterface} from '../interfaces/dynamic-sidebar-config.interface';

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

  get data$(): Observable<unknown> {
    return this.dynamicSidebarDataBehaviourSubject.asObservable();
  }

  private dynamicSidebarDataBehaviourSubject: BehaviorSubject<unknown | null>
    = new BehaviorSubject<unknown | null>(null);

  private closedSubject: Subject<unknown> = new Subject<unknown>();

  private vcr: ViewContainerRef | undefined;
  private dynamicSidebarComponentRef: ComponentRef<DynamicSidebarComponent> | undefined;

  open(config: DynamicSidebarConfigInterface): Observable<unknown> {
    this.dynamicSidebarComponentRef = this.vcr?.createComponent(DynamicSidebarComponent);

    if (!this.dynamicSidebarComponentRef) {
      throw new Error('Can not create dynamic component');
    }

    this.dynamicSidebarComponentRef.instance.component = config.component;
    this.dynamicSidebarDataBehaviourSubject.next(config.componentData ? config.componentData : undefined);

    return this.closedSubject.asObservable().pipe(take(1));
  }

  close(data?: any | any[]): void {
    if (!this.vcr) {
      return;
    }

    if (data) {
      this.closedSubject.next(data);
    }

    this.vcr.clear();
    this.dynamicSidebarComponentRef = undefined;
  }
}
