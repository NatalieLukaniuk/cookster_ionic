import * as moment from "moment";
import { Role } from "../models/auth.models";
import { CalendarRecipyInDatabase_Reworked } from "../models/calendar.models";
import { Filters, RecipySorting, RecipySortingDirection } from "../models/filters.models";
import { Recipy, RecipyCollection } from "../models/recipies.models";
import { getLastPreparedDate } from "../pages/calendar/calendar.utils";
import { getActivePreparationTime, getPreparationTime } from "../pages/recipies/utils/recipy.utils";

export function applyFilters(
    recipies: Recipy[],
    filters: Filters,
    currentUserRole: Role | null,
    currentUserEmail: string,
    userCollections: RecipyCollection[],
    userPlannedRecipies: CalendarRecipyInDatabase_Reworked[],
    noShowIds?: string[]) {
    let _recipies = recipies.map((recipy) => recipy);

    _recipies = _recipies.filter((recipy) => isShowRecipy(recipy, currentUserRole, currentUserEmail));

    if (noShowIds) {
        _recipies = excludeNoShow(noShowIds, _recipies)
    }

    if (filters.collectionsToInclude.length && userCollections.length) {
        _recipies = filterByCollections(_recipies, filters.collectionsToInclude, userCollections)
    }

    if (!!filters.ingredientsToInclude.length) {
        _recipies = filterByIngredients(true, _recipies, filters.ingredientsToInclude)
    }
    if (!!filters.ingredientsToExclude.length) {
        _recipies = filterByIngredients(false, _recipies, filters.ingredientsToExclude)
    }
    if (!!filters.tagsToShow.length) {
        _recipies = filterByTags(true, _recipies, filters.tagsToShow)
    }
    if (!!filters.tagsToExclude.length) {
        _recipies = filterByTags(false, _recipies, filters.tagsToExclude)
    }
    if (!!filters.maxPrepTime) {
        _recipies = filterByMaxPrepTime(_recipies, filters.maxPrepTime)
    }
    if (filters.search.length) {
        _recipies = filterBySearchWord(_recipies, filters.search)
    }

    applySorting(_recipies, filters.sorting, filters.sortingDirection, userPlannedRecipies)

    return _recipies;
}

function isShowRecipy(recipy: Recipy, currentUserRole: Role | null, currentUserEmail: string) {
    return !recipy.notApproved ? true : currentUserRole ? (recipy.author === currentUserEmail || currentUserRole === Role.Admin) : false;
}

function excludeNoShow(noShowIds: string[], recipies: Recipy[]) {
    return recipies.filter((recipy) => !noShowIds.includes(recipy.id))
}

function filterByCollections(recipies: Recipy[], collectionsToInclude: string[], userCollections: RecipyCollection[]) {
    let recipiesIdsToShow: string[] = [];
    collectionsToInclude.forEach(collection => {
        const add = userCollections.find(item => item.name === collection)?.recipies;
        if (add?.length) {
            recipiesIdsToShow = recipiesIdsToShow.concat(add)
        }
    })
    return recipies.filter(recipy => recipiesIdsToShow.includes(recipy.id))
}

function filterByIngredients(isInclude: boolean, recipies: Recipy[], ingredientIds: string[]) {
    if (isInclude) {
        return recipies.filter((recipy) => {
            let recipyIngredientsIds = recipy.ingrediends.map(
                (ingr) => ingr.product
            );
            return ingredientIds.every((id) =>
                recipyIngredientsIds.includes(id)
            );
        });
    } else {
        return recipies.filter((recipy) => {
            return !recipy.ingrediends.find((ingr) =>
                ingredientIds.includes(ingr.product)
            );
        });
    }
}

function filterByTags(isInclude: boolean, recipies: Recipy[], tags: number[]) {
    return recipies.filter((recipy) => {
        return isInclude ? tags.some((tag) => recipy.type.includes(tag)) : !tags.some((tag) => recipy.type.includes(tag));
    });
}

function filterByMaxPrepTime(recipies: Recipy[], maxPrepTime: number) {
    return recipies.filter((recipy) => {
        let prepTime = 0;
        recipy.steps.forEach((step) => {
            prepTime = prepTime + (step.timeActive + step.timePassive);
        });
        return prepTime <= maxPrepTime;
    });
}

function filterBySearchWord(recipies: Recipy[], searchWord: string) {
    return recipies.filter((recipy) =>
        recipy.name.toLowerCase().includes(searchWord.toLowerCase())
    );
}


function applySorting(recipies: Recipy[], sorting: RecipySorting, sortingDirection: RecipySortingDirection, userPlannedRecipies: CalendarRecipyInDatabase_Reworked[]) {
    switch (sorting) {
        case RecipySorting.Default: return;
        case RecipySorting.ByLastPrepared: sortByLastPrepared(recipies, userPlannedRecipies);
            break;
        case RecipySorting.ByTotalPreparationTime: sortByTotalPreparationTime(recipies);
            break;
        case RecipySorting.ByActivePreparationTime: sortByActivePreparationTime(recipies);
            break;
    }
    if (sortingDirection === RecipySortingDirection.BigToSmall) {
        recipies.reverse()
    }
}

function sortByTotalPreparationTime(recipies: Recipy[]) {
    recipies.sort((a, b) => getPreparationTime(a) - getPreparationTime(b));
}
function sortByActivePreparationTime(recipies: Recipy[]) {
    recipies.sort((a, b) => getActivePreparationTime(a) - getActivePreparationTime(b));
}

function sortByLastPrepared(recipies: Recipy[], userPlannedRecipies: CalendarRecipyInDatabase_Reworked[]) {
    const mapped = recipies.map(recipy => addLastPrepared(recipy, userPlannedRecipies));
    const sorted = getSortedByLastPrepared(mapped as Recipy[]);
    return sorted

}

function getSortedByLastPrepared(recipies: Recipy[]) {
    recipies.sort((a, b) => _sortByLastPrepared(a, b));
}

function _sortByLastPrepared(a: Recipy, b: Recipy) {
    if (!a.lastPrepared && !b.lastPrepared) {
        return 0
    }
    if (!a.lastPrepared) {
        return -1
    }
    if (!b.lastPrepared) {
        return 1
    }
    if (moment(a.lastPrepared, 'DDMMYYYY').clone().isAfter(moment(b.lastPrepared, 'DDMMYYYY').clone())) {
        return 1
    } else {
        return -1
    }
}

function addLastPrepared(recipy: Recipy, allPlannedRecipies: CalendarRecipyInDatabase_Reworked[] | undefined) {
    let updated = {
        ...recipy,
        lastPrepared: allPlannedRecipies ? getLastPreparedDate(recipy.id, allPlannedRecipies) : 'N/A'
    }
    return updated
}