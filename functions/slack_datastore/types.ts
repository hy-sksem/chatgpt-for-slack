import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const SlackContentType = DefineType({
  name: "slack_content",
  type: Schema.types.object,
  properties: {
    ts: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.slack.types.user_id,
    },
    role: {
      type: Schema.types.string,
    },
    content: {
      type: Schema.types.string,
    },
  },
  required: ["ts", "user_id", "role", "content"],
});

export const SlackHistoryContentsType = DefineType({
  name: "slack_content",
  title: "slack content",
  type: Schema.types.array,
  items: {
    type: SlackContentType,
  },
});
export const SlackHistoryType = DefineType({
  name: "slack_history",
  type: Schema.types.object,
  properties: {
    channel_id: {
      type: Schema.slack.types.channel_id,
    },
    contents: {
      type: SlackHistoryContentsType,
    },
  },
  required: ["channel_id", "contents"],
});
