import * as os from "os";

export function getNetworkIP(): string {
  const interfaces = os.networkInterfaces();
  let networkIP = "";
  for (const iface of Object.values(interfaces)) {
    for (const alias of iface!) {
      if (alias.family === "IPv4" && !alias.internal) {
        networkIP = alias.address;
        break;
      }
    }
    if (networkIP) break;
  }
  return networkIP;
}

export function logServerStartup(
  port: number,
  expressVersion: string,
  startTime: bigint,
) {
  const elapsed = Number(process.hrtime.bigint() - startTime) / 1e6;
  const networkIP = getNetworkIP();

  // ANSI color codes
  const reset = "\x1b[0m";
  const bright = "\x1b[1m";
  const cyan = "\x1b[36m";
  const green = "\x1b[32m";
  const bgGreen = "\x1b[42m";
  const white = "\x1b[37m";

  console.log(
    `${bgGreen}${white} ex ${reset} ${bright}${green}Express Server ${expressVersion}${reset}`,
  );
  console.log(`- Local:        ${cyan}http://localhost:${port}${reset}`);
  if (networkIP) {
    console.log(`- Network:      ${cyan}http://${networkIP}:${port}${reset}`);
  }
  console.log(`- Environments: .env`);
  console.log("");
  console.log(`${green}✓${reset} Starting...`);
  console.log(`${green}✓${reset} Ready in ${elapsed.toFixed(0)}ms`);
  console.log("");
}
