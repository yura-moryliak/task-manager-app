import { TestBed } from '@angular/core/testing';

import { DynamicSidebarService } from './dynamic-sidebar.service';

describe('DynamicSidebarService', () => {
  let service: DynamicSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
