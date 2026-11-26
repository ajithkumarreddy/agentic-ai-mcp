import type { McpServer } from "@modelcontextprotocol/server";
import getServiceHealth from "./get-service-health.js";

const registerStructuredOutputTools = (server: McpServer) => {
  server.registerTool(
    getServiceHealth.name,
    getServiceHealth.config,
    getServiceHealth.handler,
  );
};

export default registerStructuredOutputTools;
