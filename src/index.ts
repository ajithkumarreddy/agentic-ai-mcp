import "dotenv/config";

import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import type { CreateAgentParams } from "langchain";
import type { StructuredTool, ResponseFormat } from "@langchain/core/tools";

type AgentOptions = Omit<
  CreateAgentParams,
  "model" | "tools" | "responseFormat"
>;

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash",
  temperature: 0,
  maxRetries: 3,
});

const createLLMAgent = (
  tools: StructuredTool[] = [],
  responseFormat?: ResponseFormat | any,
  options: AgentOptions = {},
) => {
  return createAgent({
    model,
    tools,
    responseFormat,
    ...options,
  });
};

const response = await model.invoke("Explain mcp in simple terms");

console.log(response.content);
