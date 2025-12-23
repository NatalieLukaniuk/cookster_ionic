import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { tap, Observable } from 'rxjs';
import { ExpencesService, RecipyCostInfo } from 'src/app/expenses/expences.service';
import { Ingredient } from 'src/app/models/recipies.models';

@Component({
  selector: 'app-cost-of-recipy',
  templateUrl: './cost-of-recipy.component.html',
  styleUrls: ['./cost-of-recipy.component.scss']
})
export class CostOfRecipyComponent implements OnInit {
  @Input() ingredients: Ingredient[] = [];
  @Input() portions: number = 1;
  @Input() amountPerPortion: number = 100;
  @Input() isFullscreenModal = false;
  @Input() isCostDetails = true;

  isPerHundredGrams = false;

  id = Math.random().toString()

  Math = Math;

  recipyCostInfo$: Observable<RecipyCostInfo> | undefined

  recipyInfo:RecipyCostInfo | null = null;

  constructor(
    private expensesService: ExpencesService
  ) { }
  ngOnInit(): void {

    this.recipyCostInfo$ = this.expensesService.getRecipyCost(this.ingredients, this.portions as number, this.amountPerPortion as number)
      .pipe(tap(res => {        
        this.recipyInfo = res
      }))

    if (this.amountPerPortion === 100 && this.portions === 1) {
      this.isPerHundredGrams = true;
    }
  }

  @ViewChild(IonModal) modal: IonModal | undefined;

  confirm() {
    this.modal?.dismiss();
  }

}
