
import { createLLMAgent } from "../../../index.js";
import { closeMcpConnections, getMcpTools } from "./client.js";

async function main() {
  try {
    // MCP tools
    const tools = await getMcpTools();
    console.log("\n MCP Tools discovered: ", tools.length);

    for (const tool of tools) {
      console.log({
        name: tool.name,
        description: tool.description,
      });
    }

    // agent
    const agent = createLLMAgent(tools, undefined, {
      systemPrompt: `
        You are an service health check agent

        where you have access to mcp tools to get service health for a given service 

        Return the response format as same as mcp tools structured content
        `,
    });

    // Invoke Agent
    const result = await agent.invoke({
      messages: {
        role: "user",
        content: "Check service health of payment-k8s API",
      },
    });

    const message = result.messages.at(-1);

    console.log("\nAgent response:\n", message?.content);
  } finally {
    closeMcpConnections();
  }
}

main().catch(console.error);
