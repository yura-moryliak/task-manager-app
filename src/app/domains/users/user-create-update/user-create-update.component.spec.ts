import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateUpdateComponent } from './user-create-update.component';

describe('UserCreateUpdateComponent', () => {
  let component: UserCreateUpdateComponent;
  let fixture: ComponentFixture<UserCreateUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserCreateUpdateComponent]
    });
    fixture = TestBed.createComponent(UserCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
