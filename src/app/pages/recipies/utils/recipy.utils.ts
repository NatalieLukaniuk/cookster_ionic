import {
  Ingredient,
  MeasuringUnit,
  Product,
  Recipy,
} from 'src/app/models/recipies.models';

export function getRecipyBelongsTo(recipy: Recipy) {
  if (recipy.clonedBy) {
    return recipy.clonedBy;
  } else {
    return recipy.author;
  }
}

export function getRecipyCreatedOn(recipy: Recipy) {
  if (recipy.clonedOn) {
    return recipy.clonedOn;
  } else return recipy.createdOn;
}

export function getIngredientText(
  ingr: Ingredient,
  allProducts: Product[]
): string {
  let productName = '';
  for (let product of allProducts) {
    if (product.id === ingr.product) {
      productName = product.name;
    }
  }
  return productName;
}

export function getProductText(productId: string, allProducts: Product[]) {
  let productName = '';
  for (let product of allProducts) {
    if (product.id === productId) {
      productName = product.name;
    }
  }
  return productName;
}

export function getDefaultMeasuringUnit(
  productId: string,
  allProducts: Product[]
) {
  let unit = MeasuringUnit.gr;
  for (let product of allProducts) {
    if (product.id === productId) {
      unit = product.defaultUnit;
    }
  }
  return unit;
}

export function isIngrIncludedInAmountCalculation(
  ingr: any,
  allProducts: Product[]
): boolean {
  return getIngrCalories(ingr, allProducts) > 10;
}

export function getIngrCalories(
  ingr: Ingredient,
  allProducts: Product[]
): number {
  let calories: number = 0;
  for (let product of allProducts) {
    if (product.id === ingr.product) {
      calories = product.calories;
    }
  }
  return calories;
}

export function convertAmountToSelectedUnit(
  amountInGr: number,
  unit: MeasuringUnit,
  ingredientId: string,
  allProducts: Product[]
) {
  if (unit == MeasuringUnit.gr) {
    return amountInGr;
  } else {
    let amount = 0;
    switch (unit) {
      case MeasuringUnit.kg:
        amount = grToKg(amountInGr);
        break;
      case MeasuringUnit.l:
        amount = grToLiter(amountInGr, getDensity(ingredientId, allProducts));
        break;
      case MeasuringUnit.ml:
        amount = grToMl(amountInGr, getDensity(ingredientId, allProducts));
        break;
      case MeasuringUnit.tableSpoon:
        amount = grToTableSpoons(
          amountInGr,
          getDensity(ingredientId, allProducts)
        );
        break;
      case MeasuringUnit.dessertSpoon:
        amount = grToDessertSpoons(
          amountInGr,
          getDensity(ingredientId, allProducts)
        );
        break;
      case MeasuringUnit.teaSpoon:
        amount = grToTeaSpoons(
          amountInGr,
          getDensity(ingredientId, allProducts)
        );
        break;
      case MeasuringUnit.coffeeSpoon:
        amount = grToCoffeeSpoons(
          amountInGr,
          getDensity(ingredientId, allProducts)
        );
        break;
      case MeasuringUnit.pinch:
        amount = grToPinch(amountInGr, getDensity(ingredientId, allProducts));
        break;
      case MeasuringUnit.bunch:
        amount = grToBunch(amountInGr);
        break;
      case MeasuringUnit.item:
        amount = grToItems(amountInGr, getGrPerItem(ingredientId, allProducts));
        break;
      case MeasuringUnit.cup:
        amount = grToGlass(amountInGr, getDensity(ingredientId, allProducts));
    }
    return amount;
  }
}

export function getDensity(productId: string, allProducts: Product[]) {
  let density = 0;
  for (let item of allProducts) {
    if (item.id === productId) {
      density = item.density;
    }
  }
  return density;
}

export function getGrPerItem(productId: string, allProducts: Product[]) {
  let grInOneItem = 0;
  for (let item of allProducts) {
    if (item.id === productId) {
      grInOneItem = item.grInOneItem ? item.grInOneItem : 0;
    }
  }
  return grInOneItem;
}

export function grToKg(amount: number) {
  return amount / 1000;
}

export function kgToGR(amount: number) {
  return amount * 1000;
}

export function grToBunch(amount: number) {
  return amount / 40;
}

export function bunchToGr(amount: number) {
  return amount * 40;
}

export function grToPinch(amount: number, density: number) {
  const cofSp = grToCoffeeSpoons(amount, density);
  return cofSp * 23;
}

export function pinchToGr(amount: number, density: number) {
  const conSp = coffeeSpoonsToGr(amount, density) / 23;
  return conSp;
}

export function grToLiter(amount: number, density: number) {
  // density is in kg/m3
  return amount / density;
}

export function literToGr(amount: number, density: number) {
  // density is in kg/m3
  return amount * density;
}

export function literToMl(amount: number) {
  return amount * 1000;
}

export function mlToL(amount: number) {
  return amount / 1000;
}

export function grToMl(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml;
}

export function mlToGr(amount: number, density: number) {
  const l = mlToL(amount);
  const gr = literToGr(l, density);
  return gr;
}

export function grToTableSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 18;
}

export function tableSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 18;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToTeaSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 5;
}

export function teaSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 5;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToDessertSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 10;
}

export function dessertSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 10;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToCoffeeSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 2.5;
}

export function coffeeSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 2.5;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToGlass(amount: number, density: number) {
  // density is in kg/m3, glass can fit 200ml
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 200;
}

export function glassToGr(amount: number, density: number) {
  // density is in kg/m3, glass can fit 200ml
  const ml = amount * 200;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function itemsToGr(amount: number, grInOneItem: number) {
  return amount * grInOneItem;
}

export function grToItems(amount: number, grInOneItem: number) {
  return amount / grInOneItem;
}

export function NormalizeDisplayedAmount(
  weirdAmount: number,
  unit: MeasuringUnit
): number {
  switch (unit) {
    case MeasuringUnit.bunch:
      return normalizeDecimal(weirdAmount, 1);
    case MeasuringUnit.coffeeSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.cup:
      return normalizeDecimal(weirdAmount, 1);
    case MeasuringUnit.dessertSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.gr:
      return roundToNoDecimals(weirdAmount);
    case MeasuringUnit.item:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.kg:
      return normalizeDecimal(weirdAmount, 2);
    case MeasuringUnit.l:
      return normalizeDecimal(weirdAmount, 2);
    case MeasuringUnit.ml:
      return roundToNoDecimals(weirdAmount);
    case MeasuringUnit.pinch:
      return roundToNoDecimals(weirdAmount);
    case MeasuringUnit.tableSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.teaSpoon:
      return getNiceDecimal(weirdAmount);
    default:
      return 0;
  }
}

export function roundToNoDecimals(amount: number): number {
  if (amount >= 1) {
    return Math.round(amount);
  } else return 1;
}

export function normalizeDecimal(amount: number, places: number): number {
  if ((amount * Math.pow(10, places)) % 0.5) {
    return Math.round(amount * Math.pow(10, places)) / Math.pow(10, places);
  } else return amount;
}

export function getNiceDecimal(amount: number): number {
  if ((amount * 10) % 10) {
    let remainder = (amount * 10) % 10;
    if (remainder > 0 && remainder < 3) {
      return Math.floor(amount) > 0 ? Math.floor(amount) : 0.5;
    } else if (remainder >= 3 && remainder < 7) {
      return Math.floor(amount) + 0.5;
    } else {
      return Math.ceil(amount);
    }
  } else return amount;
}

export function getRecipyNameById(
  allRecipies: Recipy[],
  recipyToFindId: string
): string {
  return allRecipies.find((rec) => rec.id == recipyToFindId)!.name;
}