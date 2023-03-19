import { Manifest } from "deno-slack-sdk/mod.ts";
import ChatGPTWorkflow from "./workflows/chatgpt_workflow.ts";
import InitialResponseDefinition from "./functions/initial_response/definition.ts";
import MainResponseDefinition from "./functions/initial_response/definition.ts";
import { InsertContentIntoDatastoreDefinition } from "./functions/slack_datastore/insert_content.ts";
import { GetContentsFromDatastoreDefinition } from "./functions/slack_datastore/get_contents.ts";
import { SlackContentsDatastore } from "./datastores/slack_contents_datastore.ts";
import { DeleteContentFromDatastoreDefinition } from "./functions/slack_datastore/delete_content.ts";
import {
  SlackHistoryContentsType,
  SlackHistoryType,
} from "./functions/slack_datastore/types.ts";

export default Manifest({
  name: "ChaTARO(ChatGPT) v1.0",
  description: "chat bot answers any questions with official ChatGPT API",
  icon: "assets/icon.png",
  functions: [
    InitialResponseDefinition,
    MainResponseDefinition,
    InsertContentIntoDatastoreDefinition,
    GetContentsFromDatastoreDefinition,
    DeleteContentFromDatastoreDefinition,
  ],
  workflows: [ChatGPTWorkflow],
  outgoingDomains: [
    "api.openai.com",
  ],
  datastores: [SlackContentsDatastore],
  types: [SlackHistoryType, SlackHistoryContentsType],
  botScopes: [
    "commands",
    "app_mentions:read",
    "chat:write",
    "chat:write.public",
    "channels:read",
    "datastore:read",
    "datastore:write",
  ],
});
