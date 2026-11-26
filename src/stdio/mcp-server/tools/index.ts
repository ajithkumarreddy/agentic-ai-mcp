import type { McpServer } from "@modelcontextprotocol/server";
import getIncidentTool from "./get-incident.js";

const registerTools = (server: McpServer) => {
  server.registerTool(
    getIncidentTool.name,
    getIncidentTool.config,
    getIncidentTool.handler,
  );
};

export default registerTools;
