/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecipyShortViewComponent } from './recipy-short-view.component';

describe('RecipyShortViewComponent', () => {
  let component: RecipyShortViewComponent;
  let fixture: ComponentFixture<RecipyShortViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipyShortViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipyShortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
