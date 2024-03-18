import {Injectable} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {

  get toggle$(): Observable<boolean> {
    return this.sidebarToggleBehaviourSubject.asObservable();
  }

  private sidebarToggleBehaviourSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isSidebarOpened: boolean = false;

  toggle(): void {
    this.isSidebarOpened = !this.isSidebarOpened;
    this.sidebarToggleBehaviourSubject.next(this.isSidebarOpened);
  }

  open(): void {
    this.isSidebarOpened = true;
    this.sidebarToggleBehaviourSubject.next(this.isSidebarOpened);
  }

  close(): void {
    this.isSidebarOpened = false;
    this.sidebarToggleBehaviourSubject.next(this.isSidebarOpened);
  }
}
