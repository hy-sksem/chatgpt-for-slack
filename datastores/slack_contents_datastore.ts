import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const SlackContentsDatastore = DefineDatastore({
  name: "slack_contents_datastore",
  primary_key: "id",
  attributes: {
    id: { type: Schema.slack.types.channel_id },
    contents: {
      type: Schema.types.array,
      items: { type: Schema.types.string },
    },
    // {contents: {ts: string, user_id: string, role: string, content: string, }}
  },
});
