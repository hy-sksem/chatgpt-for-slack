import { SlackFunction } from "deno-slack-sdk/mod.ts";
import InitialResponseFunctionDefinition from "./definition.ts";

export default SlackFunction(
  InitialResponseFunctionDefinition,
  async ({ inputs, client }) => {
    const response = await client.chat.postMessage({
      channel: inputs.channel_id,
      text: "(考え中なのだ...)",
    });
    console.log(inputs.content);
    console.log(response);
    if (!response.ok) {
      return {
        error: `エラーなのだ. ${response.error}}`,
      };
    }
    return { outputs: {} };
  },
);
