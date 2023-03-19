import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const InsertContentIntoDatastoreDefinition = DefineFunction({
  callback_id: "insert_content_into_datastore",
  title: "insert content into datastore",
  description: "insert content into datastore",
  source_file: "functions/slack_datastore/insert_content.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "channel ID",
      },
      user_id: {
        type: Schema.types.string,
        description: "user ID",
      },
      role: {
        type: Schema.types.string,
        description: "role",
      },
      content: {
        type: Schema.types.string,
        description: "content",
      },
      ts: {
        type: Schema.types.string,
        description: "timestamp ID",
      },
      history: {
        type: Schema.types.array,
        items: { type: Schema.types.string },
        description: "history",
      },
    },
    required: ["channel_id", "user_id", "role", "content", "ts", "history"],
  },
  output_parameters: {
    properties: {
      content: {
        type: Schema.types.string,
        description: "content",
      },
    },
    required: ["content"],
  },
});

export default SlackFunction(
  InsertContentIntoDatastoreDefinition,
  async ({ inputs, client }) => {
    const content = inputs.content.replaceAll(/\<\@.+?\>/g, "");
    const contents = (inputs.history || []).map((h: string) => JSON.parse(h));
    const new_history = [
      ...contents,
      {
        ts: inputs.ts,
        user_id: inputs.user_id,
        role: inputs.role,
        content: content,
      },
    ].slice(-10);
    const response = await client.apps.datastore.update({
      datastore: "slack_contents_datastore",
      item: {
        id: inputs.channel_id,
        contents: new_history.map((h) => JSON.stringify(h)),
      },
    });

    if (!response.ok) {
      const error = `Failed to save a content in datastore: ${response.error}`;
      return { error };
    } else {
      console.log(`A new content saved: ${response.item.contents}`);
      return { outputs: { content: content } };
    }
  },
);
