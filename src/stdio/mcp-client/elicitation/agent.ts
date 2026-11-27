import { Command, MemorySaver } from "@langchain/langgraph";
import {
  createMCPElicitationResume,
  type MCPElicitationInterrupt,
} from "@langchain/mcp-adapters";
import { createLLMAgent } from "../../../index.js";
import { closeMcpConnections, getMcpTools } from "./client.js";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    // Get MCP tools
    const tools = await getMcpTools();

    console.log("\nMCP Tools discovered:", tools.length);

    for (const tool of tools) {
      console.log({
        name: tool.name,
        description: tool.description,
      });
    }

    // Checkpointer
    const checkpointer = new MemorySaver();

    // Create Agent
    const agent = createLLMAgent(tools, undefined, {
     systemPrompt: `
        You are a service restart agent.

        RULES:
        - When the user asks to restart a service, ALWAYS call incidents_restart_service.
        - Let the MCP tool handle all required information through elicitation.
        - Never simulate a restart yourself.
        - Explain the tool result in simple language.
      `,
      checkpointer,
    });

    // Thread Config
    const threadConfig = {
      configurable: {
        thread_id: crypto.randomUUID(),
      },
    };

    // Initial Agent call
    let result = await agent.invoke(
      {
        messages: [
          {
            role: "user",
            content: "Restart a service",
          },
        ],
      },
      threadConfig,
    );

    // Handle MCP Elicitation (MRTR)
    while (result.__interrupt__?.length) {
      const interrupt = result.__interrupt__[0];

      if (!interrupt) {
        throw new Error("Interrupt not found");
      }

      const value = interrupt.value as MCPElicitationInterrupt;

      if (value.type !== "mcp_elicitation") {
        throw new Error("Invalid MCP elicitation interrupt");
      }

      console.log("\nElicitation request:", value);

      // Get the first elicitation request
      const entry = Object.entries(value.requests)[0];

      if (!entry) {
        throw new Error("Elicitation request not found");
      }

      const [requestKey, request] = entry;

      console.log("\nServer message:", request.message);

      let content;

      // Round 1: Ask for service name
      if (requestKey === "service") {
        const serviceName = (
          await rl.question("\nEnter service name: ")
        ).trim();

        if (!serviceName) {
          throw new Error("Service name cannot be empty");
        }

        content = {
          serviceName,
        };
      }

      // Round 2: Ask for confirmation
      else if (requestKey === "confirm") {
        const answer = (await rl.question("\nConfirm restart? (y/n): "))
          .trim()
          .toLowerCase();

        content = {
          confirm: answer === "y" || answer === "yes",
        };
      } else {
        throw new Error(`Unknown request: ${requestKey}`);
      }

      // Resume the original Agent operation
      const resume = createMCPElicitationResume(interrupt, {
        [requestKey]: {
          action: "accept",
          content,
        },
      });

      result = await agent.invoke(new Command({ resume }), threadConfig);
    }

    // Extract final response
    const lastMessage = result.messages.at(-1);

    let response = "";

    if (typeof lastMessage?.content === "string") {
      response = lastMessage.content;
    } else if (Array.isArray(lastMessage?.content)) {
      response = lastMessage.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");
    }

    console.log("\nAgent response:\n", response);
  } finally {
    await closeMcpConnections();
    rl.close();
  }
}

main().catch(console.error);
