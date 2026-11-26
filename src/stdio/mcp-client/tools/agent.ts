
import { createLLMAgent } from "../../../index.js";
import { getMcpTools, closeMcpConnections } from "./client.js";

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

    // Agent
    const agent = createLLMAgent(tools, undefined, {
      systemPrompt: `You are an incidnet management assistant.

      You have access to MCP tools for retrieving incident information.

      When the user asks about an incident, use the appropriate MCP tools.

      Never invent incident information. 
      Explain the result in simple language`,
    });

    // Invoke Agent
    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: "Get incident INC-101 and explain it.",
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
