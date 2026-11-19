import { ResourceTemplate, type Variables } from "@modelcontextprotocol/server";
import incidents from "../mock-resources/store.js";

const incidentDetails = {
  name: "incident-details",
  uri: new ResourceTemplate("incident://{incidentId}", {
    list: undefined,
  }),
  config: {
    title: "Incident Details",
    description: "Get incident details for an incident ID",
    mimeType: "application/json",
  },
  handler: async (uri: URL, variables: Variables) => {
    const incidentId = variables.incidentId;

    if (typeof incidentId !== "string") {
      throw new Error("Invalid incident ID");
    }

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
