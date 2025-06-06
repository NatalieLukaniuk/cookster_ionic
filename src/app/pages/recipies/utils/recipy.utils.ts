import {
  Ingredient,
  MeasuringUnit,
  MeasuringUnitText,
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

export function getProductIdByName(name: string, allProducts: Product[]){
  let productId = '';
  for (let product of allProducts) {
    if (product.name.toLowerCase() === name.toLowerCase()) {
      productId = product.id;
    }
  }
  return productId;
}

export function getProductById(id: string, allProducts: Product[]){
  return allProducts.find(product => product.id === id)
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
      case MeasuringUnit.ml:
      case MeasuringUnit.tableSpoon:
      case MeasuringUnit.dessertSpoon:
      case MeasuringUnit.teaSpoon:
      case MeasuringUnit.coffeeSpoon:
      case MeasuringUnit.cup:
      case MeasuringUnit.cl:
      case MeasuringUnit.us_cup:
        amount =
          (amountInGr * getAmountInL(unit)) /
          getDensity(ingredientId, allProducts);
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
      case MeasuringUnit.oz:
        amount = grToOZ(amountInGr);
        break;
      case MeasuringUnit.lb:
        amount = grToLb(amountInGr);
        break;
    }
    return amount;
  }
}

export function convertAmountToSelectedUnitRawData( // MeasuringUnit.item not included
  amountInGr: number,
  unit: MeasuringUnit,
  density: number
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
      case MeasuringUnit.ml:
      case MeasuringUnit.tableSpoon:
      case MeasuringUnit.dessertSpoon:
      case MeasuringUnit.teaSpoon:
      case MeasuringUnit.coffeeSpoon:
      case MeasuringUnit.cup:
      case MeasuringUnit.cl:
      case MeasuringUnit.us_cup:
        amount =
          (amountInGr * getAmountInL(unit)) /
          density;
        break;
      case MeasuringUnit.pinch:
        amount = grToPinch(amountInGr, density);
        break;
      case MeasuringUnit.bunch:
        amount = grToBunch(amountInGr);
        break;
      // case MeasuringUnit.item:
      //   amount = grToItems(amountInGr, getGrPerItem(ingredientId, allProducts));
      //   break;
      case MeasuringUnit.oz:
        amount = grToOZ(amountInGr);
        break;
      case MeasuringUnit.lb:
        amount = grToLb(amountInGr);
        break;
    }
    return amount;
  }
}

export function transformToGrRawData( // MeasuringUnit.item not included
  amount: number,
  unit: MeasuringUnit,
  density: number
): number {
  switch (unit) {
    case MeasuringUnit.gr:
      return amount;
    case MeasuringUnit.kg:
      return kgToGR(amount);
    case MeasuringUnit.bunch:
      return bunchToGr(amount);
    case MeasuringUnit.coffeeSpoon:
    case MeasuringUnit.dessertSpoon:
    case MeasuringUnit.tableSpoon:
    case MeasuringUnit.teaSpoon:
    case MeasuringUnit.ml:
    case MeasuringUnit.l:
    case MeasuringUnit.cup:
    case MeasuringUnit.cl:
    case MeasuringUnit.us_cup:
      return (amount * density) / getAmountInL(unit);
    case MeasuringUnit.pinch:
      return pinchToGr(amount, density);
    // case MeasuringUnit.item:
    //   return itemsToGr(amount, grInOneItem);
    case MeasuringUnit.oz:
      return OZToGr(amount);
    case MeasuringUnit.lb:
      return LbToGr(amount);
    default:
      return 0;
  }
}

export function getAmountInL(unit: MeasuringUnit) {
  switch (unit) {
    case MeasuringUnit.l:
      return 1;
    case MeasuringUnit.ml:
      return 1000;
    case MeasuringUnit.tableSpoon:
      return 67;
    case MeasuringUnit.dessertSpoon:
      return 100;
    case MeasuringUnit.teaSpoon:
      return 203;
    case MeasuringUnit.cup:
      return 5;
    case MeasuringUnit.coffeeSpoon:
      return 405;
    case MeasuringUnit.cl:
      return 100;
    case MeasuringUnit.us_cup:
      return 4;
    default:
      return 1;
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

export function grToOZ(amount: number) {
  return amount / 28.35;
}

export function grToLb(amount: number) {
  return amount / 453.6;
}


export function OZToGr(amount: number) {
  return amount * 28.35;
}

export function LbToGr(amount: number) {
  return amount * 453.6;
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
): string {
  switch (unit) {
    case MeasuringUnit.bunch:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.coffeeSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.cup:
      return normalizeDecimal(weirdAmount, 1);
    case MeasuringUnit.dessertSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.gr:
      return roundToNoDecimals(weirdAmount);
    case MeasuringUnit.item:
      return getNiceDecimalHalvesOnly(weirdAmount);
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
    case MeasuringUnit.us_cup:
      return normalizeDecimal(weirdAmount, 2);
    case MeasuringUnit.cl:
      return normalizeDecimal(weirdAmount, 1);
    case MeasuringUnit.lb:
      return normalizeDecimal(weirdAmount, 1);
    case MeasuringUnit.oz:
      return normalizeDecimal(weirdAmount, 1);
    default:
      return '0';
  }
}

export function NormalizeDisplayedAmountGetNumber(
  weirdAmount: number,
  unit: MeasuringUnit
): number {
  switch (unit) {
    case MeasuringUnit.bunch:
      return getNiceDecimalNumber(weirdAmount);
    case MeasuringUnit.coffeeSpoon:
      return getNiceDecimalNumber(weirdAmount);
    case MeasuringUnit.cup:
      return normalizeDecimalNumber(weirdAmount, 1);
    case MeasuringUnit.dessertSpoon:
      return getNiceDecimalNumber(weirdAmount);
    case MeasuringUnit.gr:
      return roundToNoDecimalsNumber(weirdAmount);
    case MeasuringUnit.item:
      return getNiceDecimalHalvesOnlyNumber(weirdAmount);
    case MeasuringUnit.kg:
      return normalizeDecimalNumber(weirdAmount, 2);
    case MeasuringUnit.l:
      return normalizeDecimalNumber(weirdAmount, 2);
    case MeasuringUnit.ml:
      return roundToNoDecimalsNumber(weirdAmount);
    case MeasuringUnit.pinch:
      return roundToNoDecimalsNumber(weirdAmount);
    case MeasuringUnit.tableSpoon:
      return getNiceDecimalNumber(weirdAmount);
    case MeasuringUnit.teaSpoon:
      return getNiceDecimalNumber(weirdAmount);
    case MeasuringUnit.us_cup:
      return normalizeDecimalNumber(weirdAmount, 2);
    case MeasuringUnit.cl:
      return normalizeDecimalNumber(weirdAmount, 1);
    case MeasuringUnit.lb:
      return normalizeDecimalNumber(weirdAmount, 1);
    case MeasuringUnit.oz:
      return normalizeDecimalNumber(weirdAmount, 1);
    default:
      return 0;
  }
}

export function roundToNoDecimals(amount: number): string {
  if (amount >= 1) {
    return Math.round(amount).toString();
  } else return '1';
}

export function roundToNoDecimalsNumber(amount: number): number {
  if (amount >= 1) {
    return Math.round(amount);
  } else return 1;
}

export function normalizeDecimal(amount: number, places: number): string {
  if ((amount * Math.pow(10, places)) % 0.5) {
    return (Math.round(amount * Math.pow(10, places)) / Math.pow(10, places)).toString();
  } else return amount.toString();
}

export function normalizeDecimalNumber(amount: number, places: number): number {
  if ((amount * Math.pow(10, places)) % 0.5) {
    return Math.round(amount * Math.pow(10, places)) / Math.pow(10, places);
  } else return amount;
}

export function getNiceDecimalHalvesOnly(amount: number): string{
  if ((amount * 10) % 10) {
    let remainder = (amount * 10) % 10;
    if (remainder > 0 && remainder < 3) {
      return Math.floor(amount) > 0 ? Math.floor(amount).toString() : '&#189;';
    } else if (remainder >= 3 && remainder < 7) {
      return Math.floor(amount) > 0 ? Math.floor(amount).toString() + ' &#189;' : '&#189;';
    } else {
      return (Math.ceil(amount)).toString();
    }
  } else return amount.toString();
}

export function getNiceDecimalHalvesOnlyNumber(amount: number): number{
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

// return 1/2, 1/3, 1/4
export function getNiceDecimal(amount: number): string {
  let remainder = (amount * 1000) % 1000;
  if(amount < 1 && remainder){    
    if (remainder > 0 && remainder < 125) {
      return '&#188;'
    } else if (remainder >= 125 && remainder < 275) {
      return '&#188;';
    } else if (remainder >= 275 && remainder < 400) {
      return '&#8531;';
    } else if (remainder >= 400 && remainder < 550) {
      return '&#189;';
    } else if (remainder >= 550 && remainder < 675) {
      return '&#8532;';
    } else if (remainder >= 675 && remainder < 875) {
      return '&#190;';
    } else {
      return '1'
    }
  } else if (remainder) {
    if (remainder > 0 && remainder < 125) {
      return Math.floor(amount) > 0 ? Math.floor(amount).toString() : '&#188;'
    } else if (remainder >= 125 && remainder < 275) {
      return (Math.floor(amount)).toString() + ' &#188;';
    } else if (remainder >= 275 && remainder < 400) {
      return (Math.floor(amount)).toString() + ' &#8531;';
    } else if (remainder >= 400 && remainder < 550) {
      return (Math.floor(amount)).toString() + ' &#189;';
    } else if (remainder >= 550 && remainder < 675) {
      return (Math.floor(amount)).toString() + ' &#8532;';
    } else if (remainder >= 675 && remainder < 875) {
      return (Math.floor(amount)).toString() + ' &#190;';
    } else {
      return Math.ceil(amount) > 0? (Math.ceil(amount)).toString() : '&#188;';
    }
  } else return amount.toString();
}

export function getNiceDecimalNumber(amount: number): number {
  let remainder = (amount * 1000) % 1000;
 if (remainder) {
    if (remainder > 0 && remainder < 125) {
      return Math.floor(amount) > 0 ? Math.floor(amount) : 0.25;
    } else if (remainder >= 125 && remainder < 275) {
      return Math.floor(amount) + 0.25;
    } else if (remainder >= 275 && remainder < 400) {
      return Math.floor(amount) + 0.3;
    } else if (remainder >= 400 && remainder < 550) {
      return Math.floor(amount) + 0.5;
    } else if (remainder >= 550 && remainder < 675) {
      return Math.floor(amount) + 0.6;
    } else if (remainder >= 675 && remainder < 875) {
      return Math.floor(amount) + 0.75;
    } else {
      return Math.ceil(amount) > 0? Math.ceil(amount) : 0.25;
    }
  } else return amount;
}

export function getRecipyNameById(
  allRecipies: Recipy[],
  recipyToFindId: string
): string {
  return allRecipies.find((rec) => rec.id == recipyToFindId)!.name;
}

export const getUnitText = (unit: MeasuringUnit) => MeasuringUnitText[unit];

export function transformToGr(
  ingrId: string,
  amount: number,
  unit: MeasuringUnit,
  allProducts: Product[]
): number {
  let density: number = getDensity(ingrId, allProducts);
  let grInOneItem: number = getGrPerItem(ingrId, allProducts);
  switch (unit) {
    case MeasuringUnit.gr:
      return amount;
    case MeasuringUnit.kg:
      return kgToGR(amount);
    case MeasuringUnit.bunch:
      return bunchToGr(amount);
    case MeasuringUnit.coffeeSpoon:
    case MeasuringUnit.dessertSpoon:
    case MeasuringUnit.tableSpoon:
    case MeasuringUnit.teaSpoon:
    case MeasuringUnit.ml:
    case MeasuringUnit.l:
    case MeasuringUnit.cup:
    case MeasuringUnit.cl:
    case MeasuringUnit.us_cup:
      return (amount * density) / getAmountInL(unit);
    case MeasuringUnit.pinch:
      return pinchToGr(amount, density);
    case MeasuringUnit.item:
      return itemsToGr(amount, grInOneItem);
    case MeasuringUnit.oz:
      return OZToGr(amount);
    case MeasuringUnit.lb:
      return LbToGr(amount);
    default:
      return 0;
  }
}

export function getCalorificValue(
  ingr: Ingredient,
  allProducts: Product[]
): number {
  return allProducts.find((product) => product.id == ingr.product)!.calories;
}

export function getPreparationTime(recipy: Recipy) {
  let time = 0;
  for (let step of recipy.steps) {
    time = time + +step.timeActive + +step.timePassive;
  }
  return time;
}

export function getActivePreparationTime(recipy: Recipy) {
  let time = 0;
  for (let step of recipy.steps) {
    time = time + +step.timeActive;
  }
  return time;
}

export function getPassivePreparationTime(recipy: Recipy) {
  let time = 0;
  for (let step of recipy.steps) {
    time = time + +step.timePassive;
  }
  return time;
}
