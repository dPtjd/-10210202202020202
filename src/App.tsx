import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MapPin, 
  RefreshCw, 
  Info, 
  CloudRain, 
  Sun, 
  Cloud, 
  Snowflake, 
  Compass, 
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WeatherData, SearchSuggestion } from "./types";
import { WeatherDetails } from "./components/WeatherDetails";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";

export default function App() {
  const [city, setCity] = useState<string>("Seoul");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const suggestionRef = useRef<HTMLDivElement>(null);

  // Fetch weather data from our server proxy
  const fetchWeather = async (targetCity: string, isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    setError(null);
    try {
      const response = await fetch(`/api/weather/forecast?q=${encodeURIComponent(targetCity)}`);
      if (!response.ok) {
        throw new Error("날씨 정보를 불러오는 데 실패했습니다.");
      }
      const data: WeatherData = await response.json();
      setWeather(data);
      setCity(data.location.name);
      setSearchQuery("");
      setShowSuggestions(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "날씨 데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch autocomplete suggestions
  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Handle autocomplete input changes with simple debounce/trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine dynamic weather theme gradient classes
  const getWeatherTheme = (conditionCode?: number, isDay?: number) => {
    if (!conditionCode) return "from-slate-900 via-slate-950 to-neutral-900";
    
    // Day vs Night
    const dayNightPrefix = isDay === 0 ? "night" : "day";
    
    // Weather API condition codes
    // 1000: Clear, 1003: Partly Cloudy, 1006: Cloudy, 1009: Overcast
    // 1063+: Rainy/Snowy conditions
    if (conditionCode === 1000) {
      return isDay === 0
        ? "from-indigo-950 via-slate-900 to-slate-950" // Clear night
        : "from-sky-400 via-blue-500 to-indigo-600"; // Clear day
    } else if ([1003, 1006, 1009].includes(conditionCode)) {
      return isDay === 0
        ? "from-slate-900 via-slate-800 to-slate-950" // Cloudy night
        : "from-blue-500 via-slate-400 to-slate-600"; // Cloudy day
    } else if (conditionCode >= 1063 && conditionCode <= 1201) {
      return "from-slate-800 via-indigo-900 to-slate-950"; // Rainy
    } else if (conditionCode >= 1210 && conditionCode <= 1282) {
      return "from-blue-900 via-sky-800 to-slate-900"; // Snowy
    }
    
    return "from-slate-900 via-slate-950 to-neutral-900";
  };

  // Weather Condition Icon Fallbacks
  const getWeatherHeroIcon = (conditionCode?: number) => {
    if (!conditionCode) return <Cloud className="w-16 h-16 text-sky-400" />;
    if (conditionCode === 1000) return <Sun className="w-16 h-16 text-amber-400 drop-shadow-glow" />;
    if ([1003, 1006, 1009].includes(conditionCode)) return <Cloud className="w-16 h-16 text-slate-300" />;
    if (conditionCode >= 1063 && conditionCode <= 1201) return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (conditionCode >= 1210 && conditionCode <= 1282) return <Snowflake className="w-16 h-16 text-sky-200" />;
    return <Compass className="w-16 h-16 text-teal-400" />;
  };

  // Convert dates nicely
  const getFormattedLocaltime = (localtimeStr?: string) => {
    if (!localtimeStr) return "";
    try {
      const date = new Date(localtimeStr.replace(/-/g, "/"));
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      };
      return date.toLocaleDateString("ko-KR", options);
    } catch {
      return localtimeStr;
    }
  };

  const currentTemp = weather
    ? isCelsius 
      ? Math.round(weather.current.temp_c) 
      : Math.round(weather.current.temp_f || (weather.current.temp_c * 1.8 + 32))
    : 0;

  const maxTemp = weather && weather.forecast.forecastday[0]
    ? isCelsius 
      ? Math.round(weather.forecast.forecastday[0].day.maxtemp_c) 
      : Math.round(weather.forecast.forecastday[0].day.maxtemp_f || (weather.forecast.forecastday[0].day.maxtemp_c * 1.8 + 32))
    : 0;

  const minTemp = weather && weather.forecast.forecastday[0]
    ? isCelsius 
      ? Math.round(weather.forecast.forecastday[0].day.mintemp_c) 
      : Math.round(weather.forecast.forecastday[0].day.mintemp_f || (weather.forecast.forecastday[0].day.mintemp_c * 1.8 + 32))
    : 0;

  return (
    <div 
      id="app-root-container"
      className={`min-h-screen text-slate-100 bg-gradient-to-br ${getWeatherTheme(
        weather?.current.condition.code,
        weather?.current.is_day
      )} transition-all duration-1000 ease-in-out`}
    >
      {/* Simulation Banner */}
      <AnimatePresence>
        {weather?.isMock && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            id="simulation-banner"
            className="bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md text-amber-200 px-4 py-2 text-xs md:text-sm text-center flex items-center justify-center gap-2 font-medium"
          >
            <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>
              <strong>시뮬레이션 모드 작동 중:</strong> WEATHER_API_KEY가 설정되지 않아 고품질 모의 데이터가 노출됩니다. 실시간 날씨를 조회하려면 우측 상단 <strong>설정(Settings)</strong>에서 API 키를 설정해주세요.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8" id="main-content-layout">
        {/* Header and Search Panel */}
        <header id="header-section" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-white" id="app-title">
              오늘의 날씨
            </h1>
            <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full font-mono">
              Weather Flow
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-lg w-full md:justify-end">
            {/* Search Input Container */}
            <div className="relative flex-1 max-w-sm" ref={suggestionRef}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    fetchWeather(searchQuery);
                  }
                }}
                id="search-form"
                className="relative"
              >
                <div id="search-input-wrapper" className="relative">
                  <input
                    type="text"
                    placeholder="도시명을 영어 또는 한글로 검색하세요 (예: 서울, Jeju, Tokyo)..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-10 pr-12 py-2.5 bg-white/10 border border-white/10 rounded-full text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-300"
                    id="city-search-input"
                  />
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/50" />
                  
                  {/* Quick-search button inside input */}
                  {searchQuery.trim() && (
                    <button
                      type="submit"
                      className="absolute right-2 top-1.5 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95"
                      title="검색"
                      id="search-submit-btn"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    id="suggestions-dropdown"
                    className="absolute z-50 w-full mt-2 bg-slate-900/95 border border-white/10 rounded-2xl shadow-xl backdrop-blur-lg overflow-hidden"
                  >
                    <ul className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                      {suggestions.map((item) => (
                        <li key={item.id} id={`suggestion-item-${item.id}`}>
                          <button
                            type="button"
                            onClick={() => {
                              fetchWeather(item.name);
                            }}
                            className="w-full text-left px-4 py-3 text-xs md:text-sm hover:bg-white/10 text-slate-100 flex items-center justify-between transition-colors duration-200 cursor-pointer"
                          >
                            <span className="font-medium">
                              {item.koName ? `${item.koName} (${item.name})` : item.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {item.koRegion ? `${item.koRegion}, ` : item.region ? `${item.region}, ` : ""}{item.country === "South Korea" ? "대한민국" : item.country}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Metric Switcher */}
            <div 
              id="unit-toggle"
              className="bg-white/10 p-1 rounded-full flex border border-white/5 select-none"
            >
              <button
                onClick={() => setIsCelsius(true)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  isCelsius ? "bg-white text-slate-900 shadow-md" : "text-white/70 hover:text-white"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setIsCelsius(false)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  !isCelsius ? "bg-white text-slate-900 shadow-md" : "text-white/70 hover:text-white"
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </header>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" id="loading-spinner">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-sm text-slate-300 font-medium">실시간 기상 기압 관측 정보 분석 중...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 max-w-xl mx-auto text-center space-y-4" id="error-card">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-rose-200">데이터 조회 에러</h3>
              <p className="text-sm text-slate-300">{error}</p>
            </div>
            <button
              onClick={() => fetchWeather("Seoul")}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white text-xs font-semibold rounded-full transition-all duration-300"
            >
              서울 날씨로 새로고침
            </button>
          </div>
        ) : weather ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8"
            id="weather-display-body"
          >
            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Hero Weather Widget */}
              <div 
                id="hero-weather-card"
                className="lg:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between backdrop-blur-md relative overflow-hidden"
              >
                {/* Sun flare decoration for sunny weather */}
                {weather.current.condition.code === 1000 && weather.current.is_day === 1 && (
                  <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
                )}

                {/* Card Header: Location & Time */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                        {weather.location.name}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300">
                      {weather.location.region ? `${weather.location.region}, ` : ""}{weather.location.country}
                    </p>
                  </div>
                  <button
                    onClick={() => fetchWeather(city, true)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 active:scale-95"
                    title="기상 관측 새로고침"
                    disabled={isRefreshing}
                    id="refresh-weather-button"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-400" : ""}`} />
                  </button>
                </div>

                {/* Card Body: Large Temp & Icon */}
                <div className="my-8 flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-start">
                      <span className="text-6xl md:text-7xl font-display font-black tracking-tighter text-white">
                        {currentTemp}
                      </span>
                      <span className="text-2xl md:text-3xl font-display font-medium text-sky-300 mt-1">
                        °
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                      <span className="text-blue-300">최저 {minTemp}°</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-300">최고 {maxTemp}°</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="transform hover:scale-105 transition-transform duration-300">
                      {weather.current.condition.icon ? (
                        <img
                          src={weather.current.condition.icon.startsWith("//") ? `https:${weather.current.condition.icon}` : weather.current.condition.icon}
                          alt={weather.current.condition.text}
                          className="w-20 h-20 drop-shadow-glow"
                          draggable={false}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        getWeatherHeroIcon(weather.current.condition.code)
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-200 mt-1">
                      {weather.current.condition.text}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Current status summary & observation time */}
                <div className="border-t border-white/5 pt-4 flex justify-between items-center text-xs text-slate-400 relative z-10">
                  <span>실시간 관측 기준:</span>
                  <span className="font-mono">
                    {getFormattedLocaltime(weather.location.localtime)}
                  </span>
                </div>
              </div>

              {/* Right Columns: Main Weather Details Grid */}
              <div className="lg:col-span-2 space-y-6" id="bento-right-column">
                <WeatherDetails data={weather} isCelsius={isCelsius} />
              </div>

            </div>

            {/* Bottom Row: Hourly & Daily Forecasts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Hourly Forecast: Takes 2 columns */}
              <div className="lg:col-span-2" id="hourly-forecast-grid-item">
                <HourlyForecast data={weather} isCelsius={isCelsius} />
              </div>

              {/* Daily Forecast: Takes 1 column */}
              <div className="lg:col-span-1" id="daily-forecast-grid-item">
                <DailyForecast data={weather} isCelsius={isCelsius} />
              </div>

            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
