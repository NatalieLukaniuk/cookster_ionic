export interface NewRecipy {
  name: string;
  ingrediends: Ingredient[];
  complexity: Complexity;
  steps: PreparationStep[];
  type: DishType[];
  photo?: string;
  author: string;
  createdOn: number;
  clonedBy?: string;
  clonedOn?: number;
  originalRecipy?: string;
  isSplitIntoGroups: boolean;
  isBaseRecipy: boolean;
  notApproved?: boolean;
  source?: string;
  isCheckedAndApproved?: boolean;
}

export interface Recipy extends NewRecipy {
  id: string;
  name: string;
  ingrediends: Ingredient[];
  complexity: Complexity;
  steps: PreparationStep[];
  type: DishType[];
  photo?: string;
  author: string;
  createdOn: number;
  editedBy?: string;
  lastEdited?: number;
  clonedBy?: string;
  clonedOn?: number;
  originalRecipy?: string;
  isSplitIntoGroups: boolean;
  isCheckedAndApproved?: boolean;
  calorificValue?: number;
  source?: string;
}

export interface DraftRecipy {
  name: string;
  ingrediends?: Ingredient[];
  complexity: Complexity;
  steps?: PreparationStep[];
  type?: DishType[];
  photo?: string;
  author: string;
  createdOn: number;
  clonedBy?: string;
  clonedOn?: number;
  originalRecipy?: string;
  isSplitIntoGroups: boolean;
  isBaseRecipy: boolean;
  notApproved?: boolean;
  source?: string;
  isCheckedAndApproved?: boolean;
}

export interface Ingredient {
  product: string; // product id in the firebase db // FIXME: rename to productID
  amount: number; // gramm
  defaultUnit: MeasuringUnit;
  group?: string;
  ingredient?: string;
  prep?: string[];
}

export enum IngredientsGroup {
  Main = 'main',
  Filling = 'filling',
  Souce = 'souce',
  Dough = 'dough',
  Decoration = 'decoration',
}

export enum Complexity {
  simple = 1,
  medium = 2,
  difficult = 3,
}

export enum ComplexityDescription {
  'простий' = 1,
  'середній',
  'складний',
}

export interface PreparationStep {
  id?: number;
  description: string;
  timeActive: number; // minutes
  timePassive: number; // minutes
  group?: IngredientsGroup; // FIXME: not needed, delete
}

export enum DishType {
  'святкові страви' = 1,
  'соуси' = 2,
  'перші страви' = 3,
  'другі страви' = 4,
  'гарячі закуски' = 5,
  'холодні закуски' = 6,
  'салати' = 7,
  'заготовки на зиму' = 8,
  'десерти' = 9,
  'дитяче меню' = 10,
  'дієтичне меню' = 11,
  'вегетаріанські страви' = 12,
  'сніданок' = 13,
  'потребує попередньої підготовки' = 14,
  "м'ясна страва" = 15,
  'гостра страва' = 16,
  'приготування в духовці' = 17,
  'на грилі' = 18,
  'мультиварка' = 19,
  'на пару' = 20,
  'варіння' = 21,
  'без термообробки' = 22,
  'гарнір' = 23,
  'риба і морепродукти' = 24,
}

export enum MeasuringUnit {
  gr = 1,
  kg,
  l,
  ml,
  tableSpoon,
  dessertSpoon,
  teaSpoon,
  coffeeSpoon,
  pinch,
  bunch,
  item,
  cup,
  none,
}

export enum MeasuringUnitText {
  'гр' = 1,
  'кг',
  'л',
  'мл',
  'ст.л.',
  'дес.л.',
  'ч.л.',
  'коф.л.',
  'дрібка',
  'пучок',
  'шт.',
  'склянка',
  'за смаком',
}

export interface Product {
  id: string;
  name: string;
  density: number; // kg/dm3
  grInOneItem?: number;
  calories: number; //kKal,
  defaultUnit: MeasuringUnit;
  type: ProductType;
  sizeChangeCoef: number
}

export enum ProductType {
  fluid = 1,
  spice,
  herb,
  hardItem,
  hardHomogenious,
  granular,
}

export interface RecipyCollection {
  name: string;
  recipies: string[];
}

export const MeasuringUnitOptions = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.l,
  MeasuringUnit.ml,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.pinch,
  MeasuringUnit.bunch,
  MeasuringUnit.item,
  MeasuringUnit.cup,
  MeasuringUnit.none,
];

export const MeasuringUnitOptionsFluid = [
  MeasuringUnit.gr,
  MeasuringUnit.l,
  MeasuringUnit.ml,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.cup,
  MeasuringUnit.none
];

export const MeasuringUnitOptionsSpice = [
  MeasuringUnit.gr,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.pinch,
  MeasuringUnit.cup,
  MeasuringUnit.none
];

export const MeasuringUnitOptionsHerbs = [
  MeasuringUnit.gr,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.pinch,
  MeasuringUnit.bunch,
  MeasuringUnit.cup,
  MeasuringUnit.none
];

export const MeasuringUnitOptionsHardItems = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.item,
  MeasuringUnit.none
];

export const MeasuringUnitOptionsGranular = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.cup,
  MeasuringUnit.none
];

export const MeasuringUnitOptionsHardHomogeneous = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.none
];


export const ProductTypeOptions = [
  ProductType.fluid,
  ProductType.spice,
  ProductType.herb,
  ProductType.hardItem,
  ProductType.hardHomogenious,
  ProductType.granular
];

export enum ProductTypeText {
  'рідкий продукт' = 1,
  'подрібнена спеція',
  'трава',
  'твердий продукт',
  'твердий однорідний',
  'сипучий продукт (крупа, борошно)'
}
