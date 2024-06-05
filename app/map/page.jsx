"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GoChevronLeft } from "react-icons/go";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";

const map = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLoadLocation();
  }, []);

  const getLoadLocation = async () => {
    const url_loc = `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.NEXT_PUBLIC_LOCATION_KEY}`;
    const resp_loc = await axios.get(url_loc);
    console.log(resp_loc.data.location);
    setLocation([
      resp_loc.data.location.latitude,
      resp_loc.data.location.longitude,
    ]);
  };

  const mapRef = useRef();

  const layers = [
    {
      name: "Clouds",
      scaleClass:
        "h-8 bg-gradient-to-r from-[#ffffff00] via-[#f7f7ff80] to-[#f0f0ff] brightness-200 contrast-200 rounded-full",
      scale: ["0%", "50%", "100%"],
      layerClass: "brightness-200 contrast-200",
      id: "clouds_new",
    },
    {
      name: "Wind",
      scaleClass:
        "h-8 bg-wind-gradient saturation-200 hue-rotate-[140deg] rounded-full",
      scale: ["1 m/s", "25 m/s", "200 m/s"],
      layerClass: "saturation-200 hue-rotate-[140deg]",
      id: "wind_new",
    },
    {
      name: "Temperature",
      scaleClass:
        "h-8 bg-gradient-to-r from-[#821692] via-[#23dddd] to-[#fc8014] contrast-200 rounded-full",
      scale: ["-40 °C", "0 °C", "30 °C"],
      layerClass: "contrast-200",
      id: "temp_new",
    },
    {
      name: "Precipitation",
      scaleClass:
        "h-8 bg-gradient-to-r from-[#6e6ecd4d] via-[#5050e1b3] to-[#1414ffe6] rounded-full",
      scale: ["1mm", "10mm", "140mm"],
      layerClass: "",
      id: "precipitation_new",
    },
    {
      name: "Pressure",
      scaleClass:
        "h-8 bg-gradient-to-r from-[#0073ff] via-[#b0f720] to-[#c60000] rounded-full",
      scale: ["94000 Pa", "101000 Pa", "108000 Pa"],
      layerClass: "",
      id: "pressure_new",
    },
  ];

  const [layer, setLayer] = useState("Clouds");

  console.log(layers.find((e) => e.name == layer));

  return (
    <div className="relative w-screen h-screen text-white">
      <div className="absolute z-20 left-5 top-5 flex flex-col gap-2">
        <Link
          href="/"
          className="rounded-full bg-black/50 backdrop-blur text-lg w-10 h-10 flex items-center justify-center overflow-hidden outline-1 outline outline-neutral-500"
        >
          <GoChevronLeft size={28} />
        </Link>
        <div className="flex flex-col rounded-full bg-black/50 backdrop-blur text-lg items-center w-10 overflow-hidden outline-1 outline outline-neutral-500">
          <div
            className="p-3 hover:bg-neutral-400/20 rounded-full"
            onClick={() => {
              mapRef.current.zoomIn();
            }}
          >
            <AiOutlinePlus />
          </div>
          <div
            className="p-3 hover:bg-neutral-400/20 rounded-full"
            onClick={() => {
              mapRef.current.zoomOut();
            }}
          >
            <AiOutlineMinus />
          </div>
        </div>
      </div>
      <div className="absolute z-20 right-5 top-5 p-2 gap-1 flex flex-col rounded-2xl bg-black/50 backdrop-blur text-md font-extralight outline-1 outline outline-neutral-500">
        {layers.map((l) => (
          <div
            className={`px-3 w-full py-1 hover:bg-neutral-400/20 rounded-full cursor-pointer  ${
              layer == l.name && "bg-neutral-400/40"
            }`}
            onClick={() => setLayer(l.name)}
          >
            {l.name}
          </div>
        ))}
      </div>
      <div className="absolute bottom-5 z-20 w-screen p-5">
        <div className="w-full sm:w-72 sm:left-5 p-2 gap-1 flex flex-col rounded-2xl bg-black/50 backdrop-blur text-md font-extralight outline-1 outline outline-neutral-500">
          <div className={layers.find((e) => e.name == layer).scaleClass}></div>
          <div className="w-full flex justify-between text-xs p-1">
            {layers
              .find((e) => e.name == layer)
              .scale.map((s) => (
                <div>{s}</div>
              ))}
          </div>
        </div>
      </div>
      {location && (
        <MapContainer
          center={location}
          zoom={5}
          zoomControl={false}
          ref={mapRef}
          zoomAnimation={true}
          className="absolute z-10 w-full h-full"
        >
          <TileLayer
            url="https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=etpr94eY6NQFt3OKvQO2"
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            className="invert grayscale"
          />
          {layers.map(
            (l) =>
              layer == l.name && (
                <TileLayer
                  leaflet={L}
                  url={`https://tile.openweathermap.org/map/${l.id}/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`}
                  attribution='<a href="https://openweathermap.org/" target="_blank">&copy; OpenWeather</a>'
                  className={l.layerClass}
                />
              )
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default map;
