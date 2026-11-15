import type { McpServer } from "@modelcontextprotocol/server";
import incidentDetails from "./incident-details.js";

const registerResources = (server: McpServer) => {
  server.registerResource(
    incidentDetails.name,
    incidentDetails.uri,
    incidentDetails.config,
    incidentDetails.handler,
  );
};

export default registerResources;
