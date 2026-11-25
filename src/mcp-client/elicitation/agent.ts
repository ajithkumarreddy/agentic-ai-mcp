import { createLLMAgent } from "../../index.js";
import { closeMcpConnections, getMcpTools, mcpAdapter } from "./client.js";

async function main() {
  try {
    // MCP Tools
    const tools = await getMcpTools();
    console.log("\n MCP Tools discovered: ", tools.length);

    for (const tool of tools) {
      console.log({
        name: tool.name,
        description: tool.description,
      });
    }

    // create agent
    const agent = createLLMAgent(tools, undefined, {
      systemPrompt: `
        You are an service restart agent

        where you got access to mcp tools to restart a service
        If the user requests to restart a service use relative MCP tools to perform the action.

        Never invent incident information. 
        Explain the result in simple language
      `,
    });

    // invoke agent
    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: "restart payment-k8s service",
        },
      ],
    });

    const message = result.messages.at(-1);

    console.log("\nAgent response:\n", message?.content);
  } finally {
    closeMcpConnections();
  }
}

main().catch(console.error);
