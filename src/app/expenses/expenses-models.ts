import { MeasuringUnit } from "../models/recipies.models";

export interface ExpenseItem {
    productId: string;
    title: string;
    brand?: string;
    purchasePlace: string;
    purchaseDate: Date;
    amount: number;
    unit: MeasuringUnit;
    cost: number;
    currency: Currency;
    costPerHundredGrInHRN: number
}

export enum Currency {
    Hruvnya = 'hrn',
    Dollar = 'usd',
    Euro = 'eur'
}

export const CurrencyOptions = [
    Currency.Hruvnya,
    Currency.Dollar,
    Currency.Euro
]

export enum CurrencyText {
    hrn = 'Гривня',
    usd = 'Доллар',
    eur = 'Євро'
}