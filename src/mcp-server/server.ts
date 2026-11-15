import { McpServer } from "@modelcontextprotocol/server";
import registerTools from "./tools/index.js";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import registerResources from "./resources/index.js";

// mcp server
const server = new McpServer({
  name: "incident-management",
  version: "1.0.0",
});

// register tools
registerTools(server);

// register resources
registerResources(server);

// communication protocol
serveStdio(() => server, {
  onerror: (error) => console.error("Incidents Management MCP Server error:", error),
});

console.error("Incidents Management MCP Server running on stdio");
