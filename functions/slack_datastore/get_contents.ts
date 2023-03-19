import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GetContentsFromDatastoreDefinition = DefineFunction({
  callback_id: "get_contents_from_datastore",
  title: "get contents from datastore",
  description: "get contents from datastore",
  source_file: "functions/slack_datastore/get_contents.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "channel ID",
      },
    },
    required: ["channel_id"],
  },
  output_parameters: {
    properties: {
      contents: {
        type: Schema.types.array,
        items: { type: Schema.types.string },
        description: "contents",
      },
    },
    required: ["contents"],
  },
});

export default SlackFunction(
  GetContentsFromDatastoreDefinition,
  async ({ inputs, client }) => {
    const getRes = await client.apps.datastore.get({
      datastore: "slack_contents_datastore",
      id: inputs.channel_id,
    });

    if (!getRes.ok) {
      const error = `Failed to get content from datastore: ${getRes.error}`;
      return { error };
    } else if (getRes.item.contents === undefined) {
      console.log(`get content from datastore: []`);
      return { outputs: { contents: [] } };
    } else {
      console.log(`get content from datastore: ${getRes.item.contents}`);
      return { outputs: { contents: getRes.item.contents } };
    }
  },
);
