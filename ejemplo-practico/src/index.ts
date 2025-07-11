import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// APIs gratuitas sin necesidad de API keys
const NOMINATIM_API_BASE = "https://nominatim.openstreetmap.org";
const OPEN_METEO_API_BASE = "https://api.open-meteo.com/v1";
const USER_AGENT = "mcp-weather-server/1.0";

// Crear instancia del servidor
const server = new McpServer({
  name: "weather",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Interfaces para las respuestas de las APIs
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    country?: string;
    city?: string;
    town?: string;
    village?: string;
  };
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
}

// Función helper para hacer peticiones HTTP
async function makeRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json",
  };



  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}

// Función para obtener coordenadas usando Nominatim (OpenStreetMap)
async function getCityCoordinates(cityName: string): Promise<{ lat: number; lon: number; displayName: string }> {
  const encodedCity = encodeURIComponent(cityName);
  const url = `${NOMINATIM_API_BASE}/search?q=${encodedCity}&format=json&limit=1&addressdetails=1`;
  
  const data = await makeRequest<NominatimResult[]>(url);
  
  if (!data || data.length === 0) {
    throw new Error(`Ciudad '${cityName}' no encontrada`);
  }

  const result = data[0];
  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    displayName: result.display_name
  };
}

// Función para obtener datos meteorológicos usando Open-Meteo
async function getWeatherData(lat: number, lon: number): Promise<any> {
  const url = `${OPEN_METEO_API_BASE}/forecast`;
  const params = {
    "latitude": lat,
    "longitude": lon,
    "daily": ["temperature_2m_max", "temperature_2m_min", "rain_sum", "precipitation_sum"],
	"hourly": ["temperature_2m", "wind_speed_10m", "relative_humidity_2m", "precipitation", "precipitation_probability", "rain"],
	"current": ["relative_humidity_2m", "temperature_2m", "precipitation", "rain", "wind_speed_10m"],
	"timezone": "auto"
  };
  const appendUrl = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    appendUrl.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }  
  
  const data = await makeRequest<any>(`${url}?${appendUrl.toString()}`);
  
  if (!data) {
    throw new Error("Error obteniendo datos meteorológicos");
  }

  // Mapeo de códigos de tiempo WMO a descripciones en español
  const weatherDescriptions: Record<number, string> = {
    0: "Despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    71: "Nieve ligera",
    73: "Nieve moderada",
    75: "Nieve intensa",
    95: "Tormenta"
  };

  /*
  const current = data.current;
  
   return {
    temperature: Math.round(current.temperature_2m),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    description: weatherDescriptions[current.weather_code] || "Desconocido",
    temperatureUnit: data.current_units.temperature_2m,
    windUnit: data.current_units.wind_speed_10m
  }; */
  return data
}

// Registrar herramientas del servidor
server.tool(
  "get-weather",
  "Obtiene la previsión meteorológica actual para una ciudad específica",
  {
    city: z.string().min(1).describe("Nombre de la ciudad (ej: Madrid, Barcelona, London)"),
  },
  async ({ city }) => {
    try {
      console.log(`🔍 Buscando coordenadas para: ${city}`);
      const coordinates = await getCityCoordinates(city);
      
      console.log(`🌤️ Obteniendo datos meteorológicos para: ${city}`);
      const weather = await getWeatherData(coordinates.lat, coordinates.lon);
      
      /* const response = [
        `🌤️ **Tiempo en ${city}**`,
        `📍 **Ubicación:** ${coordinates.displayName}`,
        `🌡️ **Temperatura:** ${weather.temperature}${weather.temperatureUnit}`,
        `☁️ **Condiciones:** ${weather.description}`,
        `💧 **Humedad:** ${weather.humidity}%`,
        `💨 **Viento:** ${weather.windSpeed} ${weather.windUnit}`,
        `📍 **Coordenadas:** ${coordinates.lat}°, ${coordinates.lon}°`,
        "",
        "*Datos proporcionados por Open-Meteo API y OpenStreetMap*"
      ].join("\n"); */

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(weather),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error obteniendo datos meteorológicos para ${city}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-coordinates",
  "Obtiene las coordenadas geográficas (latitud y longitud) de una ciudad",
  {
    city: z.string().min(1).describe("Nombre de la ciudad para obtener coordenadas"),
  },
  async ({ city }) => {
    try {
      console.log(`🔍 Buscando coordenadas para: ${city}`);
      const coordinates = await getCityCoordinates(city);
      
      const response = [
        `📍 **Coordenadas de ${city}**`,
        `• **Latitud:** ${coordinates.lat}°`,
        `• **Longitud:** ${coordinates.lon}°`,
        `• **Ubicación completa:** ${coordinates.displayName}`,
        `• **Google Maps:** https://maps.google.com/?q=${coordinates.lat},${coordinates.lon}`,
        "",
        "*Datos proporcionados por OpenStreetMap/Nominatim*"
      ].join("\n");

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error obteniendo coordenadas para ${city}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-country-info",
  "Obtiene información detallada de un país (población, capital, moneda, idiomas, etc.)",
  {
    country: z.string().min(1).describe("Nombre del país o código ISO (ej: Spain, ES, España)"),
  },
  async ({ country }) => {
    try {
      console.log(`🌍 Buscando información para: ${country}`);
      const encodedCountry = encodeURIComponent(country);
      const url = `https://restcountries.com/v3.1/name/${encodedCountry}`;
      
      const data = await makeRequest<any[]>(url);
      
      if (!data || data.length === 0) {
        throw new Error(`País '${country}' no encontrado`);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data[0]),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error obteniendo información del país ${country}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "get-currency-exchange",
  "Obtiene tipos de cambio entre monedas",
  {
    from: z.string().min(3).max(3).describe("Moneda origen (código de 3 letras, ej: EUR, USD, GBP)"),
    to: z.string().min(3).max(3).describe("Moneda destino (código de 3 letras, ej: EUR, USD, GBP)"),
    amount: z.number().optional().describe("Cantidad a convertir (opcional, por defecto 1)")
  },
  async ({ from, to, amount = 1 }) => {
    try {
      console.log(`💱 Obteniendo tipo de cambio: ${from} -> ${to}`);
      const url = `https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`;
      
      const data = await makeRequest<any>(url);
      
      if (!data) {
        throw new Error("Error obteniendo datos de tipo de cambio");
      }

      const exchangeData = {
        ...data,
        conversion: {
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          amount: amount,
          result: data.rates[to.toUpperCase()] ? (amount * data.rates[to.toUpperCase()]) : null
        }
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(exchangeData),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error obteniendo tipo de cambio ${from} -> ${to}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "generate-qr",
  "Genera un código QR para texto o URL",
  {
    text: z.string().min(1).describe("Texto o URL para generar el código QR"),
    size: z.number().min(50).max(500).optional().describe("Tamaño del QR en píxeles (50-500, por defecto 200)")
  },
  async ({ text, size = 200 }) => {
    try {
      console.log(`📱 Generando código QR para: ${text.substring(0, 50)}...`);
      const encodedText = encodeURIComponent(text);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
      
      const qrData = {
        text: text,
        size: size,
        qr_url: qrUrl,
        format: "SVG",
        generated_at: new Date().toISOString()
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(qrData),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error generando código QR: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

// Función principal para iniciar el servidor
async function main() {
  //console.log("🌤️  Iniciando servidor MCP Weather...");
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  /*
  console.log("✅ Servidor MCP Weather iniciado correctamente");
  console.log("📋 Herramientas disponibles:");
  console.log("   • get-weather: Obtiene información meteorológica");
  console.log("   • get-coordinates: Obtiene coordenadas geográficas");
  console.log("   • get-country-info: Obtiene información detallada de países");
  console.log("   • get-currency-exchange: Obtiene tipos de cambio entre monedas");
  console.log("   • generate-qr: Genera códigos QR para texto o URLs");
  console.log("🔗 Conectado y listo para recibir solicitudes...");
  */
}

// Manejo de errores y señales
process.on("SIGINT", async () => {
  console.log("\n🛑 Cerrando servidor MCP...");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Error no capturado:", error);
  process.exit(1);
});

// Iniciar servidor
main().catch((error) => {
  console.error("❌ Error iniciando servidor:", error);
  process.exit(1);
});