import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { InitialResponseDefinition } from "../functions/initial_response/definition.ts";
import { MainResponseDefinition } from "../functions/main_response/definition.ts";

const ChatGPTWorkflow = DefineWorkflow({
  callback_id: "chatgpt_workflow",
  title: "chat ChatGPT",
  description: "Chat with ChatGPT",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      question: {
        type: Schema.types.string,
      },
    },
    required: ["channel_id", "question"],
  },
});

// 初期メッセージを送信する Step
const initResponse = ChatGPTWorkflow.addStep(
  InitialResponseDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
    content: ChatGPTWorkflow.inputs.question,
  },
);

// ChatGPTのAPIの結果を送信する Step
ChatGPTWorkflow.addStep(
  MainResponseDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
    user_id: ChatGPTWorkflow.inputs.user_id,
    content: ChatGPTWorkflow.inputs.question,
    init_ts: initResponse.outputs.ts,
  },
);
export default ChatGPTWorkflow;
