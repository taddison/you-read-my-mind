import Gauge from "../components/gauge";
import Slider from "rc-slider";
import { useState } from "react";

const ComponentTest = () => {
  const min = -15;
  const max = 15;
  const [value, setValue] = useState(0);

  return (
    <div className="max-w-4xl mx-auto flex items-center mt-4 flex flex-col">
      <Gauge min={min} max={max} value={value} />
      <div
        className="mt-6 text-5xl font-black"
        style={{
          fontFeatureSettings: "'zero', 'tnum' 1",
        }}
      >
        {value}
      </div>
      <Slider min={min} max={max} value={value} onChange={setValue} />
    </div>
  )
}

export default ComponentTest;