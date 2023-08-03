import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearOldDataComponent } from './clear-old-data.component';

describe('ClearOldDataComponent', () => {
  let component: ClearOldDataComponent;
  let fixture: ComponentFixture<ClearOldDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearOldDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearOldDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
