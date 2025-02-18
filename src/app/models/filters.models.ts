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
    Default = 'default',
    ByLastPrepared = 'lastPrepared',
    ByTotalPreparationTime = 'totalPreparationTime',
    ByActivePreparationTime = 'activePreparationTime',
}

export enum RecipySortingDirection {
    SmallToBig = 'ascending',
    BigToSmall = 'descending'
}