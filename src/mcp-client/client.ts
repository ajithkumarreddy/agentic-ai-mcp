import { MCPAdapter } from "@langchain/mcp-adapters";
import { mcpServers } from "./servers.js";

export const mcpAdapter = new MCPAdapter({
  servers: mcpServers,
});

export const getMcpTools = async () => {
  return await mcpAdapter.listTools();
};

export const closeMcpConnections = async () => {
  await mcpAdapter.close();
};