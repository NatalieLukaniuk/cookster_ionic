import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Day, RecipyForCalendar } from 'src/app/models/calendar.models';
import { Ingredient, Recipy } from 'src/app/models/recipies.models';
import { areObjectsEqual } from 'src/app/services/comparison';
import { DataMappingService } from 'src/app/services/data-mapping.service';

@Component({
  selector: 'app-products-per-day',
  templateUrl: './products-per-day.component.html',
  styleUrls: ['./products-per-day.component.scss'],
})
export class ProductsPerDayComponent implements OnChanges {
  @Input() day!: Day;
  products: Ingredient[] = [];
  constructor(private datamapping: DataMappingService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.products = [];
    if (
      changes['day'].currentValue &&
      (!changes['day'].previousValue ||
        !areObjectsEqual(
          changes['day'].currentValue,
          changes['day'].previousValue
        ))
    )
      this.day.details.breakfastRecipies.forEach((recipy) =>
        this.processRecipy(recipy)
      );
    this.day.details.lunchRecipies.forEach((recipy) =>
      this.processRecipy(recipy)
    );
    this.day.details.dinnerRecipies.forEach((recipy) =>
      this.processRecipy(recipy)
    );
  }

  processRecipy(recipy: RecipyForCalendar) {
    recipy.ingrediends.forEach((recipyIngred) => {
      const found = this.products.find(
        (ingred) => recipyIngred.product === ingred.product
      );
      if (found) {
        found.amount += recipyIngred.amount * this.getCoeficient(recipy);
      } else {
        this.products.push({
          product: recipyIngred.product,
          amount: recipyIngred.amount * this.getCoeficient(recipy),
          defaultUnit: recipyIngred.defaultUnit,
          ingredient: this.getIngredientText(recipyIngred),
        });
      }
    });
  }

  getCoeficient(recipy: RecipyForCalendar) {
    if (recipy) {
      return this.datamapping.getCoeficient(
        recipy.ingrediends,
        recipy.portions,
        recipy.amountPerPortion
      );
    } else return 0;
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.datamapping.getIngredientText(ingredient);
  }
}
