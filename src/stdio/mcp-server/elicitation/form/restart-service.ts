import {
  acceptedContent,
  inputRequired,
  type ServerContext,
} from "@modelcontextprotocol/server";
import z from "zod";

const ServiceSchema = z.object({
  serviceName: z.string().min(1),
});

const ConfirmSchema = z.object({
  confirm: z.boolean(),
});

const restartService = {
  name: "restart_service",

  config: {
    title: "Restart Service",
    description: "Restarts a service with user confirmation.",
    inputSchema: z.object({
      serviceName: z.string().min(1).optional(),
    }),
  },

  handler: async (input: { serviceName?: string }, ctx: ServerContext) => {
    // Restore previous round's state
    const rawState = ctx.mcpReq.requestState<string>();

    const state = rawState ? JSON.parse(rawState) : undefined;

    // Get service name from input, elicitation response, or saved state
    const serviceResponse = acceptedContent(
      ctx.mcpReq.inputResponses,
      "service",
      ServiceSchema,
    );

    const serviceName =
      input.serviceName?.trim() ||
      serviceResponse?.serviceName ||
      state?.serviceName;

    // Round 1: Ask for service name
    if (!serviceName) {
      return inputRequired({
        inputRequests: {
          service: inputRequired.elicit({
            message: "Which service do you want to restart?",
            requestedSchema: {
              type: "object",
              properties: {
                serviceName: { type: "string" },
              },
              required: ["serviceName"],
            },
          }),
        },
      });
    }

    // Round 2: Ask for confirmation
    const confirmResponse = acceptedContent(
      ctx.mcpReq.inputResponses,
      "confirm",
      ConfirmSchema,
    );

    if (!confirmResponse) {
      return inputRequired({
        inputRequests: {
          confirm: inputRequired.elicit({
            message: `Confirm restart of "${serviceName}"?`,
            requestedSchema: {
              type: "object",
              properties: {
                confirm: { type: "boolean" },
              },
              required: ["confirm"],
            },
          }),
        },

        // Save service name for the next round
        requestState: JSON.stringify({ serviceName }),
      });
    }

    // User declined
    if (!confirmResponse.confirm) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Restart cancelled for "${serviceName}".`,
          },
        ],
      };
    }

    // User approved
    return {
      content: [
        {
          type: "text" as const,
          text: `Service "${serviceName}" restarted successfully.`,
        },
      ],
    };
  },
};

export default restartService;