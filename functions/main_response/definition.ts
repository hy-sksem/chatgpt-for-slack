import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const MainResponseDefinition = DefineFunction({
  callback_id: "main_response_function",
  title: "main response",
  description: "response main message to user",
  source_file: "functions/main_response/mod.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "channel ID",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user ID",
      },
      content: {
        type: Schema.types.string,
        description: "content to chatgpt",
      },
      init_ts: {
        type: Schema.types.string,
        description: "timestamp ID",
      },
    },
    required: ["channel_id", "user_id", "content", "init_ts"],
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

export default MainResponseDefinition;
