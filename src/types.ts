export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime: string;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export interface AirQuality {
  pm2_5?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  co?: number;
  so2?: number;
  "us-epa-index"?: number;
}

export interface Current {
  temp_c: number;
  temp_f?: number;
  is_day: number;
  condition: Condition;
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f?: number;
  uv: number;
  air_quality?: AirQuality;
}

export interface DayForecast {
  maxtemp_c: number;
  maxtemp_f?: number;
  mintemp_c: number;
  mintemp_f?: number;
  avgtemp_c: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  avghumidity: number;
  daily_chance_of_rain: number;
  condition: Condition;
  uv: number;
}

export interface Astro {
  sunrise: string;
  sunset: string;
}

export interface HourForecast {
  time: string;
  temp_c: number;
  temp_f?: number;
  condition: Condition;
  wind_kph: number;
  feelslike_c: number;
  chance_of_rain: number;
  humidity: number;
}

export interface ForecastDay {
  date: string;
  day: DayForecast;
  astro: Astro;
  hour: HourForecast[];
}

export interface Forecast {
  forecastday: ForecastDay[];
}

export interface WeatherData {
  location: Location;
  current: Current;
  forecast: Forecast;
  isMock?: boolean;
  isErrorFallback?: boolean;
}

export interface SearchSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  koName?: string;
  koRegion?: string;
}
