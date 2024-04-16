const os = require('os');
const { exec } = require('child_process');
const https = require('https');
const { promisify } = require('util');
const execAsync = promisify(exec);

// 운영 체제 정보 출력
function printOSInfo() {
  console.log('OS Platform:', os.platform());
  console.log('OS Release:', os.release());
}

// 시스템 사양 출력
function printSystemSpecs() {
  console.log('CPU Information:', os.cpus()[0].model);
  console.log('Total Memory:', os.totalmem() / 1024 / 1024 + ' MB');
  console.log('Free Memory:', os.freemem() / 1024 / 1024 + ' MB');
  console.log('Hostname:', os.hostname());
}

// CPU와 RAM 사용률을 계산하고 출력
function printResourceUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  console.log('Memory Usage: ' + (usedMemory / totalMemory * 100).toFixed(2) + '%');
}


// 네트워크 인터페이스 정보 출력
function printNetworkInfo() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    console.log(`Network Interface: ${name}`);
    interfaces[name].forEach(iface => {

      if (!iface.internal) {
        console.log(`  Address Type: ${iface.family}`);
        console.log(`  IP Address: ${iface.address}`);
        console.log(`  MAC Address: ${iface.mac}`);
        console.log(`  Netmask: ${iface.netmask}`);
      }
    });
  }
}

// Java 버전 확인 (비동기)
async function checkJavaVersion() {
  try {
    const { stdout, stderr } = await execAsync('java -version');
    console.log('Java Version:', stderr.split('\n')[0]);
  } catch (error) {
    console.error('Error checking Java version:', error);
  }
}

// C# 버전 확인 (.NET Core, 비동기)
async function checkDotnetVersion() {
  try {
    const { stdout } = await execAsync('dotnet --version');
    console.log('C# .NET Core Version:', stdout.trim());
  } catch (error) {
    console.error('Error checking .NET version:', error);
  }
}

// 인터넷 연결 상태 확인 (비동기)
function checkInternetConnection() {
  return new Promise((resolve, reject) => {
    https.get('https://www.google.com', (res) => {
      console.log('Internet connection status: Connected  ');
      console.log('Connect Time is ',new Date())
      resolve();
    }).on('error', (e) => {
      console.log('Internet connection status: Not Connected', e.message);
      reject(e);
    });
  });
}


// 모든 작업을 순서대로 실행하는 메인 함수
async function initializeMonitorSystem() {
  printNetworkInfo();
  printOSInfo();
  printSystemSpecs();
  printResourceUsage();
  await checkJavaVersion();
  await checkDotnetVersion();
  await checkInternetConnection();
}

initializeMonitorSystem()

// 5분마다 현재 시간과 인터넷 연결 상태 확인
setInterval(() => {
  checkInternetConnection();
}, 300000);
