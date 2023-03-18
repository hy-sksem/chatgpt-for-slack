import { Manifest } from "deno-slack-sdk/mod.ts";
import ChatGPTWorkflow from "./workflows/chatgpt_workflow.ts";
import InitialResponseDefinition from "./functions/initial_response/definition.ts";
import MainResponseDefinition from "./functions/initial_response/definition.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "ChaTARO(ChatGPT) v0.2",
  description: "chat bot answers any questions with official ChatGPT API",
  icon: "assets/icon.png",
  functions: [InitialResponseDefinition, MainResponseDefinition],
  workflows: [ChatGPTWorkflow],
  outgoingDomains: [
    "api.openai.com",
  ],
  botScopes: [
    "commands",
    "app_mentions:read",
    "chat:write",
    "chat:write.public",
    "channels:read",
  ],
});
