import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { InitialResponseDefinition } from "../functions/initial_response/definition.ts";
import { ChatGPTFunctionDefinition } from "../functions/chatgpt_function.ts";

const ChatGPTWorkflow = DefineWorkflow({
  callback_id: "chatgpt_workflow",
  title: "Ask AI",
  description: "Respond question to users",
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

ChatGPTWorkflow.addStep(
  InitialResponseDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
    content: ChatGPTWorkflow.inputs.question,
  },
);

const chatGPTFunctionStep = ChatGPTWorkflow.addStep(
  ChatGPTFunctionDefinition,
  {
    user_id: ChatGPTWorkflow.inputs.user_id,
    question: ChatGPTWorkflow.inputs.question,
  },
);

// メッセージをチャネルに送信する Step
ChatGPTWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: ChatGPTWorkflow.inputs.channel_id,
  message: chatGPTFunctionStep.outputs.answer,
});

export default ChatGPTWorkflow;
