import React from "react";
import { Clock, CloudRain } from "lucide-react";
import { WeatherData } from "../types";

interface HourlyForecastProps {
  data: WeatherData;
  isCelsius: boolean;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, isCelsius }) => {
  const hourlyData = data.forecast.forecastday[0]?.hour || [];

  if (hourlyData.length === 0) {
    return null;
  }

  // Filter hourly to only show current and future hours for today, or all hours if currently at night
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr.replace(/-/g, "/")); // Cross-browser compatibility
    const hours = date.getHours();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${ampm} ${displayHour}시`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6" id="hourly-forecast-container">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-sky-400" />
        <h3 className="text-base font-semibold text-slate-200">시간대별 날씨 (24시간)</h3>
      </div>

      <div 
        id="hourly-scroll-list"
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent -mx-2 px-2"
        style={{ scrollSnapType: "x proximity" }}
      >
        {hourlyData.map((hour, idx) => {
          const temp = isCelsius 
            ? Math.round(hour.temp_c) 
            : Math.round(hour.temp_f || (hour.temp_c * 1.8 + 32));
          const feelsLike = isCelsius
            ? Math.round(hour.feelslike_c)
            : Math.round(hour.feelslike_c * 1.8 + 32);

          // Find if it is current hour to style it differently
          const currentHour = new Date().getHours();
          const hourTime = new Date(hour.time.replace(/-/g, "/")).getHours();
          const isCurrent = currentHour === hourTime;

          return (
            <div
              key={`${hour.time}-${idx}`}
              id={`hour-item-${idx}`}
              className={`flex-shrink-0 w-24 rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all duration-300 scroll-snap-align-start border ${
                isCurrent 
                  ? "bg-sky-500/20 border-sky-400/50 shadow-lg shadow-sky-500/10 scale-105" 
                  : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              <span className={`text-xs ${isCurrent ? "text-sky-300 font-semibold" : "text-slate-400"}`}>
                {isCurrent ? "지금" : formatTime(hour.time)}
              </span>

              <img
                src={hour.condition.icon.startsWith("//") ? `https:${hour.condition.icon}` : hour.condition.icon}
                alt={hour.condition.text}
                className="w-10 h-10 my-1 drop-shadow-md select-none"
                draggable={false}
                referrerPolicy="no-referrer"
              />

              <div className="flex flex-col items-center">
                <span className="text-base font-mono font-bold text-slate-100">
                  {temp}°
                </span>
                <span className="text-[10px] text-slate-400">
                  체감 {feelsLike}°
                </span>
              </div>

              {hour.chance_of_rain > 0 && (
                <div className="flex items-center gap-0.5 mt-1.5 text-[10px] text-sky-400 font-semibold">
                  <CloudRain className="w-2.5 h-2.5" />
                  <span>{hour.chance_of_rain}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
