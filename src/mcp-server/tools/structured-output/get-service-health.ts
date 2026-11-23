import z from "zod";

const getServiceHealth = {
  name: "get_service_health",

  config: {
    title: "Get Service Health",
    description: "Get service health for a given service",
    inputSchema: z.object({
      service: z.string(),
    }),
    outputSchema: z.object({
      service: z.string(),
      status: z.enum(["healthy", "degraded", "down"]),
      latency: z.number(),
      checkedAt: z.iso.datetime(),
    }),
  },

  handler: async ({ service }: { service: string }) => {
    const output = {
      service,
      status: "healthy",
      latency: 120,
      checkedAt: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(output),
        },
      ],
      structuredContent: output,
    };
  },
};

export default getServiceHealth;
