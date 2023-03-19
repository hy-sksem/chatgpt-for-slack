import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const DeleteContentFromDatastoreDefinition = DefineFunction({
  callback_id: "delete_content_from_datastore",
  title: "delete content from datastore",
  description: "delete content from datastore",
  source_file: "functions/slack_datastore/delete_content.ts",
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
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  DeleteContentFromDatastoreDefinition,
  async ({ inputs, client }) => {
    const response = await client.apps.datastore.delete({
      datastore: "slack_contents_datastore",
      id: inputs.channel_id,
    });

    if (!response.ok) {
      const error =
        `Failed to delete a content in datastore: ${response.error}`;
      return { error };
    } else {
      console.log(`A content deleted: ${response.items}`);
      return { outputs: [] };
    }
  },
);
