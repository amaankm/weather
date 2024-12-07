"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import Search from "@/components/Search";
import Weather from "@/components/Weather";
import Forecast from "@/components/Forecast";
import Today from "@/components/Today";
import Conditions from "@/components/Conditions";

export default function Home() {
  // const [location, setLocation] = useState(null);

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    getLoadLocation();
  }, []);

  const getLoadLocation = async () => {
    const url_loc = `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.NEXT_PUBLIC_LOCATION_KEY}`;
    const resp_loc = await axios.get(url_loc);
    console.log(resp_loc.data.location);
    // setLocation({ lat : resp_loc.data.location.latitude, lon : resp_loc.data.location.longitude})
    fetchWeather(
      resp_loc.data.location.latitude,
      resp_loc.data.location.longitude
    );
  };

  const handleSearch = async (searchTerm) => {
    const url_latlon = `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=${5}&appid=${
      process.env.NEXT_PUBLIC_WEATHER_KEY
    }`;
    const resp_latlon = await axios.get(url_latlon);
    return resp_latlon.data;
    // fetchWeather(resp_latlon.data[0].lat, resp_latlon.data[0].lon);
  };

  const handleResultClick = (result) => {
    fetchWeather(result.lat, result.lon);
    console.log(result); // Example: Log the selected result
  };

  const fetchWeather = async (lat, lon) => {
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;
    const weather_resp = await axios.get(weather_url);
    const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;
    const forecast_resp = await axios.get(forecast_url);
    const aqi_url = `https://api.api-ninjas.com/v1/airquality?lat=${lat}&lon=${lon}`;
    // console.log(weather_url);
    const config = {
      headers: {
        "X-Api-Key": process.env.NEXT_PUBLIC_X_KEY,
      },
    };
    const aqi_resp = await axios.get(aqi_url, config);
    console.log(aqi_resp.data);
    setWeatherData({
      weather: weather_resp.data,
      aqi: aqi_resp.data,
      forecast: forecast_resp.data,
    });
  };

  return (
    <main className="grid w-screen min-h-screen p-5 place-items-center bg-gradient-to-t from-slate-950 to-slate-800 xl:h-screen">
      {!weatherData && (
        <div className="absolute z-0 flex flex-row w-72 animate-spin">
          <img
            src="weather_icons/01d.svg"
            alt=""
            className="w-full h-full opacity-50"
          />
        </div>
      )}
      {weatherData && (
        <div className="z-10 flex flex-col items-center w-full space-y-7 shrink-1">
          <div className="flex flex-row justify-between w-4/5">
            <Search onSearch={handleSearch} onSelect={handleResultClick} />
            <div className="w-10 border rounded-full shadow-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 border-slate-700"></div>
          </div>
          <div className="flex-row hidden gap-5 xl:flex xl:w-4/5">
            <div className="flex flex-col gap-5 shrink-0 basis-1/4">
              <Weather props={weatherData.weather} />
              <Forecast props={weatherData.forecast} />
            </div>
            <div className="flex flex-col max-w-5xl gap-5 shrink basis-3/4">
              <Conditions weather={weatherData.weather} aqi={weatherData.aqi} />
              <Today props={weatherData.forecast} />
            </div>
          </div>
          <div className="w-[22rem] md:w-96 lg:w-auto flex flex-col gap-5 xl:hidden xl:w-full">
            <Weather props={weatherData.weather} />
            <Today props={weatherData.forecast} />
            <Forecast props={weatherData.forecast} />
            <Conditions weather={weatherData.weather} aqi={weatherData.aqi} />
          </div>
        </div>
      )}
    </main>
  );
}
