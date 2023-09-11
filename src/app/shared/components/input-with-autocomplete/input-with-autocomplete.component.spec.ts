import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithAutocompleteComponent } from './input-with-autocomplete.component';

describe('InputWithAutocompleteComponent', () => {
  let component: InputWithAutocompleteComponent;
  let fixture: ComponentFixture<InputWithAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputWithAutocompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputWithAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
