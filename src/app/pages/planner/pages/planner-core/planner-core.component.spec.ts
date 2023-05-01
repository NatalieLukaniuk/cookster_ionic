/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlannerCoreComponent } from './planner-core.component';

describe('PlannerCoreComponent', () => {
  let component: PlannerCoreComponent;
  let fixture: ComponentFixture<PlannerCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
