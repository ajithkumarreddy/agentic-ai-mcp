import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import registerTools from "./tools/index.js";
import registerResources from "./resources/index.js";
import registerElicitationTools from "./elicitation/index.js";

// mcp server
const server = new McpServer({
  name: "incident-management",
  version: "1.0.0",
});

// register tools
registerTools(server);

// register resources
registerResources(server);

// register elicitation tools
registerElicitationTools(server);

// communication protocol
serveStdio(() => server, {
  onerror: (error) => console.error("Incidents Management MCP Server error:", error),
});

console.error("Incidents Management MCP Server running on stdio");
