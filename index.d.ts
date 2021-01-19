import { Component, ReactNode, ComponentProps, RefObject } from "react";
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent
} from "react-native";
import { Duration } from "date-fns";
import { RecyclerListView } from 'recyclerlistview';

interface IDaySelectionAnimationBorder {
  type: "border";
  duration: number;
  borderWidth: number;
  borderHighlightColor: string;
  animType?: any;
  animUpdateType?: any;
  animProperty?: any;
  animSpringDamping?: any;
}

interface IDaySelectionAnimationBackground {
  type: "background";
  duration: number;
  highlightColor: string;
  animType?: any;
  animUpdateType?: any;
  animProperty?: any;
  animSpringDamping?: any;
}

interface IDayComponentProps {
  date: Duration;
  marking?: any;
  selected?: boolean;
  enabled: boolean;
  showDayName?: boolean;
  showDayNumber?: boolean;
  onDateSelected?: (event: GestureResponderEvent) => void;
  calendarColor?: string;
  dateNameStyle?: string;
  dateNumberStyle?: string;
  dayContainerStyle?: StyleProp<ViewStyle>;
  weekendDateNameStyle?: TextStyle;
  weekendDateNumberStyle?: TextStyle;
  highlightDateNameStyle?: TextStyle;
  highlightDateNumberStyle?: TextStyle;
  disabledDateNameStyle?: TextStyle;
  disabledDateNumberStyle?: TextStyle;
  styleWeekend?: boolean;
  daySelectionAnimation?: TDaySelectionAnimation;
  customStyle?: ViewStyle;
  size: number;
  allowDayTextScaling?: boolean;
  markedDatesStyle?: TextStyle;
  markedDates?: any[] | ((date: Date) => void);
}

type TDaySelectionAnimation =
  | IDaySelectionAnimationBorder
  | IDaySelectionAnimationBackground;

type TDateRange = {
  start: Date;
  end: Date;
};

interface CalendarStripProps {
  style: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  calendarColor?: string;

  numDaysInWeek?: number;
  scrollable?: boolean;
  scrollerPaging?: boolean;
  externalScrollView?: ComponentProps<typeof RecyclerListView>['externalScrollView'];
  startingDate?: Date;
  selectedDate?: Date;
  onDateSelected?: ((date: Date) => void);
  onWeekChanged?: ((start: Date, end: Date) => void);
  onHeaderSelected?: ((dates: {weekStartDate: Date, weekEndDate: Date}) => void);
  updateWeek?: boolean;
  useIsoWeekday?: boolean;
  minDate?: Date;
  maxDate?: Date;
  datesWhitelist?: TDateRange[] | ((date: Date) => void);
  datesBlacklist?: TDateRange[] | ((date: Date) => void);
  markedDates?: any[] | ((date: Date) => void);
  scrollToOnSetSelectedDate?: boolean;

  showMonth?: boolean;
  showDayName?: boolean;
  showDayNumber?: boolean;
  showDate?: boolean;

  leftSelector?: any;
  rightSelector?: any;
  iconLeft?: any;
  iconRight?: any;
  iconStyle?: any;
  iconLeftStyle?: any;
  iconRightStyle?: any;
  iconContainer?: any;

  maxDayComponentSize?: number;
  minDayComponentSize?: number;
  responsiveSizingOffset?: number;

  calendarHeaderContainerStyle?: StyleProp<ViewStyle>;
  calendarHeaderStyle?: StyleProp<TextStyle>;
  calendarHeaderFormat?: string;
  calendarHeaderPosition?: "below" | "above";

  calendarAnimation?: {
    duration: number;
    type: "sequence" | "parallel";
  };
  daySelectionAnimation?: TDaySelectionAnimation;

  customDatesStyles?: any[] | ((date: Date) => void);

  dayComponent?: (props: IDayComponentProps) => ReactNode;

  dateNameStyle?: StyleProp<TextStyle>;
  dateNumberStyle?: StyleProp<TextStyle>;
  weekendDateNameStyle?: StyleProp<TextStyle>;
  weekendDateNumberStyle?: StyleProp<TextStyle>;
  highlightDateNameStyle?: StyleProp<TextStyle>;
  highlightDateNumberStyle?: StyleProp<TextStyle>;
  disabledDateNameStyle?: StyleProp<TextStyle>;
  disabledDateNumberStyle?: StyleProp<TextStyle>;
  markedDatesStyle?: StyleProp<TextStyle>;
  disabledDateOpacity?: number;
  styleWeekend?: boolean;

  locale?: object;
  shouldAllowFontScaling?: boolean;
  useNativeDriver?: boolean;

  headerText?: string;

  ref?: RefObject;
}

export default class ReactNativeCalendarStrip extends Component<CalendarStripProps> {
  getSelectedDate: () => undefined | Date | string;
  setSelectedDate: (date: Date | string) => void;
  getNextWeek: () => void;
  getPreviousWeek: () => void;
  updateWeekView: (date: Date | string) => void;
}
