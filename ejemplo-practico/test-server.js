import { spawn } from 'child_process';
import { platform } from 'os';

function testMCPServer() {
  console.log('🧪 Iniciando pruebas del servidor MCP...');
  
  // En Windows, npm es npm.cmd, en otros sistemas es npm
  const npmCommand = platform() === 'win32' ? 'npm.cmd' : 'npm';
  
  const server = spawn(npmCommand, ['run', 'start'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true // Esto ayuda en Windows
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
      name: 'get-weather',
      arguments: { city: 'Castellón de la plana' }
    }
  };

  // Mensaje de prueba para obtener información de país
  const getCountryMessage = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get-country-info',
      arguments: { country: 'Spain' }
    }
  };

  // Mensaje de prueba para obtener tipo de cambio
  const getCurrencyMessage = {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'get-currency-exchange',
      arguments: { from: 'EUR', to: 'USD', amount: 100 }
    }
  };

  // Mensaje de prueba para generar código QR
  const generateQRMessage = {
    jsonrpc: '2.0',
    id: 5,
    method: 'tools/call',
    params: {
      name: 'generate-qr',
      arguments: { text: 'https://github.com', size: 200 }
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
    console.log('📨 Enviando: get-weather para Castellón de la plana');
    server.stdin.write(JSON.stringify(getWeatherMessage) + '\n');
  }, 2000);

  setTimeout(() => {
    console.log('📨 Enviando: get-country-info para Spain');
    server.stdin.write(JSON.stringify(getCountryMessage) + '\n');
  }, 3000);

  setTimeout(() => {
    console.log('📨 Enviando: get-currency-exchange EUR -> USD');
    server.stdin.write(JSON.stringify(getCurrencyMessage) + '\n');
  }, 4000);

  setTimeout(() => {
    console.log('📨 Enviando: generate-qr para GitHub URL');
    server.stdin.write(JSON.stringify(generateQRMessage) + '\n');
  }, 5000);

  setTimeout(() => {
    server.kill();
    console.log('✅ Pruebas completadas - Se han probado todas las 5 herramientas');
  }, 7000);
}

testMCPServer();