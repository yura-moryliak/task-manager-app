import {ComponentRef, Injectable, ViewContainerRef} from '@angular/core';

import {BehaviorSubject, Observable, Subject, take} from 'rxjs';

import {DynamicSidebarConfigInterface} from '../interfaces/dynamic-sidebar-config.interface';
import {DynamicSidebarComponent} from '../components/dynamic-sidebar/dynamic-sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicSidebarService {

  setViewContainerRef(vcr: ViewContainerRef) {
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

    return this.closedSubject.pipe(take(1));
  }

  close(data?: any | any[] | undefined): void {
    if (!this.vcr) {
      return;
    }

    this.closedSubject.next(data);

    this.vcr.clear();
    this.dynamicSidebarComponentRef = undefined;
  }
}
