import {Directive, Output, EventEmitter} from '@angular/core';
import * as Hammer from 'hammerjs';

@Directive({
  selector: '[appSwipe]',
  standalone: true
})
export class SwipeDirective {
  @Output() swipeLeft: EventEmitter<void> = new EventEmitter<void>();
  @Output() swipeRight: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    const hammer: HammerManager = new Hammer(document.body);

    hammer.get('swipe').set({direction: Hammer.DIRECTION_HORIZONTAL});
    hammer.on('swipeleft', (): void => this.swipeLeft.emit());
    hammer.on('swiperight', () => this.swipeRight.emit());
  }
}
