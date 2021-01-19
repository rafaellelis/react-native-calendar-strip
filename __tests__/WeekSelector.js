import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { addWeeks } from "date-fns";

import WeekSelector from "../src/WeekSelector";

configure({ adapter: new Adapter() });

const today = new Date();

describe("WeekSelector Component", () => {
  it("should render without issues", () => {
    const component = shallow(
      <WeekSelector
        controlDate={today}
        weekStartDate={today}
        weekEndDate={addWeeks(today, 1)}
        size={50}
      />
    );

    expect(component).toBeTruthy();
  });

});
