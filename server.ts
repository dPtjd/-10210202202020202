import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "";

// Mock weather data for fallback (Simulation Mode)
const MOCK_WEATHER: Record<string, any> = {
  seoul: {
    location: {
      name: "서울",
      region: "Seoul",
      country: "South Korea",
      lat: 37.57,
      lon: 126.98,
      tz_id: "Asia/Seoul",
      localtime: "2026-07-18 18:30"
    },
    current: {
      temp_c: 26.5,
      is_day: 1,
      condition: {
        text: "맑음",
        icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
        code: 1000
      },
      wind_kph: 12.5,
      wind_dir: "WSW",
      pressure_mb: 1012,
      precip_mm: 0,
      humidity: 62,
      cloud: 10,
      feelslike_c: 27.8,
      uv: 5.0,
      air_quality: {
        pm2_5: 18.4,
        pm10: 32.1,
        o3: 0.042,
        no2: 0.015,
        "us-epa-index": 1
      }
    },
    forecast: {
      forecastday: [
        {
          date: "2026-07-18",
          day: {
            maxtemp_c: 29.0,
            mintemp_c: 21.0,
            avgtemp_c: 24.5,
            maxwind_kph: 15.0,
            totalprecip_mm: 0.0,
            avghumidity: 65,
            daily_chance_of_rain: 10,
            condition: {
              text: "맑음",
              icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
              code: 1000
            },
            uv: 6.0
          },
          astro: {
            sunrise: "05:21 AM",
            sunset: "07:54 PM"
          },
          hour: [
            { time: "2026-07-18 00:00", temp_c: 22.0, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" }, wind_kph: 8.0, feelslike_c: 22.0, chance_of_rain: 0, humidity: 75 },
            { time: "2026-07-18 03:00", temp_c: 21.0, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" }, wind_kph: 6.0, feelslike_c: 21.0, chance_of_rain: 0, humidity: 80 },
            { time: "2026-07-18 06:00", temp_c: 21.5, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" }, wind_kph: 7.0, feelslike_c: 21.5, chance_of_rain: 5, humidity: 78 },
            { time: "2026-07-18 09:00", temp_c: 24.0, condition: { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 10.0, feelslike_c: 25.0, chance_of_rain: 10, humidity: 70 },
            { time: "2026-07-18 12:00", temp_c: 27.5, condition: { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 12.0, feelslike_c: 29.0, chance_of_rain: 15, humidity: 60 },
            { time: "2026-07-18 15:00", temp_c: 28.5, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" }, wind_kph: 14.0, feelslike_c: 30.0, chance_of_rain: 10, humidity: 55 },
            { time: "2026-07-18 18:00", temp_c: 26.5, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" }, wind_kph: 12.0, feelslike_c: 27.8, chance_of_rain: 5, humidity: 62 },
            { time: "2026-07-18 21:00", temp_c: 24.0, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" }, wind_kph: 9.0, feelslike_c: 24.0, chance_of_rain: 5, humidity: 70 }
          ]
        },
        {
          date: "2026-07-19",
          day: {
            maxtemp_c: 30.5,
            mintemp_c: 22.0,
            avgtemp_c: 26.0,
            maxwind_kph: 18.0,
            totalprecip_mm: 1.5,
            avghumidity: 70,
            daily_chance_of_rain: 60,
            condition: {
              text: "한때 소나기",
              icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
              code: 1063
            },
            uv: 5.0
          },
          astro: {
            sunrise: "05:22 AM",
            sunset: "07:53 PM"
          },
          hour: []
        },
        {
          date: "2026-07-20",
          day: {
            maxtemp_c: 28.0,
            mintemp_c: 23.0,
            avgtemp_c: 25.5,
            maxwind_kph: 22.0,
            totalprecip_mm: 12.4,
            avghumidity: 85,
            daily_chance_of_rain: 85,
            condition: {
              text: "비",
              icon: "//cdn.weatherapi.com/weather/64x64/day/302.png",
              code: 1189
            },
            uv: 3.0
          },
          astro: {
            sunrise: "05:23 AM",
            sunset: "07:53 PM"
          },
          hour: []
        }
      ]
    }
  },
  jeju: {
    location: {
      name: "제주",
      region: "Jeju",
      country: "South Korea",
      lat: 33.51,
      lon: 126.53,
      tz_id: "Asia/Seoul",
      localtime: "2026-07-18 18:30"
    },
    current: {
      temp_c: 28.0,
      is_day: 1,
      condition: {
        text: "구름 조금",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003
      },
      wind_kph: 18.5,
      wind_dir: "S",
      pressure_mb: 1010,
      precip_mm: 0,
      humidity: 75,
      cloud: 25,
      feelslike_c: 31.5,
      uv: 7.0,
      air_quality: {
        pm2_5: 12.1,
        pm10: 22.4,
        o3: 0.045,
        no2: 0.008,
        "us-epa-index": 1
      }
    },
    forecast: {
      forecastday: [
        {
          date: "2026-07-18",
          day: {
            maxtemp_c: 30.0,
            mintemp_c: 24.0,
            avgtemp_c: 27.0,
            maxwind_kph: 20.0,
            totalprecip_mm: 0.0,
            avghumidity: 73,
            daily_chance_of_rain: 15,
            condition: {
              text: "구름 조금",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003
            },
            uv: 8.0
          },
          astro: {
            sunrise: "05:32 AM",
            sunset: "07:44 PM"
          },
          hour: [
            { time: "2026-07-18 00:00", temp_c: 25.0, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" }, wind_kph: 14.0, feelslike_c: 27.0, chance_of_rain: 5, humidity: 80 },
            { time: "2026-07-18 03:00", temp_c: 24.5, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" }, wind_kph: 15.0, feelslike_c: 26.5, chance_of_rain: 5, humidity: 82 },
            { time: "2026-07-18 06:00", temp_c: 25.0, condition: { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 16.0, feelslike_c: 27.5, chance_of_rain: 10, humidity: 80 },
            { time: "2026-07-18 09:00", temp_c: 27.0, condition: { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 18.0, feelslike_c: 30.2, chance_of_rain: 15, humidity: 76 },
            { time: "2026-07-18 12:00", temp_c: 29.5, condition: { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 19.0, feelslike_c: 33.1, chance_of_rain: 15, humidity: 72 },
            { time: "2026-07-18 15:00", temp_c: 29.0, condition: { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 18.0, feelslike_c: 32.5, chance_of_rain: 20, humidity: 74 },
            { time: "2026-07-18 18:00", temp_c: 28.0, condition: { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 18.5, feelslike_c: 31.5, chance_of_rain: 15, humidity: 75 },
            { time: "2026-07-18 21:00", temp_c: 26.0, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" }, wind_kph: 15.0, feelslike_c: 28.5, chance_of_rain: 10, humidity: 78 }
          ]
        },
        {
          date: "2026-07-19",
          day: {
            maxtemp_c: 31.0,
            mintemp_c: 25.0,
            avgtemp_c: 28.0,
            maxwind_kph: 24.0,
            totalprecip_mm: 0.0,
            avghumidity: 75,
            daily_chance_of_rain: 10,
            condition: {
              text: "맑음",
              icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
              code: 1000
            },
            uv: 9.0
          },
          astro: {
            sunrise: "05:33 AM",
            sunset: "07:43 PM"
          },
          hour: []
        },
        {
          date: "2026-07-20",
          day: {
            maxtemp_c: 31.5,
            mintemp_c: 26.0,
            avgtemp_c: 28.5,
            maxwind_kph: 25.0,
            totalprecip_mm: 0.5,
            avghumidity: 78,
            daily_chance_of_rain: 25,
            condition: {
              text: "구름 조금",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003
            },
            uv: 8.0
          },
          astro: {
            sunrise: "05:33 AM",
            sunset: "07:43 PM"
          },
          hour: []
        }
      ]
    }
  },
  busan: {
    location: {
      name: "부산",
      region: "Busan",
      country: "South Korea",
      lat: 35.10,
      lon: 129.04,
      tz_id: "Asia/Seoul",
      localtime: "2026-07-18 18:30"
    },
    current: {
      temp_c: 24.8,
      is_day: 1,
      condition: {
        text: "흐림",
        icon: "//cdn.weatherapi.com/weather/64x64/day/122.png",
        code: 1009
      },
      wind_kph: 22.0,
      wind_dir: "ENE",
      pressure_mb: 1013,
      precip_mm: 0.1,
      humidity: 80,
      cloud: 90,
      feelslike_c: 26.2,
      uv: 3.0,
      air_quality: {
        pm2_5: 14.5,
        pm10: 25.0,
        o3: 0.038,
        no2: 0.012,
        "us-epa-index": 1
      }
    },
    forecast: {
      forecastday: [
        {
          date: "2026-07-18",
          day: {
            maxtemp_c: 26.0,
            mintemp_c: 22.0,
            avgtemp_c: 23.8,
            maxwind_kph: 25.0,
            totalprecip_mm: 0.5,
            avghumidity: 82,
            daily_chance_of_rain: 40,
            condition: {
              text: "흐림",
              icon: "//cdn.weatherapi.com/weather/64x64/day/122.png",
              code: 1009
            },
            uv: 4.0
          },
          astro: {
            sunrise: "05:18 AM",
            sunset: "07:40 PM"
          },
          hour: [
            { time: "2026-07-18 00:00", temp_c: 22.5, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/night/122.png" }, wind_kph: 18.0, feelslike_c: 23.5, chance_of_rain: 20, humidity: 85 },
            { time: "2026-07-18 03:00", temp_c: 22.0, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/night/122.png" }, wind_kph: 19.0, feelslike_c: 23.0, chance_of_rain: 30, humidity: 86 },
            { time: "2026-07-18 06:00", temp_c: 22.2, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/day/122.png" }, wind_kph: 20.0, feelslike_c: 23.2, chance_of_rain: 30, humidity: 85 },
            { time: "2026-07-18 09:00", temp_c: 23.5, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/day/122.png" }, wind_kph: 21.0, feelslike_c: 24.8, chance_of_rain: 40, humidity: 82 },
            { time: "2026-07-18 12:00", temp_c: 25.0, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/day/122.png" }, wind_kph: 22.0, feelslike_c: 26.5, chance_of_rain: 40, humidity: 80 },
            { time: "2026-07-18 15:00", temp_c: 25.5, condition: { text: "흐린 후 갬", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, wind_kph: 22.0, feelslike_c: 27.0, chance_of_rain: 30, humidity: 79 },
            { time: "2026-07-18 18:00", temp_c: 24.8, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/day/122.png" }, wind_kph: 22.0, feelslike_c: 26.2, chance_of_rain: 30, humidity: 80 },
            { time: "2026-07-18 21:00", temp_c: 23.5, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/night/122.png" }, wind_kph: 20.0, feelslike_c: 24.5, chance_of_rain: 25, humidity: 83 }
          ]
        },
        {
          date: "2026-07-19",
          day: {
            maxtemp_c: 27.0,
            mintemp_c: 23.0,
            avgtemp_c: 25.0,
            maxwind_kph: 24.0,
            totalprecip_mm: 4.8,
            avghumidity: 80,
            daily_chance_of_rain: 70,
            condition: {
              text: "비",
              icon: "//cdn.weatherapi.com/weather/64x64/day/302.png",
              code: 1189
            },
            uv: 4.0
          },
          astro: {
            sunrise: "05:19 AM",
            sunset: "07:39 PM"
          },
          hour: []
        },
        {
          date: "2026-07-20",
          day: {
            maxtemp_c: 26.5,
            mintemp_c: 22.5,
            avgtemp_c: 24.5,
            maxwind_kph: 26.0,
            totalprecip_mm: 18.5,
            avghumidity: 88,
            daily_chance_of_rain: 90,
            condition: {
              text: "폭우",
              icon: "//cdn.weatherapi.com/weather/64x64/day/308.png",
              code: 1195
            },
            uv: 2.0
          },
          astro: {
            sunrise: "05:20 AM",
            sunset: "07:38 PM"
          },
          hour: []
        }
      ]
    }
  }
};

// Autocomplete recommendations
const MOCK_SUGGESTIONS = [
  { id: 1, name: "Seoul", region: "Seoul", country: "South Korea", lat: 37.57, lon: 126.98, koName: "서울", koRegion: "서울" },
  { id: 2, name: "Jeju", region: "Jeju", country: "South Korea", lat: 33.51, lon: 126.53, koName: "제주", koRegion: "제주" },
  { id: 3, name: "Busan", region: "Busan", country: "South Korea", lat: 35.10, lon: 129.04, koName: "부산", koRegion: "부산" },
  { id: 4, name: "Tokyo", region: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69, koName: "도쿄", koRegion: "도쿄" },
  { id: 5, name: "New York", region: "New York", country: "United States", lat: 40.71, lon: -74.01, koName: "뉴욕", koRegion: "뉴욕" },
  { id: 6, name: "London", region: "London", country: "United Kingdom", lat: 51.52, lon: -0.11, koName: "런던", koRegion: "런던" },
  { id: 7, name: "Paris", region: "Île-de-France", country: "France", lat: 48.86, lon: 2.35, koName: "파리", koRegion: "파리" },
  { id: 8, name: "Incheon", region: "Incheon", country: "South Korea", lat: 37.45, lon: 126.70, koName: "인천", koRegion: "인천" },
  { id: 9, name: "Daegu", region: "Daegu", country: "South Korea", lat: 35.87, lon: 128.60, koName: "대구", koRegion: "대구" },
  { id: 10, name: "Daejeon", region: "Daejeon", country: "South Korea", lat: 36.35, lon: 127.38, koName: "대전", koRegion: "대전" },
  { id: 11, name: "Gwangju", region: "Gwangju", country: "South Korea", lat: 35.15, lon: 126.85, koName: "광주", koRegion: "광주" },
  { id: 12, name: "Ulsan", region: "Ulsan", country: "South Korea", lat: 35.53, lon: 129.31, koName: "울산", koRegion: "울산" },
  { id: 13, name: "Suwon", region: "Gyeonggi-do", country: "South Korea", lat: 37.26, lon: 127.00, koName: "수원", koRegion: "경기도" },
  { id: 14, name: "Sejong", region: "Sejong", country: "South Korea", lat: 36.48, lon: 127.28, koName: "세종", koRegion: "세종" },
  { id: 15, name: "Gangneung", region: "Gangwon-do", country: "South Korea", lat: 37.75, lon: 128.89, koName: "강릉", koRegion: "강원도" },
  { id: 16, name: "Jeonju", region: "Jeollabuk-do", country: "South Korea", lat: 35.82, lon: 127.14, koName: "전주", koRegion: "전라북도" },
  { id: 17, name: "Cheongju", region: "Chungcheongbuk-do", country: "South Korea", lat: 36.63, lon: 127.48, koName: "청주", koRegion: "충청북도" },
  { id: 18, name: "Yeosu", region: "Jeollanam-do", country: "South Korea", lat: 34.76, lon: 127.66, koName: "여수", koRegion: "전라남도" },
  { id: 19, name: "Chuncheon", region: "Gangwon-do", country: "South Korea", lat: 37.88, lon: 127.73, koName: "춘천", koRegion: "강원도" }
];

const KOREAN_CITIES_MOCK_CONFIG: Record<string, { name: string; region: string; temp_offset: number; condition: string; code: number; icon: string }> = {
  incheon: { name: "인천", region: "Incheon", temp_offset: -0.8, condition: "맑음", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
  daegu: { name: "대구", region: "Daegu", temp_offset: 2.2, condition: "맑음", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
  daejeon: { name: "대전", region: "Daejeon", temp_offset: 0.6, condition: "맑음", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
  gwangju: { name: "광주", region: "Gwangju", temp_offset: 1.2, condition: "구름 조금", code: 1003, icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" },
  ulsan: { name: "울산", region: "Ulsan", temp_offset: -0.4, condition: "구름 조금", code: 1003, icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" },
  suwon: { name: "수원", region: "Gyeonggi", temp_offset: -0.3, condition: "맑음", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
  sejong: { name: "세종", region: "Sejong", temp_offset: 0.4, condition: "맑음", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
  gangneung: { name: "강릉", region: "Gangwon", temp_offset: -1.5, condition: "흐림", code: 1009, icon: "//cdn.weatherapi.com/weather/64x64/day/122.png" },
  jeonju: { name: "전주", region: "Jeonbuk", temp_offset: 0.9, condition: "맑음", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
  cheongju: { name: "청주", region: "Chungbuk", temp_offset: 0.5, condition: "맑음", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
  yeosu: { name: "여수", region: "Jeonnam", temp_offset: 0.1, condition: "구름 조금", code: 1003, icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" },
  chuncheon: { name: "춘천", region: "Gangwon", temp_offset: -1.8, condition: "흐림", code: 1009, icon: "//cdn.weatherapi.com/weather/64x64/day/122.png" }
};

// Weather API Proxy Route
app.get("/api/weather/forecast", async (req, res) => {
  const query = (req.query.q as string || "Seoul").trim().toLowerCase();
  
  // Normalize query name
  let key = "seoul";
  if (query.includes("jeju") || query.includes("제주")) key = "jeju";
  else if (query.includes("busan") || query.includes("부산")) key = "busan";
  else {
    // Check other Korean cities configuration
    const foundCityKey = Object.keys(KOREAN_CITIES_MOCK_CONFIG).find(
      k => query.includes(k) || query.includes(KOREAN_CITIES_MOCK_CONFIG[k].name)
    );
    if (foundCityKey) {
      key = foundCityKey;
      if (!MOCK_WEATHER[key]) {
        const config = KOREAN_CITIES_MOCK_CONFIG[key];
        // Clone from seoul as template
        const template = JSON.parse(JSON.stringify(MOCK_WEATHER["seoul"]));
        template.location.name = config.name;
        template.location.region = config.region;
        
        // Modify current weather
        template.current.temp_c = Number((template.current.temp_c + config.temp_offset).toFixed(1));
        template.current.feelslike_c = Number((template.current.feelslike_c + config.temp_offset).toFixed(1));
        template.current.condition.text = config.condition;
        template.current.condition.code = config.code;
        template.current.condition.icon = config.icon;
        
        // Modify forecasts
        template.forecast.forecastday.forEach((fDay: any) => {
          fDay.day.maxtemp_c = Number((fDay.day.maxtemp_c + config.temp_offset).toFixed(1));
          fDay.day.mintemp_c = Number((fDay.day.mintemp_c + config.temp_offset).toFixed(1));
          fDay.day.avgtemp_c = Number((fDay.day.avgtemp_c + config.temp_offset).toFixed(1));
          fDay.day.condition.text = config.condition;
          fDay.day.condition.code = config.code;
          fDay.day.condition.icon = config.icon;
          
          fDay.hour.forEach((hr: any) => {
            hr.temp_c = Number((hr.temp_c + config.temp_offset).toFixed(1));
            hr.feelslike_c = Number((hr.feelslike_c + config.temp_offset).toFixed(1));
            hr.condition.text = config.condition;
            hr.condition.icon = config.icon;
          });
        });
        
        MOCK_WEATHER[key] = template;
      }
    } else if (query.includes("tokyo") || query.includes("도쿄")) {
    // Add Tokyo mock dynamically if not present
    if (!MOCK_WEATHER["tokyo"]) {
      MOCK_WEATHER["tokyo"] = {
        location: { name: "도쿄", region: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69, tz_id: "Asia/Tokyo", localtime: "2026-07-18 18:30" },
        current: { temp_c: 28.5, is_day: 1, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png", code: 1000 }, wind_kph: 8.5, wind_dir: "S", pressure_mb: 1014, precip_mm: 0, humidity: 55, cloud: 0, feelslike_c: 29.5, uv: 8.0, air_quality: { pm2_5: 12.0, pm10: 20.1, o3: 0.055, no2: 0.020, "us-epa-index": 1 } },
        forecast: {
          forecastday: [
            {
              date: "2026-07-18",
              day: { maxtemp_c: 31.0, mintemp_c: 23.0, avgtemp_c: 27.0, maxwind_kph: 10.0, totalprecip_mm: 0.0, avghumidity: 58, daily_chance_of_rain: 5, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png", code: 1000 }, uv: 8.0 },
              astro: { sunrise: "04:40 AM", sunset: "06:58 PM" },
              hour: []
            }
          ]
        }
      };
    }
    key = "tokyo";
  } else if (query.includes("new york") || query.includes("뉴욕")) {
    if (!MOCK_WEATHER["new york"]) {
      MOCK_WEATHER["new york"] = {
        location: { name: "뉴욕", region: "New York", country: "United States", lat: 40.71, lon: -74.01, tz_id: "America/New_York", localtime: "2026-07-18 05:30" },
        current: { temp_c: 22.0, is_day: 0, condition: { text: "구름 많음", icon: "//cdn.weatherapi.com/weather/64x64/night/119.png", code: 1006 }, wind_kph: 15.0, wind_dir: "W", pressure_mb: 1009, precip_mm: 0, humidity: 78, cloud: 75, feelslike_c: 22.0, uv: 1.0, air_quality: { pm2_5: 9.5, pm10: 15.2, o3: 0.025, no2: 0.010, "us-epa-index": 1 } },
        forecast: {
          forecastday: [
            {
              date: "2026-07-18",
              day: { maxtemp_c: 27.0, mintemp_c: 19.0, avgtemp_c: 23.0, maxwind_kph: 18.0, totalprecip_mm: 1.2, avghumidity: 72, daily_chance_of_rain: 45, condition: { text: "한때 소나기", icon: "//cdn.weatherapi.com/weather/64x64/day/176.png", code: 1063 }, uv: 6.0 },
              astro: { sunrise: "05:35 AM", sunset: "08:25 PM" },
              hour: []
            }
          ]
        }
      };
    }
    key = "new york";
  } else if (query.includes("london") || query.includes("런던")) {
    if (!MOCK_WEATHER["london"]) {
      MOCK_WEATHER["london"] = {
        location: { name: "런던", region: "London", country: "United Kingdom", lat: 51.52, lon: -0.11, tz_id: "Europe/London", localtime: "2026-07-18 10:30" },
        current: { temp_c: 18.0, is_day: 1, condition: { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/day/122.png", code: 1009 }, wind_kph: 24.0, wind_dir: "WSW", pressure_mb: 1011, precip_mm: 0.2, humidity: 82, cloud: 100, feelslike_c: 17.5, uv: 3.0, air_quality: { pm2_5: 6.2, pm10: 11.0, o3: 0.030, no2: 0.014, "us-epa-index": 1 } },
        forecast: {
          forecastday: [
            {
              date: "2026-07-18",
              day: { maxtemp_c: 19.5, mintemp_c: 14.0, avgtemp_c: 16.8, maxwind_kph: 28.0, totalprecip_mm: 2.5, avghumidity: 80, daily_chance_of_rain: 65, condition: { text: "가벼운 비", icon: "//cdn.weatherapi.com/weather/64x64/day/266.png", code: 1024 }, uv: 4.0 },
              astro: { sunrise: "04:55 AM", sunset: "09:12 PM" },
              hour: []
            }
          ]
        }
      };
    }
    key = "london";
  } else if (query.includes("paris") || query.includes("파리")) {
    if (!MOCK_WEATHER["paris"]) {
      MOCK_WEATHER["paris"] = {
        location: { name: "파리", region: "Île-de-France", country: "France", lat: 48.86, lon: 2.35, tz_id: "Europe/Paris", localtime: "2026-07-18 11:30" },
        current: { temp_c: 22.5, is_day: 1, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png", code: 1000 }, wind_kph: 12.0, wind_dir: "W", pressure_mb: 1016, precip_mm: 0, humidity: 50, cloud: 10, feelslike_c: 22.5, uv: 6.0, air_quality: { pm2_5: 8.8, pm10: 16.5, o3: 0.048, no2: 0.011, "us-epa-index": 1 } },
        forecast: {
          forecastday: [
            {
              date: "2026-07-18",
              day: { maxtemp_c: 25.0, mintemp_c: 15.0, avgtemp_c: 20.0, maxwind_kph: 15.0, totalprecip_mm: 0.0, avghumidity: 55, daily_chance_of_rain: 10, condition: { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png", code: 1000 }, uv: 7.0 },
              astro: { sunrise: "05:52 AM", sunset: "09:48 PM" },
              hour: []
            }
          ]
        }
      };
    }
    key = "paris";
  } else {
    // Dynamically generate weather data for any unrecognized query so it always responds perfectly
    key = query;
    if (!MOCK_WEATHER[key]) {
      const template = JSON.parse(JSON.stringify(MOCK_WEATHER["seoul"]));
      const displayName = query.charAt(0).toUpperCase() + query.slice(1);
      template.location.name = displayName;
      template.location.region = displayName;
      template.location.country = "대한민국";
      
      // Calculate a deterministic offset using simple hash
      const hash = query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const tempOffset = Number(((hash % 31) / 10 - 1.5).toFixed(1)); // -1.5 to +1.5 degrees offset
      
      template.current.temp_c = Number((template.current.temp_c + tempOffset).toFixed(1));
      template.current.feelslike_c = Number((template.current.feelslike_c + tempOffset).toFixed(1));
      
      template.forecast.forecastday.forEach((fDay: any) => {
        fDay.day.maxtemp_c = Number((fDay.day.maxtemp_c + tempOffset).toFixed(1));
        fDay.day.mintemp_c = Number((fDay.day.mintemp_c + tempOffset).toFixed(1));
        fDay.day.avgtemp_c = Number((fDay.day.avgtemp_c + tempOffset).toFixed(1));
        fDay.hour.forEach((hr: any) => {
          hr.temp_c = Number((hr.temp_c + tempOffset).toFixed(1));
          hr.feelslike_c = Number((hr.feelslike_c + tempOffset).toFixed(1));
        });
      });
      
      MOCK_WEATHER[key] = template;
    }
  }
}

  if (!WEATHER_API_KEY) {
    // If key is missing, return fallback mock with mock flag
    const data = MOCK_WEATHER[key] || MOCK_WEATHER["seoul"];
    return res.json({ ...data, isMock: true });
  }

  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(WEATHER_API_KEY)}&q=${encodeURIComponent(req.query.q as string || "Seoul")}&days=3&aqi=yes&alerts=yes&lang=ko`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WeatherAPI responded with status: ${response.status}`);
    }
    const data = await response.json();
    return res.json({ ...data, isMock: false });
  } catch (error: any) {
    console.error("WeatherAPI Request Error, using Mock fallback:", error.message);
    const data = MOCK_WEATHER[key] || MOCK_WEATHER["seoul"];
    return res.json({ ...data, isMock: true, isErrorFallback: true });
  }
});

// Weather API Autocomplete Search Route
app.get("/api/weather/search", async (req, res) => {
  const query = (req.query.q as string || "").trim().toLowerCase();
  
  if (!query) {
    return res.json([]);
  }

  if (!WEATHER_API_KEY) {
    // Filter mock suggestions based on name/region/country in both EN and KO
    const filtered = MOCK_SUGGESTIONS.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.region.toLowerCase().includes(query) || 
      item.country.toLowerCase().includes(query) ||
      (item.koName && item.koName.toLowerCase().includes(query)) ||
      (item.koRegion && item.koRegion.toLowerCase().includes(query))
    );
    return res.json(filtered);
  }

  try {
    const url = `http://api.weatherapi.com/v1/search.json?key=${encodeURIComponent(WEATHER_API_KEY)}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WeatherAPI Search responded with status: ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("WeatherAPI Search Error, using Mock Suggestions:", error.message);
    const filtered = MOCK_SUGGESTIONS.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.region.toLowerCase().includes(query) || 
      item.country.toLowerCase().includes(query) ||
      (item.koName && item.koName.toLowerCase().includes(query)) ||
      (item.koRegion && item.koRegion.toLowerCase().includes(query))
    );
    return res.json(filtered);
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
