"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { GoChevronLeft } from "react-icons/go";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamically import the MapContainer and TileLayer to avoid SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const MapPage = () => {
  const [location, setLocation] = useState(null);
  const mapRef = useRef();
  const [layer, setLayer] = useState("Clouds");

  useEffect(() => {
    const getLoadLocation = async () => {
      const url_loc = `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.NEXT_PUBLIC_LOCATION_KEY}`;
      const resp_loc = await axios.get(url_loc);
      console.log(resp_loc.data.location);
      setLocation([
        resp_loc.data.location.latitude,
        resp_loc.data.location.longitude,
      ]);
    };

    getLoadLocation();
  }, []);

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

  return (
    <div className="relative w-screen h-screen text-white">
      <div className="absolute z-20 flex flex-col gap-2 left-5 top-5">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 overflow-hidden text-lg rounded-full bg-black/50 backdrop-blur outline-1 outline outline-neutral-500"
        >
          <GoChevronLeft size={28} />
        </Link>
        <div className="flex flex-col items-center w-10 overflow-hidden text-lg rounded-full bg-black/50 backdrop-blur outline-1 outline outline-neutral-500">
          <div
            className="p-3 rounded-full hover:bg-neutral-400/20"
            onClick={() => {
              mapRef.current.zoomIn();
            }}
          >
            <AiOutlinePlus />
          </div>
          <div
            className="p-3 rounded-full hover:bg-neutral-400/20"
            onClick={() => {
              mapRef.current.zoomOut();
            }}
          >
            <AiOutlineMinus />
          </div>
        </div>
      </div>
      <div className="absolute z-20 flex flex-col gap-1 p-2 right-5 top-5 rounded-2xl bg-black/50 backdrop-blur text-md font-extralight outline-1 outline outline-neutral-500">
        {layers.map((l) => (
          <div
            key={l.name}
            className={`px-3 w-full py-1 hover:bg-neutral-400/20 rounded-full cursor-pointer  ${
              layer == l.name && "bg-neutral-400/40"
            }`}
            onClick={() => setLayer(l.name)}
          >
            {l.name}
          </div>
        ))}
      </div>
      <div className="absolute z-20 w-screen p-5 bottom-5">
        <div className="flex flex-col w-full gap-1 p-2 sm:w-72 sm:left-5 rounded-2xl bg-black/50 backdrop-blur text-md font-extralight outline-1 outline outline-neutral-500">
          <div className={layers.find((e) => e.name == layer).scaleClass}></div>
          <div className="flex justify-between w-full p-1 text-xs">
            {layers
              .find((e) => e.name == layer)
              .scale.map((s, index) => (
                <div key={index}>{s}</div>
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
            url={`https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=${process.env.NEXT_PUBLIC_TILER_KEY}`}
            attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            className="invert grayscale"
          />
          {layers.map(
            (l) =>
              layer == l.name && (
                <TileLayer
                  key={l.id}
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

export default MapPage;
