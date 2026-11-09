import * as z from "zod";
import incidents from "../mock-database/store.js";

const getIncidentTool = {
  name: "get_incident",

  config: {
    description: "Get incident details by Incident ID",

    inputSchema: {
      incidentId: z.string(),
    },
  },

  handler: async ({ incidentId }: { incidentId: string }) => {
    const incident = incidents.get(incidentId);

    if (!incident) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Incident ${incidentId} not found`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(incident),
        },
      ],
    };
  },
};

export default getIncidentTool;
