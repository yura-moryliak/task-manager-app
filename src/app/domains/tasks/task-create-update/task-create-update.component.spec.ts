import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreateUpdateComponent } from './task-create-update.component';

describe('TaskCreateUpdateComponent', () => {
  let component: TaskCreateUpdateComponent;
  let fixture: ComponentFixture<TaskCreateUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskCreateUpdateComponent]
    });
    fixture = TestBed.createComponent(TaskCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
