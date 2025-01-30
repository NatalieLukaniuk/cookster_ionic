export interface Filters {
    ingredientsToExclude: string[],
    ingredientsToInclude: string[],
    maxPrepTime: number,
    tagsToShow: number[],
    tagsToExclude: number[],
    collectionsToInclude: string[],
    search: string
}