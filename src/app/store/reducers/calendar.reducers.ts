import { Day } from 'src/app/models/calendar.models';
import { Recipy } from 'src/app/models/recipies.models';
import {
  CalendarActions,
  CalendarActionTypes,
} from '../actions/calendar.actions';

export interface CalendarState {
  selectedRecipy: Recipy | null;
  selectedDay: { day: Day; meal: string } | null;
  addToCartDateRange: { startDate: string; endDate: string } | null;
  previewRecipy: {
    recipy: Recipy;
    portions: number;
    amountPerPortion: number;
  } | null;
  calendar: Day[] | null;
}

export const InitialCalendarState: CalendarState = {
  selectedRecipy: null,
  selectedDay: null,
  addToCartDateRange: null,
  previewRecipy: null,
  calendar: null,
};

export function CalendarReducers(
  state: CalendarState = InitialCalendarState,
  action: CalendarActions
): CalendarState {
  switch (action.type) {
    case CalendarActionTypes.LOAD_CALENDAR: {
      return {
        ...state,
        calendar: action.calendar,
      };
    }

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

    case CalendarActionTypes.SET_RECIPY_SELECTED: {
      return {
        ...state,
        selectedRecipy: action.recipy,
      };
    }
    case CalendarActionTypes.SET_DAY_SELECTED: {
      return {
        ...state,
        selectedDay: action.date,
      };
    }
    case CalendarActionTypes.RESET_CALENDAR_STATE: {
      return {
        ...state,
        selectedDay: null,
        selectedRecipy: null,
      };
    }
    default:
      return state;
  }
}
