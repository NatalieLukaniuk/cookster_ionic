import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AddRecipyPage } from './add-recipy.page';

describe('Tab2Page', () => {
  let component: AddRecipyPage;
  let fixture: ComponentFixture<AddRecipyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRecipyPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecipyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
