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
