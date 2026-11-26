import { createLLMAgent } from "../../../index.js";
import {
  closeMCPConnection,
  getIncidentResource,
  getIncidentResourceTemplates,
} from "./client.js";

async function main() {
  try {
    // MCP resources
    const templates = await getIncidentResourceTemplates();

    console.log("Resource templates:");
    console.dir(templates, { depth: null });

    // Read Incident Resource
    const result = await getIncidentResource("INC-101");

    const content = result.find((item) => "text" in item);

    if (!content || !("text" in content)) {
      throw new Error("Incident resource returned no text content");
    }

    const incident = JSON.parse(content.text);

    // agent
    const agent = createLLMAgent([], undefined, {
      systemPrompt: `You are an incidnet management assistant.

      Use the following MCP resource data to answer questions.

      Never invent incident information. 
      Explain the result in simple language
      
      Incident information:
      ${JSON.stringify(incident, null, 2)}`,
    });

    // Invoke agent
    const response = await agent.invoke({
      messages: [
        {
          role: "user",
          content: "Explain incident INC-101.",
        },
      ],
    });

    console.log(response.messages.at(-1)?.content);
  } finally {
    // 4. Close MCP connection
    await closeMCPConnection();
  }
}

main().catch(console.error);
