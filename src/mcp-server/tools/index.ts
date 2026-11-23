import type { McpServer } from "@modelcontextprotocol/server";
import getIncidentTool from "./get-incident.js";
import getServiceHealth from "./structured-output/get-service-health.js";

const registerTools = (server: McpServer) => {
  server.registerTool(
    getIncidentTool.name,
    getIncidentTool.config,
    getIncidentTool.handler,
  );

  server.registerTool(
    getServiceHealth.name,
    getServiceHealth.config,
    getServiceHealth.handler,
  );
};

export default registerTools;
