"use client"

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import Search from '@/components/Search'
import Weather from '@/components/Weather'
import Forecast from '@/components/Forecast'
import Today from '@/components/Today'
import Conditions from '@/components/Conditions'

const weather_api_key = '8e9dabd61de04890450548771dbbe0ec'

export default function Home() {

  // const [location, setLocation] = useState(null);

  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    getLoadLocation()
  }, [])

  const getLoadLocation = async () => {
    const url_loc = `https://api.geoapify.com/v1/ipinfo?apiKey=9280bcf0d9044af8bf960221fe15bfbd`
    const resp_loc = await axios.get(url_loc)
    console.log(resp_loc.data.location)
    // setLocation({ lat : resp_loc.data.location.latitude, lon : resp_loc.data.location.longitude})
    fetchWeather(resp_loc.data.location.latitude, resp_loc.data.location.longitude)
  }

  const handleSearch = async (searchTerm) => {
    const url_latlon = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=${5}&appid=${weather_api_key}`;
    const resp_latlon = await axios.get(url_latlon);
    return resp_latlon.data;
    // fetchWeather(resp_latlon.data[0].lat, resp_latlon.data[0].lon);
  };

  const handleResultClick = (result) => {
    
    fetchWeather(result.lat, result.lon);
    console.log(result); // Example: Log the selected result
  };

  const fetchWeather = async(lat, lon) => {
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=metric`
    const weather_resp = await axios.get(weather_url)
    const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=metric`
    const forecast_resp = await axios.get(forecast_url)
    const aqi_url = `https://api.api-ninjas.com/v1/airquality?lat=${lat}&lon=${lon}`
    const config = {
      headers: {
        'X-Api-Key': 'S1yi8CPC17pSHLsGiEtr1A==MZNMWBsQhxeXJgJk'
      },
    }
    const aqi_resp = await axios.get(aqi_url, config)
    console.log(aqi_resp.data)
    setWeatherData({weather : weather_resp.data, aqi: aqi_resp.data, forecast:forecast_resp.data})
  }

  return (
      <main className="w-screen min-h-screen grid place-items-center p-5 bg-gradient-to-t from-slate-950 to-slate-800 xl:h-screen">
        {!weatherData && <div className="absolute z-0 w-72 animate-spin flex flex-row">
          <img src="weather_icons/01d.svg" alt="" className="w-full h-full opacity-50" />
        </div>}
        {weatherData && <div className="w-full flex flex-col z-10 space-y-7 items-center shrink-1">
          <div className="w-4/5 flex flex-row justify-between">
            <Search onSearch={handleSearch}  onSelect={handleResultClick}/>
            <div className="w-10 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 shadow-lg border border-slate-700"></div>
          </div>
          <div className="hidden xl:flex flex-row gap-5 xl:w-4/5">
            <div className="flex shrink-0 flex-col basis-1/4 gap-5">
              <Weather props={weatherData.weather} />
              <Forecast props={weatherData.forecast} />
            </div>
            <div className="flex shrink flex-col basis-3/4 gap-5 max-w-5xl">
              <Conditions weather={weatherData.weather} aqi={weatherData.aqi}  />
              <Today props={weatherData.forecast} />
            </div>
          </div>
          <div className="w-[22rem] md:w-96 lg:w-auto flex flex-col gap-5 xl:hidden xl:w-full">
              <Weather props={weatherData.weather} />
              <Today props={weatherData.forecast} />
              <Forecast props={weatherData.forecast} />
              <Conditions weather={weatherData.weather} aqi={weatherData.aqi} />
          </div>
        </div>}
      </main>
  
  )
}
