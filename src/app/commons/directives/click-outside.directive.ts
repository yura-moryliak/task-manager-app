import {AfterViewInit, Directive, ElementRef, EventEmitter, inject, Inject, OnDestroy, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {filter, fromEvent, Subscription} from 'rxjs';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {

  @Output() clickOutside: EventEmitter<void> = new EventEmitter<void>();

  documentClickSubscription: Subscription | undefined;

  private elementRef: ElementRef = inject(ElementRef);
  @Inject(DOCUMENT) private document: Document = inject(DOCUMENT);

  ngAfterViewInit(): void {
    this.documentClickSubscription = fromEvent(this.document, 'click')
      .pipe(filter((event: Event) => !this.isInside(event.target as HTMLElement)))
      .subscribe((): void => this.clickOutside.emit());
  }

  ngOnDestroy(): void {
    this.documentClickSubscription?.unsubscribe();
  }

  private isInside(elementToCheck: HTMLElement): boolean {
    return (
      elementToCheck === this.elementRef.nativeElement ||
      this.elementRef.nativeElement.contains(elementToCheck)
    );
  }

}
