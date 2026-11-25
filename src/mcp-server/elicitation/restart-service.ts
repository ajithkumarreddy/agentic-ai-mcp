import {
  acceptedContent,
  inputRequired,
  type ServerContext,
} from "@modelcontextprotocol/server";
import { z } from "zod/v4";

const ServiceSchema = z.object({
  serviceName: z.string().min(1),
});

const restartService = {
  name: "restart_service",

  config: {
    title: "Restart Service",
    description: "Ask which service the user wants to restart",
    inputSchema: z.object({}),
  },

  handler: async (_input: {}, ctx: ServerContext) => {
    // Check whether the user has already provided the service name
    const answer = acceptedContent(
      ctx.mcpReq.inputResponses,
      "service",
      ServiceSchema,
    );

    // No answer yet -> trigger elicitation
    if (!answer) {
      return inputRequired({
        inputRequests: {
          service: inputRequired.elicit({
            message: "Which service do you want to restart?",
            requestedSchema: {
              type: "object",
              properties: {
                serviceName: {
                  type: "string",
                  title: "Service Name",
                },
              },
              required: ["serviceName"],
            },
          }),
        },
      });
    }

    // Answer received -> return the service name
    return {
      content: [
        {
          type: "text" as const,
          text: `You selected service: ${answer.serviceName}`,
        },
      ],
    };
  },
};

export default restartService;
