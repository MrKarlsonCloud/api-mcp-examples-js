# 🚀 MCP Masterclass: Conecta tu IA con el Mundo Real

> **Descubre cómo el Model Context Protocol está revolucionando la forma en que los modelos de IA interactúan con datos y herramientas externas**

¿Te has preguntado cómo hacer que tu modelo de IA acceda a información en tiempo real, ejecute funciones complejas o se conecte con APIs externas de forma segura? ¡Este webinar es para ti!

En esta sesión práctica, aprenderás a implementar el **Model Context Protocol (MCP)**, el estándar abierto desarrollado por Anthropic que está transformando el ecosistema de IA. Desde los conceptos fundamentales hasta la implementación de un servidor funcional, te llevaremos paso a paso por todo lo que necesitas saber.

## 📊 Información del Webinar

**Duración:** ~1 hora  
**Nivel:** Intermedio  
**Tecnologías:** TypeScript, Node.js, APIs REST
**Requisitos:** Conocimientos básicos de JavaScript/TypeScript

### 🎯 ¿Qué aprenderás?
- Arquitectura y componentes del MCP
- Implementación práctica de un servidor MCP
- Integración con APIs externas (clima, monedas, países)
- Mejores prácticas de seguridad y debugging
- Casos de uso reales y aplicaciones comerciales

## 📋 Índice del Curso

### Parte Teórica (30 minutos)
1. [¿Qué es MCP?](#qué-es-mcp)
2. [Arquitectura y Componentes](#arquitectura-y-componentes)
3. [Comparación con otras tecnologías](#comparación-con-otras-tecnologías)
4. [Casos de uso principales](#casos-de-uso-principales)
5. [Ventajas y limitaciones](#ventajas-y-limitaciones)

### Parte Práctica (30 minutos)
6. [Configuración del entorno](#configuración-del-entorno)
7. [Implementación del servidor MCP](#implementación-del-servidor-mcp)
8. [Ejemplo práctico: API del tiempo](#ejemplo-práctico-api-del-tiempo)
9. [Testing y debugging](#testing-y-debugging)
10. [Próximos pasos](#próximos-pasos)

---

## Parte Teórica

### ¿Qué es MCP?

El **Model Context Protocol (MCP)** es un protocolo estándar abierto que permite a los modelos de IA acceder de forma segura a datos y herramientas externas. Desarrollado por Anthropic, MCP actúa como un puente entre los modelos de lenguaje y las aplicaciones del mundo real.

#### Analogía simple:
Imagina que un modelo de IA es como un chef muy talentoso, pero que está encerrado en una cocina sin ingredientes. MCP sería como un sistema de delivery que le permite al chef solicitar ingredientes específicos (datos) y herramientas de cocina (funciones) del mundo exterior, de manera segura y controlada.

#### Conceptos clave:
- **Servidor MCP**: Proporciona recursos y herramientas
- **Cliente MCP**: Consume los recursos (típicamente un modelo de IA)
- **Recursos**: Datos que el servidor puede proporcionar
- **Herramientas**: Funciones que el servidor puede ejecutar
- **Prompts**: Plantillas reutilizables para interacciones

### Arquitectura y Componentes

```
┌─────────────────┐    MCP Protocol    ┌─────────────────┐
│   Cliente MCP   │◄──────────────────►│  Servidor MCP   │
│  (Modelo de IA) │                    │ (Tu aplicación) │
└─────────────────┘                    └─────────────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │  APIs Externas  │
                                       │ (Weather, DB,   │
                                       │  File System)   │
                                       └─────────────────┘
```

#### Componentes principales:

1. **Transport Layer**: Maneja la comunicación (stdio, HTTP, WebSocket)
2. **Protocol Layer**: Define el formato de mensajes JSON-RPC 2.0
3. **Application Layer**: Implementa la lógica específica (recursos, herramientas)

### Comparación con otras tecnologías

| Aspecto | MCP | Function Calling | Plugins tradicionales |
|---------|-----|------------------|----------------------|
| **Estandarización** | ✅ Protocolo estándar | ❌ Específico por modelo | ❌ Específico por plataforma |
| **Seguridad** | ✅ Sandboxing nativo | ⚠️ Depende del modelo | ❌ Acceso directo |
| **Reutilización** | ✅ Cross-platform | ❌ Limitado | ❌ Específico |
| **Complejidad** | ⚠️ Media | ✅ Baja | ❌ Alta |
| **Flexibilidad** | ✅ Muy alta | ⚠️ Media | ✅ Alta |

#### Ejemplo comparativo:

**Function Calling (OpenAI):**
```javascript
// Definido en el prompt
const functions = [{
  name: "get_weather",
  description: "Get weather for a city",
  parameters: { /* schema */ }
}];
```

**MCP:**
```javascript
// Servidor independiente y reutilizable
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "get_weather",
    description: "Get weather for a city",
    inputSchema: { /* schema */ }
  }]
}));
```

### Casos de uso principales

1. **Integración de datos empresariales**
   - Acceso a bases de datos
   - APIs internas
   - Sistemas de archivos

2. **Automatización de tareas**
   - Envío de emails
   - Gestión de calendarios
   - Control de IoT

3. **Análisis en tiempo real**
   - Datos financieros
   - Métricas de aplicaciones
   - Información meteorológica

4. **Desarrollo de aplicaciones**
   - IDEs inteligentes
   - Asistentes de código
   - Herramientas de debugging

### Ventajas y limitaciones

#### ✅ Ventajas:
- **Estandarización**: Un protocolo para todos los modelos
- **Seguridad**: Sandboxing y control de acceso
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Mantenibilidad**: Separación clara de responsabilidades
- **Reutilización**: Un servidor para múltiples clientes

#### ⚠️ Limitaciones:
- **Curva de aprendizaje**: Requiere entender el protocolo
- **Overhead**: Comunicación adicional vs. function calling directo
- **Adopción**: Aún en desarrollo, ecosistema limitado
- **Debugging**: Más complejo que llamadas directas

---

## Parte Práctica

### Configuración del entorno

#### Prerrequisitos:
- Node.js 20+ (recomiendo 22 que admite por defecto el typescript)
- TypeScript
- IDE Trae (recomendado)

#### Instalación de dependencias:

```bash
# Crear proyecto
npm init -y

# Instalar MCP SDK y zod para validación
npm install @modelcontextprotocol/sdk zod

# Instalar dependencias de desarrollo
npm install -D typescript @types/node tsx
```

#### Configuración TypeScript (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### Package.json completo:

```json
{
  "name": "mcp-weather-server",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "weather": "./build/index.js"
  },
  "scripts": {
    "build": "tsc && chmod 755 build/index.js",
    "start": "tsx src/index.ts",
    "dev": "tsx watch src/index.ts"
  },
  "files": ["build"],
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
  }
}
```

### Implementación del servidor MCP

#### Estructura del proyecto:
```
mcp-weather-course/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```



### Ejemplo práctico: API del tiempo

#### Servidor MCP principal (`src/index.ts`):

```typescript
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

// Función principal para iniciar el servidor
async function main() {
  const transport = new StdioServerTransport();
  
  console.log("🚀 Iniciando servidor MCP del tiempo...");
  console.log("📡 Herramientas disponibles:");
  console.log("   • get-weather: Obtiene datos meteorológicos");
  console.log("   • get-coordinates: Obtiene coordenadas geográficas");
  console.log("\n✅ Servidor listo para recibir conexiones\n");
  
  await server.connect(transport);
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
```

### Testing y debugging

#### Script de prueba (`test-server.js`):

```javascript
// Script simple para probar el servidor MCP
const { spawn } = require('child_process');

function testMCPServer() {
  console.log('🧪 Iniciando pruebas del servidor MCP...');
  
  const server = spawn('npm', ['run', 'start'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Mensaje de prueba para listar herramientas
  const listToolsMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list'
  };

  // Mensaje de prueba para obtener el tiempo
  const getWeatherMessage = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_weather',
      arguments: { city: 'Madrid' }
    }
  };

  server.stdout.on('data', (data) => {
    console.log('📤 Respuesta del servidor:', data.toString());
  });

  server.stderr.on('data', (data) => {
    console.log('⚠️ Error del servidor:', data.toString());
  });

  // Enviar mensajes de prueba
  setTimeout(() => {
    console.log('📨 Enviando: tools/list');
    server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
  }, 1000);

  setTimeout(() => {
    console.log('📨 Enviando: get_weather para Madrid');
    server.stdin.write(JSON.stringify(getWeatherMessage) + '\n');
  }, 2000);

  setTimeout(() => {
    server.kill();
    console.log('✅ Pruebas completadas');
  }, 5000);
}

testMCPServer();
```

#### Comandos de debugging:

```bash
# Ejecutar en modo desarrollo con recarga automática
npm run dev

# Ejecutar con logs detallados
DEBUG=mcp* npm run start

# Probar herramientas específicas
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npm run start

# Verificar sintaxis TypeScript
npm run build
```

### Próximos pasos

#### Nota importante sobre las respuestas:

**Interpretación inteligente de datos**: Las respuestas de las APIs se devuelven en formato JSON crudo para que la IA cliente pueda interpretar y presentar la información de manera inteligente y contextual al usuario final. Esto permite que la IA adapte la presentación según el contexto de la consulta y las preferencias del usuario.

#### Extensiones sugeridas:

1. **Más herramientas meteorológicas:**
   ```typescript
   // Previsión de 7 días
   'get_forecast'
   // Alertas meteorológicas
   'get_weather_alerts'
   // Comparar tiempo entre ciudades
   'compare_weather'
   ```

2. **Mejoras de funcionalidad:**
   - Cache de respuestas
   - Soporte para múltiples idiomas
   - Integración con más APIs meteorológicas
   - Notificaciones push

3. **Integración con Trae IDE:**
   ```typescript
   // Configuración para Trae
   {
     "mcpServers": {
       "weather": {
         "command": "node tsx",
         "args": ["src/index.tsx"]
       }
     }
   }
   ```

4. **Deployment:**
   - Docker containerization
   - Serverless deployment
   - CI/CD pipeline

#### Recursos adicionales:

- [Documentación oficial MCP](https://modelcontextprotocol.io/)
- [SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [Ejemplos de la comunidad](https://github.com/modelcontextprotocol/servers)
- [Open-Meteo API](https://open-meteo.com/)

---

## 🎯 Objetivos de aprendizaje alcanzados

Al completar este curso, habrás aprendido:

✅ **Conceptos fundamentales** de MCP y su arquitectura  
✅ **Implementación práctica** de un servidor MCP en TypeScript  
✅ **Integración con APIs externas** de forma segura  
✅ **Manejo de errores** y debugging en aplicaciones MCP  
✅ **Mejores prácticas** para desarrollo con MCP  
✅ **Preparación** para proyectos más complejos  

## 📝 Notas para el instructor

- **Timing sugerido:** 30min teoría + 30min práctica
- **Puntos de interacción:** Preguntas después de cada sección teórica
- **Demos en vivo:** Ejecutar el código paso a paso
- **Troubleshooting común:** Problemas de red, APIs, TypeScript
- **Q&A:** Reservar 10 minutos al final

---

*¿Preguntas? ¡Vamos a construir algo increíble con MCP! 🚀*