import { Trigger } from "deno-slack-api/types.ts";
import ChatGPTWorkflow from "../workflows/chatgpt_workflow.ts";

const appmentionTrigger: Trigger<typeof ChatGPTWorkflow.definition> = {
  type: "event",
  name: "Trigger workflow with app mentioned",
  workflow: `#/workflows/${ChatGPTWorkflow.definition.callback_id}`,
  event: {
    event_type: "slack#/events/app_mentioned",
    channel_ids: [
      "D03PEGTH286",
      "D04TRRADX41",
      "C02CUNDU72S",
      "C04TD92V9GA",
    ],
  },

  inputs: {
    channel_id: { value: "{{data.channel_id}}" },
    user_id: { value: "{{data.user_id}}" },
    question: { value: "{{data.text}}" },
  },
};
console.log("mention");

export default appmentionTrigger;
