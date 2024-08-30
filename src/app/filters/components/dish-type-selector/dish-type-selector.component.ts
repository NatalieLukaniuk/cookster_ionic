import { Component, Input, OnInit } from '@angular/core';
import { DishType } from 'src/app/models/recipies.models';
import { FiltersService } from '../../services/filters.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-dish-type-selector',
  templateUrl: './dish-type-selector.component.html',
  styleUrls: ['./dish-type-selector.component.scss'],
})
export class DishTypeSelectorComponent implements OnInit {
  @Input() isTagsToShow = true;

  constructor(public filtersService: FiltersService,) { }

  ngOnInit() {
    this.tags = this.gettags();
  }

  checkedTags: number[] = [];

  tags: number[] = [];

  gettags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }

  checkedTags$ = this.filtersService.getFilters.pipe(
    map((res) => this.isTagsToShow ? res.tagsToShow : res.tagsToExclude),
    tap((res) => (this.checkedTags = res))
  );

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  onTagCheck(tag: DishType) {
    this.isTagsToShow ? this.filtersService.toggleTagToShow(tag) : this.filtersService.toggleTagToExclude(tag);
  }

}
