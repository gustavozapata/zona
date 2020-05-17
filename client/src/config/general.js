export const host =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://zona-server.herokuapp.com";
