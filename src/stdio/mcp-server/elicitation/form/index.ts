import type { McpServer } from "@modelcontextprotocol/server";
import restartService from "../form/restart-service.js";

const registerElicitationTools = (server: McpServer) => {
  server.registerTool(
    restartService.name,
    restartService.config,
    restartService.handler,
  );
};

export default registerElicitationTools;
