export interface Filters {
    ingredientsToExclude: string[],
    ingredientsToInclude: string[],
    maxPrepTime: number,
    tagsToShow: number[],
    tagsToExclude: number[],
    collectionsToInclude: string[],
    search: string,
    sorting: RecipySorting,
    sortingDirection: RecipySortingDirection
}

export enum RecipySorting {
    Default,
    ByLastPrepared,
    ByTotalPreparationTime,
    ByActivePreparationTime,
}

export enum RecipySortingDirection {
    SmallToBig = 'ascending',
    BigToSmall = 'descending'
}