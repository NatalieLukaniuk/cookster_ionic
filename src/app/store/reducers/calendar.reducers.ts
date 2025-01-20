import { Recipy } from 'src/app/models/recipies.models';
import {
  CalendarActions,
  CalendarActionTypes,
} from '../actions/calendar.actions';

export interface CalendarState {
  selectedRecipy: Recipy | null;
  addToCartDateRange: { startDate: string; endDate: string } | null;
  previewRecipy: {
    recipy: Recipy;
    portions: number;
    amountPerPortion: number;
  } | null;

}

export const InitialCalendarState: CalendarState = {
  selectedRecipy: null,
  addToCartDateRange: null,
  previewRecipy: null,
};

export function CalendarReducers(
  state: CalendarState = InitialCalendarState,
  action: CalendarActions
): CalendarState {
  switch (action.type) {

    case CalendarActionTypes.PREVIEW_RECIPY: {
      return {
        ...state,
        previewRecipy: {
          recipy: action.recipy,
          portions: action.portions,
          amountPerPortion: action.amountPerPortion,
        },
      };
    }

    case CalendarActionTypes.RESET_PREVIEW_RECIPY: {
      return {
        ...state,
        previewRecipy: null,
      };
    }

    case CalendarActionTypes.RESET_ADD_TO_CART_DATE_RANGE: {
      return {
        ...state,
        addToCartDateRange: null,
      };
    }

    case CalendarActionTypes.SET_ADD_TO_CART_DATE_RANGE: {
      return {
        ...state,
        addToCartDateRange: action.date,
      };
    }

    default:
      return state;
  }
}
