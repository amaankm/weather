import Condition from "./Condition";
import { IoWaterOutline } from "react-icons/io5";
import { SlEye } from "react-icons/sl";
import { CiLocationArrow1 } from "react-icons/ci";

const Conditions = (props) => {
  const { weather, aqi } = props;

  let dotColor, aqi_cat;

  if (aqi.overall_aqi < 51) {
    (dotColor = "text-green-500"), (aqi_cat = "Good");
  } else if (aqi.overall_aqi < 101) {
    (dotColor = "text-lime-700"), (aqi_cat = "Fair");
  } else if (aqi.overall_aqi < 201) {
    (dotColor = "text-yellow-400"), (aqi_cat = "Moderate");
  } else if (aqi.overall_aqi < 301) {
    (dotColor = "text-orange-500"), (aqi_cat = "Poor");
  } else if (aqi.overall_aqi < 401) {
    (dotColor = "text-red-600"), (aqi_cat = "Very Poor");
  } else {
    (dotColor = "text-red-900"), (aqi_cat = "Severe");
  }

  return (
    <div className="p-8 basis-4/9 backdrop-blur-lg bg-white/5 shadow-lg space-y-8 border-2 border-black">
      <div className="grid grid-cols-2 items-center justify-around xl:grid-cols-4">
        <Condition
          title="Humdity"
          quantity={Math.round(weather.main.humidity)}
          unit="%"
          Icon={IoWaterOutline}
        />
        <Condition
          title="Visibility"
          quantity={Math.round(weather.visibility / 1000)}
          unit="km"
          Icon={SlEye}
        />
        <Condition
          title="Wind speed"
          quantity={Math.round(weather.wind.speed * 3.6)}
          unit="km/h"
          Icon={CiLocationArrow1}
          rotateValue={weather.wind.deg + 135}
        />
        <Condition
          title="AQI"
          quantity={aqi_cat}
          unit={`(${aqi.overall_aqi})`}
          label={<div className={`text-3xl m-1 h-full ${dotColor}`}>•</div>}
        />
      </div>
    </div>
  );
};

export default Conditions;
