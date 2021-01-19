import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { addWeeks } from "date-fns";

import CalendarHeader from "../src/CalendarHeader";

configure({ adapter: new Adapter() });

const today = new Date();

describe("CalendarHeader Component", () => {
  it("should render without issues", () => {
    const component = shallow(
      <CalendarHeader
        calendarHeaderFormat="MMMM yyyy"
        weekStartDate={today}
        weekEndDate={addWeeks(today, 1)}
        fontSize={20}
        allowHeaderTextScaling={true}
      />
    );

    expect(component).toBeTruthy();
  });

  it("should render custom header without issues", () => {
    const component = shallow(
      <CalendarHeader
        calendarHeaderFormat="MMMM yyyy"
        weekStartDate={today}
        weekEndDate={addWeeks(today, 1)}
        fontSize={20}
        allowHeaderTextScaling={true}
        headerText={"Custom Header"}
      />
    );

    expect(component).toBeTruthy();
  });
});
