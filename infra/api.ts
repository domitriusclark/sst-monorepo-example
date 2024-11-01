import { table } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [table],
      },
    },
  },
});

api.route("POST /notes", "packages/functions/src/create.main");
api.route("GET /notes/{noteId}", "packages/functions/src/get.main");
api.route("GET /notes", "packages/functions/src/getAllNotes.main");
api.route("PUT /notes/{noteId}", "packages/functions/src/update.main");
api.route("DELETE /notes/{noteId}", "packages/functions/src/delete.main");
