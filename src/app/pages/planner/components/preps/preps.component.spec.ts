/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrepsComponent } from './preps.component';

describe('PrepsComponent', () => {
  let component: PrepsComponent;
  let fixture: ComponentFixture<PrepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
