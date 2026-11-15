import { McpServer } from "@modelcontextprotocol/server";
import registerTools from "./tools/index.js";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

const server = new McpServer({
  name: "incident-management",
  version: "1.0.0",
});

registerTools(server);

serveStdio(() => server, {
  onerror: (error) => console.error("Incidents Management MCP Server error:", error),
});

console.error("Incidents Management MCP Server running on stdio");
