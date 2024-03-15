import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStateLabelsComponent } from './task-state-badges.component';

describe('TaskStateLabelsComponent', () => {
  let component: TaskStateLabelsComponent;
  let fixture: ComponentFixture<TaskStateLabelsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskStateLabelsComponent]
    });
    fixture = TestBed.createComponent(TaskStateLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
