import { MCPAdapter } from "@langchain/mcp-adapters";

// servers
const mcpServers = {
  incidents: {
    command: "npx",
    args: ["tsx", "src/stdio/mcp-server/server.stdio.ts"],
  },
};

const mcpAdapter = new MCPAdapter({
  servers: mcpServers,
});

export const getIncidentResourceTemplates = async () => {
  return await mcpAdapter.listResourceTemplates();
};

export const getIncidentResources = async () => {
  return await mcpAdapter.listResources();
};

export const getIncidentResource = async (incidentId: string) => {
  return await mcpAdapter.readResource(
    "incidents",
    `incident://${encodeURIComponent(incidentId)}`,
  );
};

export const closeMCPConnection = async () => {
  await mcpAdapter.close();
};
