import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const InitialResponseDefinition = DefineFunction({
  callback_id: "initial_response_function",
  title: "initial response",
  description: "response initial message to user",
  source_file: "functions/initial_response/mod.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "channel ID",
      },
      content: {
        type: Schema.types.string,
        description: "content",
      },
    },
    required: ["channel_id", "content"],
  },
  output_parameters: {
    properties: {
      ts: {
        type: Schema.types.string,
        description: "timestamp ID",
      },
    },
    required: ["ts"],
  },
});

export default InitialResponseDefinition;
