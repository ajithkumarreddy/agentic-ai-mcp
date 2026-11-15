import { ResourceTemplate } from "@modelcontextprotocol/server";
import incidents from "../mock-resources/store.js";

const incidentDetails = {
  name: "incident-details",
  uri: new ResourceTemplate("incident://{incidentId}", {
    list: undefined,
  }),
  config: {
    description: "Get incident details using incident ID",
    mimeType: "application/json",
  },
  handler: async (uri: URL, { incidentId }: { incidentId: string }) => {
    const incident = incidents.get(incidentId);

    if (!incident) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(incident),
        },
      ],
    };
  },
};

export default incidentDetails;
