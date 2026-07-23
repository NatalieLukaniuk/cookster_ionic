import { Component, computed, input } from '@angular/core';
import { DishType } from 'src/app/models/recipies.models';
import { FiltersService } from '../../services/filters.service';


@Component({
  selector: 'app-dish-type-selector',
  templateUrl: './dish-type-selector.component.html',
  styleUrls: ['./dish-type-selector.component.scss'],
})
export class DishTypeSelectorComponent {
  isTagsToShow = input(true);

  constructor(public filtersService: FiltersService,) { }

  tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[]

  checkedTags = computed(() => this.isTagsToShow()? this.filtersService.getCurrentFilters().tagsToShow : this.filtersService.getCurrentFilters().tagsToExclude) 

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  onTagCheck(tag: DishType) {
    this.isTagsToShow() ? this.filtersService.toggleTagToShow(tag) : this.filtersService.toggleTagToExclude(tag);
  }

}
