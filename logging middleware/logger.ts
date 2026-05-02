export type Stack = "backend" | "frontend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type Package = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";

const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const FRONTEND_PACKAGES = ["api", "component", "hook", "page", "state", "style"];
const SHARED_PACKAGES = ["auth", "config", "middleware", "utils"];
const ALL_PACKAGES = [...FRONTEND_PACKAGES, ...SHARED_PACKAGES];

function isValidStack(stack: any): stack is Stack {
  return VALID_STACKS.includes(stack);
}

function isValidLevel(level: any): level is LogLevel {
  return VALID_LEVELS.includes(level);
}

function isValidPackage(pkg: any): pkg is Package {
  return ALL_PACKAGES.includes(pkg);
}

function canUsePackageForStack(stack: Stack, pkg: Package): boolean {
  if (stack === "frontend") {
    return FRONTEND_PACKAGES.includes(pkg as any) || SHARED_PACKAGES.includes(pkg as any);
  }
  return SHARED_PACKAGES.includes(pkg as any);
}

export class Logger {
  stack: Stack;
  endpoint: string;
  token: string | null = null;
  showLocalLogs: boolean;
  queue: any[] = [];

  constructor(stack: Stack, endpoint: string, showLocalLogs = true) {
    this.stack = stack;
    this.endpoint = endpoint;
    this.showLocalLogs = showLocalLogs;
  }

  async Log(level: LogLevel, pkg: Package, message: string): Promise<any> {
    if (!isValidLevel(level)) {
      console.error(`Bad level: ${level}`);
      return { logid: "error", message: "bad level" };
    }

    if (!isValidPackage(pkg)) {
      console.error(`Bad package: ${pkg}`);
      return { logid: "error", message: "bad package" };
    }

    if (!canUsePackageForStack(this.stack, pkg)) {
      console.error(`Package ${pkg} not allowed for ${this.stack}`);
      return { logid: "error", message: "package not allowed" };
    }

    if (!message || message.trim() === "") {
      console.error("Message is empty");
      return { logid: "error", message: "empty message" };
    }

    const logData = {
      stack: this.stack,
      level: level,
      package: pkg,
      message: message,
    };

    if (this.showLocalLogs) {
      const time = new Date().toISOString();
      console.log(`[${time}] [${this.stack}] [${level}] [${pkg}] ${message}`);
    }

    if (this.token) {
      return await this.sendLog(logData);
    } else {
      this.queue.push(logData);
      return { logid: "queued", message: "log queued" };
    }
  }

  async sendLog(logData: any) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        console.error(`Server returned ${response.status}`);
        return { logid: "error", message: "server error" };
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Failed to send log:", err);
      return { logid: "error", message: "send failed" };
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  async flushQueue() {
    const temp = [...this.queue];
    this.queue = [];
    for (const log of temp) {
      await this.sendLog(log);
    }
  }
}

export default Logger;
