import Image from "next/image";

import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

const Today = (props) => {
  const forecast = props.props;

  const filteredList = forecast.list.filter((item, index) => index < 6);

  const tempList = filteredList.map((el) => ({
    temp: Math.round(el.main.temp),
  }));

  return (
    <div className="w-full basis-5/9 p-5 gap-2 lg:gap-32 backdrop-blur-lg bg-white/5 shadow-lg border-2 border-black flex flex-col justify-between items-center">
      <p className="font-extralight mb-1">Today's Weather</p>
      {tempList && (
        <ResponsiveContainer
          height={280}
          width="95%"
          className="hidden lg:block absolute z-0 top-5"
        >
          <LineChart
            data={filteredList}
            margin={{ top: 0, right: 60, left: 60, bottom: 0 }}
          >
            <Line
              type="monotone"
              dataKey="main.temp"
              name="Temp"
              stroke="#000000"
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      )}
      <div className="w-full xl:relative xl:w-full">
        <div className="w-full flex flex-row space-x-5 overflow-x-auto xl:justify-around">
          {filteredList.map((item, index) => {
            const date = new Date(item.dt * 1000);
            // console.log(date);
            const time = date.toLocaleString("en-US", {
              hour: "numeric",
              hour12: true,
            });
            return (
              <div
                key={index}
                className="w-28 flex flex-col min-w-[100px] items-center gap-1 p-3 backdrop-blur-lg bg-white/2 shadow-lg border border-black"
              >
                <div className="">{time}</div>
                <Image
                  className="w-10 h-full invert"
                  src={`weather_icons/${item.weather[0].icon}.svg`}
                  alt=""
                  width={30}
                  height={30}
                />
                <div>{Math.round(item.main.temp)}°ᶜ</div>
                <div className="text-xs text-center h-10">
                  {item.weather[0].description.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Today;
