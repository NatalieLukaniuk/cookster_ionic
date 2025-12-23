import { Ingredient } from 'src/app/models/recipies.models';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { getUnitText } from 'src/app/pages/recipies/utils/recipy.utils';

@Component({
    selector: 'app-preps',
    templateUrl: './preps.component.html',
    styleUrls: ['./preps.component.scss'],
    standalone: false
})
export class PrepsComponent implements OnChanges {
  @Input() ingredients!: Ingredient[];
  @Input() isSplitIntoGroups: boolean = false;

  @Output() deletePrep = new EventEmitter<{
    ingredient: Ingredient;
    description: string;
  }>();

  @Output() addPrep = new EventEmitter<{
    ingredient: Ingredient;
    description: string;
  }>();

  newPrep = '';
  selectedIngred: Ingredient | undefined;

  getUnitText = getUnitText;

  preps: { ingredient: Ingredient; description: string }[] = [];

  constructor(private dataMapping: DataMappingService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.getPreps();
  }

  getIngredient(product: string) {
    return this.dataMapping.getProductNameById(product);
  }

  getPreps() {
    this.preps = [];
    this.ingredients.forEach((ingr) => {
      if (ingr.prep) {
        ingr.prep.forEach((prep) => {
          this.preps.push({
            ingredient: ingr,
            description: prep,
          });
        });
      }
    });
  }

  onDeletePrep(prep: { ingredient: Ingredient; description: string }) {
    this.deletePrep.emit(prep);
  }

  ingredSelected(event: any) {
    this.selectedIngred = event.detail.value;
  }

  add() {
    if (this.selectedIngred) {
      this.addPrep.emit({
        ingredient: this.selectedIngred,
        description: this.newPrep,
      });
    }
    this.newPrep = '';
    this.selectedIngred = undefined;
  }
}
