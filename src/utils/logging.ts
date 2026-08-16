function formatArg(arg: any): string {
  if (arg instanceof Error) return `${arg.name}: ${arg.message}\n${arg.stack}`;
  if (typeof arg === "object") return JSON.stringify(arg);
  return String(arg);
}

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

const fallbackLog =
  (level: string) =>
  async (...args: any[]) => {
    const message = args.map(formatArg).join(" ");
    switch (level) {
      case "error":
        console.error(message);
        break;
      case "warn":
        console.warn(message);
        break;
      case "debug":
        console.debug(message);
        break;
      default:
        console.log(message);
    }
  };

let logFunctions: {
  info: (...args: any[]) => Promise<void>;
  warn: (...args: any[]) => Promise<void>;
  error: (...args: any[]) => Promise<void>;
  debug: (...args: any[]) => Promise<void>;
  trace: (...args: any[]) => Promise<void>;
};

if (isTauri) {
  const { debug, error, info, trace, warn } = require("@tauri-apps/plugin-log");
  logFunctions = {
    info: async (...args: any[]) => info(args.map(formatArg).join(" ")),
    warn: async (...args: any[]) => warn(args.map(formatArg).join(" ")),
    error: async (...args: any[]) => error(args.map(formatArg).join(" ")),
    debug: async (...args: any[]) => debug(args.map(formatArg).join(" ")),
    trace: async (...args: any[]) => trace(args.map(formatArg).join(" ")),
  };
} else {
  logFunctions = {
    info: fallbackLog("info"),
    warn: fallbackLog("warn"),
    error: fallbackLog("error"),
    debug: fallbackLog("debug"),
    trace: fallbackLog("trace"),
  };
}

export const logger = logFunctions;

export function setupLogger() {
  if (typeof window !== "undefined" && !(window as any).log) {
    (window as any).logger = logger;
  }
}
