import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTableRowComponent } from './task-table-row.component';

describe('TaskTableRowComponent', () => {
  let component: TaskTableRowComponent;
  let fixture: ComponentFixture<TaskTableRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskTableRowComponent]
    });
    fixture = TestBed.createComponent(TaskTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
