import Image from "next/image";

const Weather = (props) => {
  const weatherData = props.props;

  console.log(weatherData);

  const date = new Date((weatherData.dt + weatherData.timezone) * 1000);
  const options = { weekday: "short", day: "numeric", month: "short" };
  const formattedDate = date.toLocaleString("en-US", options);

  return (
    <div className="p-5 basis-1/2 flex flex-col backdrop-blur-lg bg-white/5 shadow-lg space-y-8 border-2 border-black">
      <div className="flex flex-row items-center justify-between">
        <div className="h-full flex flex-col justify-between pt-3">
          <div className="text-5xl">{Math.round(weatherData.main.temp)}°ᶜ</div>
          <div className="text-sm">
            Feels like {Math.round(weatherData.main.feels_like)}°ᶜ
          </div>
        </div>
        <div className="flex flex-col gap-y-3 items-center">
          <Image
            className="w-20 h-full invert"
            src={`weather_icons/${weatherData.weather[0].icon}.svg`}
            alt=""
          />
          <div className="text-xs">
            {weatherData.weather[0].description.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row">
        <div className="">
          {[weatherData.name, ", ", weatherData.sys.country]}
        </div>
        <div className="mx-auto mr-0">{formattedDate}</div>
      </div>
    </div>
  );
};

export default Weather;
