import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, TouchableOpacity } from "react-native";
import { getMonth, getYear } from "date-fns";

import { formataData } from './helper'
import styles from "./Calendar.style.js";

class CalendarHeader extends Component {
  static propTypes = {
    calendarHeaderFormat: PropTypes.string.isRequired,
    calendarHeaderContainerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    calendarHeaderStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    weekStartDate: PropTypes.object,
    weekEndDate: PropTypes.object,
    allowHeaderTextScaling: PropTypes.bool,
    fontSize: PropTypes.number,
    headerText: PropTypes.string,
    onHeaderSelected: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  //Function that formats the calendar header
  //It also formats the month section if the week is in between months
  formatCalendarHeader(calendarHeaderFormat) {
    if (!this.props.weekStartDate || !this.props.weekEndDate) {
      return "";
    }

    const firstDay = this.props.weekStartDate;
    const lastDay = this.props.weekEndDate;
    let monthFormatting = "";
    //Parsing the month part of the user defined formating
    if ((calendarHeaderFormat.match(/Mo/g) || []).length > 0) {
      monthFormatting = "Mo";
    } else {
      if ((calendarHeaderFormat.match(/M/g) || []).length > 0) {
        for (
          let i = (calendarHeaderFormat.match(/M/g) || []).length;
          i > 0;
          i--
        ) {
          monthFormatting += "M";
        }
      }
    }

    if (getMonth(firstDay) === getMonth(lastDay)) {
      return formataData(firstDay, calendarHeaderFormat);
    } else if (getYear(firstDay) !== getYear(lastDay)) {
      return `${formataData(firstDay, calendarHeaderFormat)} / ${formataData(lastDay,
        calendarHeaderFormat
      )}`;
    }

    return `${
      monthFormatting.length > 1 ? formataData(firstDay, monthFormatting) : ""
    } ${monthFormatting.length > 1 ? "/" : ""} ${formataData(lastDay,
      calendarHeaderFormat
    )}`;
  }

  render() {
    const {
      calendarHeaderFormat,
      onHeaderSelected,
      calendarHeaderContainerStyle,
      calendarHeaderStyle,
      fontSize,
      allowHeaderTextScaling,
      weekStartDate,
      weekEndDate,
      headerText,
    } = this.props;
    const _headerText = headerText || this.formatCalendarHeader(calendarHeaderFormat);

    return (
      <TouchableOpacity
        onPress={onHeaderSelected && onHeaderSelected.bind(this, {weekStartDate, weekEndDate})}
        disabled={!onHeaderSelected}
        style={calendarHeaderContainerStyle}
      >
        <Text
          style={[
            styles.calendarHeader,
            { fontSize: fontSize },
            calendarHeaderStyle
          ]}
          allowFontScaling={allowHeaderTextScaling}
        >
          {_headerText}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default CalendarHeader;
