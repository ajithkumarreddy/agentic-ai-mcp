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
    description:
      "Restarts a service. If serviceName is not provided, asks the user which service to restart.",
    inputSchema: z.object({
      serviceName: z.string().min(1).optional(),
    }),
  },

  handler: async (input: { serviceName?: string }, ctx: ServerContext) => {
    let serviceName = input.serviceName;

    if (!serviceName) {
      const answer = acceptedContent(
        ctx.mcpReq.inputResponses,
        "service",
        ServiceSchema,
      );

      if (!answer) {
        return inputRequired({
          inputRequests: {
            service: inputRequired.elicit({
              message: "Which service do you want to restart?",
              requestedSchema: {
                type: "object",
                properties: {
                  serviceName: { type: "string", title: "Service Name" },
                },
                required: ["serviceName"],
              },
            }),
          },
        });
      }
      serviceName = answer.serviceName;
    }

    // TODO: actually restart the service here
    return {
      content: [
        { type: "text" as const, text: `Service "${serviceName}" restarted.` },
      ],
    };
  },
};

export default restartService;
