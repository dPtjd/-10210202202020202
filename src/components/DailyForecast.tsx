import React from "react";
import { Calendar, CloudRain, Sun } from "lucide-react";
import { WeatherData } from "../types";

interface DailyForecastProps {
  data: WeatherData;
  isCelsius: boolean;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ data, isCelsius }) => {
  const forecastDays = data.forecast.forecastday || [];

  const getDayName = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr.replace(/-/g, "/"));
    
    // Check if today
    if (today.toDateString() === date.toDateString()) {
      return "오늘";
    }

    // Check if tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (tomorrow.toDateString() === date.toDateString()) {
      return "내일";
    }

    const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return weekdays[date.getDay()];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr.replace(/-/g, "/"));
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-between" id="daily-forecast-container">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-slate-200">주간 일기예보</h3>
        </div>

        <div className="space-y-4" id="daily-forecast-list">
          {forecastDays.map((forecastDay, index) => {
            const day = forecastDay.day;
            const maxTemp = isCelsius 
              ? Math.round(day.maxtemp_c) 
              : Math.round(day.maxtemp_f || (day.maxtemp_c * 1.8 + 32));
            const minTemp = isCelsius 
              ? Math.round(day.mintemp_c) 
              : Math.round(day.mintemp_f || (day.mintemp_c * 1.8 + 32));

            return (
              <div
                key={forecastDay.date}
                id={`daily-item-${index}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10"
              >
                {/* Date & Weekday */}
                <div className="w-24">
                  <span className="text-sm font-semibold text-slate-100 block">
                    {getDayName(forecastDay.date)}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {formatDate(forecastDay.date)}
                  </span>
                </div>

                {/* Condition Icon & Text */}
                <div className="flex items-center gap-3 flex-1 px-2 justify-center">
                  <img
                    src={day.condition.icon.startsWith("//") ? `https:${day.condition.icon}` : day.condition.icon}
                    alt={day.condition.text}
                    className="w-10 h-10 drop-shadow-md select-none"
                    draggable={false}
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs text-slate-200 hidden sm:inline max-w-[80px] truncate">
                    {day.condition.text}
                  </span>
                </div>

                {/* Rain Probability / Info */}
                <div className="w-16 flex flex-col items-center justify-center text-center">
                  {day.daily_chance_of_rain > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-sky-400 font-semibold">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{day.daily_chance_of_rain}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-amber-400/80">
                      <Sun className="w-3.5 h-3.5" />
                      <span className="text-[10px]">맑음</span>
                    </div>
                  )}
                </div>

                {/* Temperatures (Low - High) */}
                <div className="w-24 flex items-center justify-end gap-3">
                  <span className="text-sm font-mono text-slate-400 font-medium">
                    {minTemp}°
                  </span>
                  
                  {/* Visual gradient range bar */}
                  <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden relative hidden xs:block">
                    <div className="absolute top-0 bottom-0 left-[20%] right-[10%] rounded-full bg-gradient-to-r from-blue-400 to-amber-400"></div>
                  </div>

                  <span className="text-sm font-mono text-slate-100 font-bold">
                    {maxTemp}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-white/5 pt-4">
        <p className="text-xs text-slate-400 leading-normal">
          💡 무료 WeatherAPI 등급은 최대 3일 예보를 제공하며, 기상청 공공데이터 포털 및 전 세계 기상 예측 수치모델 자료를 바탕으로 한 실시간 보정이 반영됩니다.
        </p>
      </div>
    </div>
  );
};
