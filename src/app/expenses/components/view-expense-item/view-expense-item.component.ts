import { Component, Input } from '@angular/core';
import { ExpenseItem } from '../../expenses-models';
import { MeasuringUnit, MeasuringUnitText } from 'src/app/models/recipies.models';
import { DataMappingService } from 'src/app/services/data-mapping.service';
import { ExpencesService } from '../../expences.service';

@Component({
    selector: 'app-view-expense-item',
    templateUrl: './view-expense-item.component.html',
    styleUrls: ['./view-expense-item.component.scss'],
    standalone: false
})
export class ViewExpenseItemComponent {
  @Input() expenseItem!: ExpenseItem;
  @Input() color = 'secondary';

  MeasuringUnit = MeasuringUnit;
  constructor(private datamapping: DataMappingService, private expenseService: ExpencesService) {

  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  isValidProduct(productId: string) {
    return productId !== 'other';
  }

  roundToTwoPlaces(value: number) {
    return (Math.round((value) * 100) / 100)
  }

  productText() {
    if (this.isValidProduct(this.expenseItem.productId)) {
      return this.datamapping.getProductNameById(this.expenseItem.productId);
    } else {
      return 'Інше'
    }

  }

  deleteItem() {
    this.expenseService.deleteExpenseItem(this.expenseItem)
  }
}
