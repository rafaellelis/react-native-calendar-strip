import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { addWeeks, subWeeks } from "date-fns";

import CalendarScroller from "../src/Scroller";

configure({ adapter: new Adapter() });

const today = new Date();

describe("CalendarScroller Component", () => {
  it("should render without issues", () => {
    const component = shallow(
      <CalendarScroller
        minDate={subWeeks(today, 1)}
        maxDate={addWeeks(today, 1)}
      />
    );

    expect(component).toBeTruthy();
  });

});
