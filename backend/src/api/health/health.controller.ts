import { Context } from "hono";

export const healthController = {
  // Get basic health status
  getStatus: (c: Context) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  },

  // Get detailed system information
  getDetails: (c: Context) => {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: {
        memory: {
          total: memoryUsage.heapTotal,
          used: memoryUsage.heapUsed,
          external: memoryUsage.external,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        node: {
          version: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      },
    });
  },
};
