"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Search from "@/components/Search";
import Weather from "@/components/Weather";
import Forecast from "@/components/Forecast";
import Today from "@/components/Today";
import Conditions from "@/components/Conditions";
import { CiBrightnessUp, CiDark, CiLocationOn, CiMap } from "react-icons/ci";
import Link from "next/link";
import { PuffLoader } from "react-spinners";

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);

  const [dark, setDark] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLoadLocation();
  }, []);

  const getLoadLocation = async () => {
    const url_loc = `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.NEXT_PUBLIC_LOCATION_KEY}`;
    const resp_loc = await axios.get(url_loc);
    // console.log(resp_loc.data.location);
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
  };

  const handleResultClick = (result) => {
    fetchWeather(result.lat, result.lon);
    // console.log(result); // Example: Log the selected result
  };

  const fetchWeather = async (lat, lon) => {
    setIsLoading(true);
    try {
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
      // console.log(aqi_resp.data);
      setWeatherData({
        weather: weather_resp.data,
        aqi: aqi_resp.data,
        forecast: forecast_resp.data,
      });
      // console.log(forecast_resp.data);
    } catch (err) {
      throw new Error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className={`w-screen min-h-screen grid place-items-center p-5 bg-white ${
        dark && "invert"
      }`}
    >
      {!weatherData && (
        <div className="h-[70vh] flex flex-col justify-center items-center">
          <PuffLoader size={100} color="black" />
        </div>
      )}
      {weatherData && (
        <div className="w-full flex flex-col z-10 space-y-7 items-center shrink-1">
          <div className="w-full sm:w-4/5 flex flex-row justify-between">
            <Search onSearch={handleSearch} onSelect={handleResultClick} />
            <div className="flex gap-3">
              <div
                className="w-10 h-10 p-1 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 shadow-lg border-2 border-black"
                onClick={getLoadLocation}
              >
                <CiLocationOn size={28} />
              </div>
              <div
                onClick={() => setDark(!dark)}
                className="w-10 h-10 p-1 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 shadow-lg border-2 border-black"
              >
                {!dark && <CiBrightnessUp size={28} />}
                {dark && <CiDark size={28} />}
              </div>
              <Link
                href="/map"
                className="w-10 h-10 p-1 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 shadow-lg border-2 border-black"
              >
                <CiMap size={28} />
              </Link>
            </div>
          </div>
          <div
            className={`hidden xl:flex flex-row gap-5 xl:w-4/5 transition ${
              isLoading ? "blur-lg" : "blur-0"
            }`}
          >
            <div className="flex shrink-0 flex-col basis-1/4 gap-5">
              <Weather props={weatherData.weather} />
              <Forecast props={weatherData.forecast} />
            </div>
            <div className="h-max flex shrink flex-col basis-3/4 gap-5 max-w-5xl">
              <Conditions weather={weatherData.weather} aqi={weatherData.aqi} />
              <Today props={weatherData.forecast} />
            </div>
          </div>
          <div
            className={`w-[22rem] md:w-96 lg:w-auto flex flex-col gap-5 xl:hidden xl:w-full transition ${
              isLoading ? "blur-lg" : "blur-0"
            }`}
          >
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
