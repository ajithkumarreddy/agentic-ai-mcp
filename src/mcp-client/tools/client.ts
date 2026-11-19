import { MCPAdapter } from "@langchain/mcp-adapters";

// servers
const mcpServers = {
  incidents: {
    command: "npx",
    args: ["tsx", "src/mcp-server/server.stdio.ts"],
  },
};

export const mcpAdapter = new MCPAdapter({
  servers: mcpServers,
});

export const getMcpTools = async () => {
  return await mcpAdapter.listTools();
};

export const closeMcpConnections = async () => {
  await mcpAdapter.close();
};