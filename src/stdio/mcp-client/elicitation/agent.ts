import { Command, MemorySaver } from "@langchain/langgraph";
import { createMCPElicitationResume } from "@langchain/mcp-adapters";
import { createLLMAgent } from "../../../index.js";
import { closeMcpConnections, getMcpTools } from "./client.js";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .filter(
      (block): block is { type: "text"; text: string } =>
        isRecord(block) &&
        block.type === "text" &&
        typeof block.text === "string",
    )
    .map((block) => block.text)
    .join("");
}

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    // MCP Tools
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

        You have access to MCP tools to restart services.
        If the user requests a service restart, use the relevant MCP tool.

        Never invent incident information.
        Explain the result in simple language.
      `,
      checkpointer,
    });

    // Thread Config
    const threadConfig = {
      configurable: {
        thread_id: crypto.randomUUID(),
      },
    };

    // Invoke Agent
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

    // MCP Elicitation Handling
    while (result.__interrupt__?.length) {
      const interrupt = result.__interrupt__[0];

      if (!interrupt) {
        throw new Error("Interrupt not found");
      }

      const value: unknown = interrupt.value;

      if (
        !isRecord(value) ||
        value.type !== "mcp_elicitation" ||
        !isRecord(value.requests)
      ) {
        throw new Error("Invalid MCP elicitation interrupt");
      }

      console.log("\nInterrupt value:", JSON.stringify(value, null, 2));

      const requests = value.requests;
      const [requestKey, request] = Object.entries(requests)[0] ?? [];

      if (!requestKey || !isRecord(request)) {
        throw new Error("No elicitation request found");
      }

      const requestMessage =
        typeof request.message === "string"
          ? request.message
          : "Additional information required";

      const serviceName = (
        await rl.question(`\n${requestMessage}\nEnter service name: `)
      ).trim();

      if (!serviceName) {
        throw new Error("Service name cannot be empty");
      }

      // Resume MCP Elicitation
      const resume = createMCPElicitationResume(interrupt, {
        [requestKey]: {
          action: "accept",
          content: { serviceName },
        },
      });

      result = await agent.invoke(new Command({ resume }), threadConfig);
    }

    // Extract Final Response
    const message = result.messages.at(-1);

    const response = getTextContent(message?.content);

    console.log("\nAgent response:\n", response);
  } finally {
    await closeMcpConnections();
    rl.close();
  }
}

main().catch(console.error);
