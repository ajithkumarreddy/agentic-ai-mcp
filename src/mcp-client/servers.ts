export const mcpServers = {
  incidents: {
    mode: "legacy",
    transport: "stdio",
    command: "npx",
    args: ["tsx", "src/mcp-server/server.ts"],
  },
};