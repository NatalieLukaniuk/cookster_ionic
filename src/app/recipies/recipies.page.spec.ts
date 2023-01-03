import { RecipiesContainer } from './recipies.page';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

describe('RecipiesContainer', () => {
  let component: RecipiesContainer;
  let fixture: ComponentFixture<RecipiesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipiesContainer],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipiesContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
