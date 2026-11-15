import { closeMcpConnections, getMcpTools } from "./client.js";

async function main() {
  try {
    const tools = await getMcpTools();
    console.log("\n MCP Tools discovered: ", tools.length);

    for (const tool of tools) {
      console.log({
        name: tool.name,
        description: tool.description,
      });
    }
  } finally {
    closeMcpConnections();
  }
}

main().catch(console.error);
