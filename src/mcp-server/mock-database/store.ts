const incidents = new Map([
  [
    "INC-101",
    {
      id: "INC-101",
      title: "Payment API unavailable",
      severity: "critical",
      status: "open",
      service: "payment-api",
    },
  ],
  [
    "INC-102",
    {
      id: "INC-102",
      title: "Login latency",
      severity: "medium",
      status: "investigating",
      service: "auth-service",
    },
  ],
]);

export default incidents;
