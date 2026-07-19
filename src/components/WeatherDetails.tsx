import React from "react";
import { 
  Wind, 
  Droplets, 
  Thermometer, 
  Sun, 
  Activity, 
  Sunrise, 
  Sunset, 
  CloudRain, 
  Gauge 
} from "lucide-react";
import { WeatherData } from "../types";

interface WeatherDetailsProps {
  data: WeatherData;
  isCelsius: boolean;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data, isCelsius }) => {
  const { current, forecast } = data;
  const todayForecast = forecast.forecastday[0];
  const aqi = current.air_quality;

  const tempUnit = isCelsius ? "°C" : "°F";
  const feelsLike = isCelsius 
    ? `${current.feelslike_c}${tempUnit}` 
    : `${current.feelslike_f || Math.round(current.feelslike_c * 1.8 + 32)}${tempUnit}`;

  // Helper for AQI Text (EPA standard index)
  const getAqiText = (index?: number) => {
    if (!index) return { text: "정보 없음", color: "text-slate-400 bg-slate-500/10 border-slate-500/25" };
    switch (index) {
      case 1: return { text: "좋음 (Good)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" };
      case 2: return { text: "보통 (Moderate)", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" };
      case 3: return { text: "민감군 영향 (Unhealthy for Sensitive Groups)", color: "text-orange-400 bg-orange-500/10 border-orange-500/25" };
      case 4: return { text: "나쁨 (Unhealthy)", color: "text-red-400 bg-red-500/10 border-red-500/25" };
      case 5: return { text: "매우 나쁨 (Very Unhealthy)", color: "text-purple-400 bg-purple-500/10 border-purple-500/25" };
      case 6: return { text: "위험 (Hazardous)", color: "text-rose-400 bg-rose-500/10 border-rose-500/25" };
      default: return { text: "보통", color: "text-slate-400 bg-slate-500/10 border-slate-500/25" };
    }
  };

  const aqiInfo = getAqiText(aqi?.["us-epa-index"]);

  const details = [
    {
      id: "detail-feels-like",
      icon: <Thermometer className="w-5 h-5 text-amber-400" />,
      label: "체감 온도",
      value: feelsLike,
      description: `실제 피부로 느끼는 온도입니다.`,
    },
    {
      id: "detail-humidity",
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      label: "습도",
      value: `${current.humidity}%`,
      description: `현재 대기 중의 수증기량입니다.`,
    },
    {
      id: "detail-wind",
      icon: <Wind className="w-5 h-5 text-teal-400" />,
      label: "바람",
      value: `${current.wind_kph} km/h`,
      description: `풍향: ${current.wind_dir} 방향에서 붑니다.`,
    },
    {
      id: "detail-uv",
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      label: "자외선 지수",
      value: `${current.uv.toFixed(1)}`,
      description: current.uv <= 2 ? "낮음" : current.uv <= 5 ? "보통" : current.uv <= 7 ? "높음" : current.uv <= 10 ? "매우 높음" : "위험",
    },
    {
      id: "detail-precip",
      icon: <CloudRain className="w-5 h-5 text-sky-400" />,
      label: "강수량",
      value: `${current.precip_mm} mm`,
      description: `오늘 총 강수 확률: ${todayForecast?.day?.daily_chance_of_rain || 0}%`,
    },
    {
      id: "detail-pressure",
      icon: <Gauge className="w-5 h-5 text-purple-400" />,
      label: "기압",
      value: `${current.pressure_mb} hPa`,
      description: `대기압 상태입니다.`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="weather-details-section">
      {/* Air Quality (Span 2 in desktop for premium visual) */}
      <div 
        id="detail-card-aqi"
        className="col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:bg-white/10"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">통합 대기질 (AQI)</span>
          </div>
          {aqi?.["us-epa-index"] && (
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${aqiInfo.color}`}>
              {aqiInfo.text}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div>
            <span className="text-xs text-slate-400 block">초미세먼지 (PM2.5)</span>
            <span className="text-lg font-mono font-semibold text-slate-100">
              {aqi?.pm2_5 ? `${aqi.pm2_5.toFixed(1)} ㎍/㎥` : "정보 없음"}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">미세먼지 (PM10)</span>
            <span className="text-lg font-mono font-semibold text-slate-100">
              {aqi?.pm10 ? `${aqi.pm10.toFixed(1)} ㎍/㎥` : "정보 없음"}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 border-t border-white/5 pt-2">
          대기 환경을 나타내는 국가 표준지수입니다.
        </p>
      </div>

      {/* Sunrise & Sunset */}
      <div 
        id="detail-card-sun"
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:bg-white/10"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium text-slate-300">일출 & 일몰</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Sunrise className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-xs text-slate-400 block">일출</span>
              <span className="text-sm font-mono font-medium text-slate-100">{todayForecast?.astro?.sunrise || "--:--"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sunset className="w-5 h-5 text-orange-500" />
            <div>
              <span className="text-xs text-slate-400 block">일몰</span>
              <span className="text-sm font-mono font-medium text-slate-100">{todayForecast?.astro?.sunset || "--:--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      {details.map((detail) => (
        <div
          key={detail.id}
          id={detail.id}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:bg-white/10"
        >
          <div className="flex items-center gap-2 mb-2">
            {detail.icon}
            <span className="text-sm font-medium text-slate-300">{detail.label}</span>
          </div>
          <div>
            <span className="text-xl font-mono font-semibold text-slate-100 block mb-1">
              {detail.value}
            </span>
            <p className="text-xs text-slate-400 leading-snug">{detail.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
