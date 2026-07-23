import { Component, computed, Input } from '@angular/core';
import { FiltersService } from '../../services/filters.service';

@Component({
  selector: 'app-collection-selector',
  templateUrl: './collection-selector.component.html',
  styleUrls: ['./collection-selector.component.scss'],
})
export class CollectionSelectorComponent {
  @Input() userCollections: string[] | null = [];
  constructor(public filtersService: FiltersService,) { }

  $checkedCollections = computed(() => this.filtersService.getCurrentFilters().collectionsToInclude) 

  onCollectionCheck(collectionName: string) {
    this.filtersService.toggleCollectionToShow(collectionName)
  }

}
