/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, { Component } from "react";
import {
  Text,
  View,
  Animated,
  Easing,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import { getDate, getISODay, isSameDay } from "date-fns";
import { isBetweenOnlyDays, formataData } from "./helper";

import styles from "./Calendar.style.js";

class CalendarDay extends Component {
  static propTypes = {
    date: PropTypes.object.isRequired,
    selectedDate: PropTypes.any,
    onDateSelected: PropTypes.func.isRequired,
    dayComponent: PropTypes.any,
    datesWhitelist: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    datesBlacklist: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),

    markedDates: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),

    showDayName: PropTypes.bool,
    showDayNumber: PropTypes.bool,

    calendarColor: PropTypes.string,
    size: PropTypes.number,

    dateNameStyle: PropTypes.any,
    dateNumberStyle: PropTypes.any,
    dayContainerStyle: PropTypes.any,
    weekendDateNameStyle: PropTypes.any,
    weekendDateNumberStyle: PropTypes.any,
    highlightDateNameStyle: PropTypes.any,
    highlightDateNumberStyle: PropTypes.any,
    highlightDateContainerStyle: PropTypes.any,
    disabledDateNameStyle: PropTypes.any,
    disabledDateNumberStyle: PropTypes.any,
    disabledDateOpacity: PropTypes.number,
    styleWeekend: PropTypes.bool,
    customDatesStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
    markedDatesStyle: PropTypes.object,
    allowDayTextScaling: PropTypes.bool,

    calendarAnimation: PropTypes.object,
    registerAnimation: PropTypes.func.isRequired,
    daySelectionAnimation: PropTypes.object,
    useNativeDriver: PropTypes.bool,
    scrollable: PropTypes.bool,
  };

  // Reference: https://medium.com/@Jpoliachik/react-native-s-layoutanimation-is-awesome-4a4d317afd3e
  static defaultProps = {
    daySelectionAnimation: {
      type: "", // animations disabled by default
      duration: 300,
      borderWidth: 1,
      borderHighlightColor: "black",
      highlightColor: "yellow",
      animType: LayoutAnimation.Types.easeInEaseOut,
      animUpdateType: LayoutAnimation.Types.easeInEaseOut,
      animProperty: LayoutAnimation.Properties.opacity,
      animSpringDamping: undefined, // Only applicable for LayoutAnimation.Types.spring,
    },
    styleWeekend: true,
    showDayName: true,
    showDayNumber: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      enabled: this.isDateAllowed(
        props.date,
        props.datesBlacklist,
        props.datesWhitelist
      ),
      selected: this.isDateSelected(props.date, props.selectedDate),
      customStyle: this.getCustomDateStyle(props.date, props.customDatesStyles),
      marking: this.getDateMarking(props.date, props.markedDates),
      animatedValue: new Animated.Value(0),
      ...this.calcSizes(props),
    };

    if (!props.scrollable) {
      props.registerAnimation(this.createAnimation());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let newState = {};
    let doStateUpdate = false;
    let hasDateChanged = prevProps.date !== this.props.date;

    if (this.props.selectedDate !== prevProps.selectedDate || hasDateChanged) {
      if (
        this.props.daySelectionAnimation.type !== "" &&
        !this.props.scrollable
      ) {
        let configurableAnimation = {
          duration: this.props.daySelectionAnimation.duration || 300,
          create: {
            type:
              this.props.daySelectionAnimation.animType ||
              LayoutAnimation.Types.easeInEaseOut,
            property:
              this.props.daySelectionAnimation.animProperty ||
              LayoutAnimation.Properties.opacity,
          },
          update: {
            type:
              this.props.daySelectionAnimation.animUpdateType ||
              LayoutAnimation.Types.easeInEaseOut,
            springDamping: this.props.daySelectionAnimation.animSpringDamping,
          },
          delete: {
            type:
              this.props.daySelectionAnimation.animType ||
              LayoutAnimation.Types.easeInEaseOut,
            property:
              this.props.daySelectionAnimation.animProperty ||
              LayoutAnimation.Properties.opacity,
          },
        };
        LayoutAnimation.configureNext(configurableAnimation);
      }
      newState.selected = this.isDateSelected(
        this.props.date,
        this.props.selectedDate
      );
      doStateUpdate = true;
    }

    if (prevProps.size !== this.props.size) {
      newState = { ...newState, ...this.calcSizes(this.props) };
      doStateUpdate = true;
    }

    if (
      prevProps.customDatesStyles !== this.props.customDatesStyles ||
      hasDateChanged
    ) {
      newState = {
        ...newState,
        customStyle: this.getCustomDateStyle(
          this.props.date,
          this.props.customDatesStyles
        ),
      };
      doStateUpdate = true;
    }

    if (prevProps.markedDates !== this.props.markedDates || hasDateChanged) {
      newState = {
        ...newState,
        marking: this.getDateMarking(this.props.date, this.props.markedDates),
      };
      doStateUpdate = true;
    }

    if (
      prevProps.datesBlacklist !== this.props.datesBlacklist ||
      prevProps.datesWhitelist !== this.props.datesWhitelist ||
      hasDateChanged
    ) {
      newState = {
        ...newState,
        enabled: this.isDateAllowed(
          this.props.date,
          this.props.datesBlacklist,
          this.props.datesWhitelist
        ),
      };
      doStateUpdate = true;
    }

    if (doStateUpdate) {
      this.setState(newState);
    }
  }

  calcSizes = (props) => {
    return {
      containerSize: Math.round(props.size),
      containerBorderRadius: Math.round(props.size / 2),
      dateNameFontSize: Math.round(props.size / 5),
      dateNumberFontSize: Math.round(props.size / 2.9),
    };
  };

  //Function to check if provided date is the same as selected one, hence date is selected
  isDateSelected = (date, selectedDate) => {
    if (!date || !selectedDate) {
      return date === selectedDate;
    }
    return isSameDay(date, selectedDate);
  };

  // Check whether date is allowed
  isDateAllowed = (date, datesBlacklist, datesWhitelist) => {
    // datesBlacklist entries override datesWhitelist
    if (Array.isArray(datesBlacklist)) {
      for (let disallowed of datesBlacklist) {
        // Blacklist start/end object
        if (disallowed.start && disallowed.end) {
          if (isBetweenOnlyDays(date, disallowed.start, disallowed.end)) {
            return false;
          }
        } else {
          if (isSameDay(date, disallowed)) {
            return false;
          }
        }
      }
    } else if (datesBlacklist instanceof Function) {
      return !datesBlacklist(date);
    }

    // Whitelist
    if (Array.isArray(datesWhitelist)) {
      for (let allowed of datesWhitelist) {
        // start/end object
        if (allowed.start && allowed.end) {
          if (isBetweenOnlyDays(date, allowed.start, allowed.end)) {
            return true;
          }
        } else {
          if (isSameDay(date, allowed)) {
            return true;
          }
        }
      }
      return false;
    } else if (datesWhitelist instanceof Function) {
      return datesWhitelist(date);
    }

    return true;
  };

  getCustomDateStyle = (date, customDatesStyles) => {
    if (Array.isArray(customDatesStyles)) {
      for (let customDateStyle of customDatesStyles) {
        if (customDateStyle.endDate) {
          // Range
          if (
            isBetweenOnlyDays(
              date,
              customDateStyle.startDate,
              customDateStyle.endDate
            )
          ) {
            return customDateStyle;
          }
        } else {
          // Single date
          if (isSameDay(date, customDateStyle.startDate)) {
            return customDateStyle;
          }
        }
      }
    } else if (customDatesStyles instanceof Function) {
      return customDatesStyles(date);
    }
  };

  getDateMarking = (day, markedDates) => {
    if (Array.isArray(markedDates)) {
      if (markedDates.length === 0) {
        return {};
      }
      return markedDates.find((md) => isSameDay(day, md.date)) || {};
    } else if (markedDates instanceof Function) {
      return markedDates(day) || {};
    }
  };

  createAnimation = () => {
    const { calendarAnimation, useNativeDriver } = this.props;

    if (calendarAnimation) {
      this.animation = Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: calendarAnimation.duration,
        easing: Easing.linear,
        useNativeDriver,
      });

      // Individual CalendarDay animation starts have unpredictable timing
      // when used with delays in RN Animated.
      // Send animation to parent to collect and start together.
      return this.animation;
    }
  };

  renderMarking() {
    if (!this.props.markedDates || this.props.markedDates.length === 0) {
      return;
    }
    const marking = this.state.marking;

    if (
      marking.dots &&
      Array.isArray(marking.dots) &&
      marking.dots.length > 0
    ) {
      return this.renderDots(marking);
    }
    if (
      marking.lines &&
      Array.isArray(marking.lines) &&
      marking.lines.length > 0
    ) {
      return this.renderLines(marking);
    }

    return (
      // default empty spacer
      <View style={styles.dotsContainer}>
        <View style={[styles.dot]} />
      </View>
    );
  }

  renderDots(marking) {
    const baseDotStyle = [styles.dot, styles.visibleDot];
    const markedDatesStyle = this.props.markedDatesStyle || {};
    const formattedDate = formataData(this.props.date, "yyyy-MM-dd");
    let validDots = <View style={[styles.dot]} />; // default empty view for no dots case

    // Filter dots and process only those which have color property
    validDots = marking.dots
      .filter((d) => d && d.color)
      .map((dot, index) => {
        const selectedColor = dot.selectedColor || dot.selectedDotColor; // selectedDotColor deprecated
        const backgroundColor =
          this.state.selected && selectedColor ? selectedColor : dot.color;
        return (
          <View
            key={dot.key || formattedDate + index}
            style={[baseDotStyle, { backgroundColor }, markedDatesStyle]}
          />
        );
      });

    return <View style={styles.dotsContainer}>{validDots}</View>;
  }

  renderLines(marking) {
    const baseLineStyle = [styles.line, styles.visibleLine];
    const markedDatesStyle = this.props.markedDatesStyle || {};
    let validLines = <View style={[styles.line]} />; // default empty view

    // Filter lines and process only those which have color property
    validLines = marking.lines
      .filter((d) => d && d.color)
      .map((line, index) => {
        const backgroundColor =
          this.state.selected && line.selectedColor
            ? line.selectedColor
            : line.color;
        const width = this.props.size * 0.6;
        return (
          <View
            key={line.key ? line.key : index}
            style={[
              baseLineStyle,
              { backgroundColor, width },
              markedDatesStyle,
            ]}
          />
        );
      });

    return <View style={styles.linesContainer}>{validLines}</View>;
  }

  render() {
    // Defaults for disabled state
    const {
      date,
      dateNameStyle,
      dateNumberStyle,
      dayContainerStyle,
      disabledDateNameStyle,
      disabledDateNumberStyle,
      disabledDateOpacity,
      calendarAnimation,
      daySelectionAnimation,
      highlightDateNameStyle,
      highlightDateNumberStyle,
      highlightDateContainerStyle,
      styleWeekend,
      weekendDateNameStyle,
      weekendDateNumberStyle,
      onDateSelected,
      showDayName,
      showDayNumber,
      allowDayTextScaling,
      dayComponent: DayComponent,
      scrollable,
    } = this.props;
    const {
      enabled,
      selected,
      containerSize,
      containerBorderRadius,
      customStyle,
      dateNameFontSize,
      dateNumberFontSize,
    } = this.state;

    let _dateNameStyle = [
      styles.dateName,
      enabled ? dateNameStyle : disabledDateNameStyle,
    ];
    let _dateNumberStyle = [
      styles.dateNumber,
      enabled ? dateNumberStyle : disabledDateNumberStyle,
    ];
    let _dateViewStyle = enabled
      ? [{ backgroundColor: "transparent" }]
      : [{ opacity: disabledDateOpacity }];
    let _customHighlightDateNameStyle;
    let _customHighlightDateNumberStyle;

    if (customStyle) {
      _dateNameStyle.push(customStyle.dateNameStyle);
      _dateNumberStyle.push(customStyle.dateNumberStyle);
      _dateViewStyle.push(customStyle.dateContainerStyle);
      _customHighlightDateNameStyle = customStyle.highlightDateNameStyle;
      _customHighlightDateNumberStyle = customStyle.highlightDateNumberStyle;
    }
    if (enabled) {
      // Enabled state
      //The user can disable animation, so that is why I use selection type
      //If it is background, the user have to input colors for animation
      //If it is border, the user has to input color for border animation
      switch (daySelectionAnimation.type) {
        case "background":
          _dateViewStyle.push({
            backgroundColor: daySelectionAnimation.highlightColor,
          });
          break;
        case "border":
          _dateViewStyle.push({
            borderColor: daySelectionAnimation.borderHighlightColor,
            borderWidth: daySelectionAnimation.borderWidth,
          });
          break;
        default:
          // No animation styling by default
          break;
      }

      _dateNameStyle = [styles.dateName, dateNameStyle];
      _dateNumberStyle = [styles.dateNumber, dateNumberStyle];
      if (styleWeekend && (getISODay(date) === 6 || getISODay(date) === 7)) {
        _dateNameStyle = [styles.weekendDateName, weekendDateNameStyle];
        _dateNumberStyle = [styles.weekendDateNumber, weekendDateNumberStyle];
      }
      if (selected) {
        _dateViewStyle.push(highlightDateContainerStyle);
        _dateNameStyle = [
          styles.dateName,
          highlightDateNameStyle,
          _customHighlightDateNameStyle,
        ];
        _dateNumberStyle = [
          styles.dateNumber,
          highlightDateNumberStyle,
          _customHighlightDateNumberStyle,
        ];
      }
    }

    let responsiveDateContainerStyle = {
      width: containerSize,
      height: containerSize,
      borderRadius: containerBorderRadius,
    };

    let day;
    if (DayComponent) {
      day = <DayComponent {...this.props} {...this.state} />;
    } else {
      day = (
        <TouchableOpacity
          onPress={onDateSelected.bind(this, date)}
          disabled={!enabled}
        >
          <View
            style={[
              styles.dateContainer,
              responsiveDateContainerStyle,
              _dateViewStyle,
              dayContainerStyle,
            ]}
          >
            {showDayNumber && (
              <View>
                <Text
                  style={[{ fontSize: dateNumberFontSize }, _dateNumberStyle]}
                  allowFontScaling={allowDayTextScaling}
                >
                  {getDate(date)}
                </Text>
                {this.renderMarking()}
              </View>
            )}
            {showDayName && (
              <Text
                style={[{ fontSize: dateNameFontSize }, _dateNameStyle]}
                allowFontScaling={allowDayTextScaling}
              >
                {formataData(date, "EEE").toUpperCase()}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return calendarAnimation && !scrollable ? (
      <Animated.View
        style={[
          styles.dateRootContainer,
          { opacity: this.state.animatedValue },
        ]}
      >
        {day}
      </Animated.View>
    ) : (
      <View style={styles.dateRootContainer}>{day}</View>
    );
  }
}

export default CalendarDay;
