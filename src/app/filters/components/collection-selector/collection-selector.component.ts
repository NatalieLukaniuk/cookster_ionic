import { Component, Input } from '@angular/core';
import { FiltersService } from '../../services/filters.service';
import { map, tap } from 'rxjs';

@Component({
    selector: 'app-collection-selector',
    templateUrl: './collection-selector.component.html',
    styleUrls: ['./collection-selector.component.scss'],
    standalone: false
})
export class CollectionSelectorComponent {
  @Input() userCollections: string[] | null = [];
  constructor(public filtersService: FiltersService,) { }

  checkedCollections: string[] = [];

  checkedCollections$ = this.filtersService.getFilters.pipe(
    map((res) => res.collectionsToInclude),
    tap((res) => (this.checkedCollections = res))
  );

  onCollectionCheck(collectionName: string) {
    this.filtersService.toggleCollectionToShow(collectionName)
  }

}
