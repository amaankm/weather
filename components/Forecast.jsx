import Image from "next/image";

const Forecast = (props) => {
  const forecast = props.props;

  //   console.log(forecast);

  const filteredList = forecast.list.filter(
    (item, index) => index >= 7 && (index + 1) % 8 === 0
  );

  return (
    <div className="w-full h-full basis-5/9 p-5 backdrop-blur-lg bg-white/5 shadow-lg border-2 border-black flex flex-col justify-between">
      <div className="font-extralight mb-5">5 Days Forecast</div>
      {filteredList.map((item, index) => {
        const date = new Date(item.dt_txt);
        const options = { weekday: "short", day: "numeric", month: "short" };
        const formattedDate = date.toLocaleString("en-US", options);
        return (
          <div
            key={index}
            className="flex flex-row content-center items-center gap-5 px-3"
          >
            <Image
              className="w-10 h-full invert"
              src={`weather_icons/${item.weather[0].icon}.svg`}
              alt=""
              width={30}
              height={30}
            />
            <div>{Math.round(item.main.temp)}°ᶜ</div>
            <div className="m-auto mr-0">{formattedDate}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Forecast;
