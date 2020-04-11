import Gauge from "../components/gauge";
import Slider from "rc-slider";
import { useState } from "react";

const ComponentTest = () => {
  const min = -15;
  const max = 15;
  const [value, setValue] = useState(0);

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="flex items-center flex flex-col">
        <div className="text-xl font-semibold">
          Lucky
        </div>
        <div className="flex mt-6">
          <div className="flex items-center italic mr-6">A Cat's Name</div>
          <div className="flex flex-col items-center">
            <Gauge min={min} max={max} value={value} />
            <div
              className="mt-6 text-5xl font-black"
              style={{
                fontFeatureSettings: "'zero', 'tnum' 1",
              }}
            >
              {value}
            </div>
            <div className="w-3/4">
              <Slider min={min} max={max} value={value} onChange={setValue} />
            </div>
          </div>
          <div className="flex items-center italic ml-6">A Dog's Name</div>
        </div>
      </div>
    </div>
  );
};

export default ComponentTest;
