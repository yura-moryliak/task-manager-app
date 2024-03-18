import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DynamicSidebarService } from './commons/services/dynamic-sidebar.service';
import { ViewContainerRef } from '@angular/core';
import {provideRouter} from "@angular/router";
import {routes} from "./app.routes";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dynamicSidebarService: jasmine.SpyObj<DynamicSidebarService>;

  beforeEach(async () => {
    dynamicSidebarService = jasmine.createSpyObj('DynamicSidebarService', ['setViewContainerRef']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        { provide: DynamicSidebarService, useValue: dynamicSidebarService },
        { provide: ViewContainerRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize DynamicSidebarService with root view container', () => {
    expect(dynamicSidebarService.setViewContainerRef).toHaveBeenCalledWith(jasmine.any(Object));
  });
});
