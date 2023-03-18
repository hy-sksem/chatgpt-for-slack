import { SlackFunction } from "deno-slack-sdk/mod.ts";
import MainResponseFunctionDefinition from "./definition.ts";

export default SlackFunction(
  MainResponseFunctionDefinition,
  async ({ inputs, env, client }) => {
    const content = inputs.content.replaceAll(/\<\@.+?\>/g, " ");
    const role = "user";
    const res = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role, content }],
        }),
      },
    );
    if (res.status != 200) {
      const body = await res.text();
      return {
        error: `Failed to call OpenAPI AI. status:${res.status} body:${body}`,
      };
    }
    const body = await res.json();
    console.log("chatgpt api response", { role, content }, body);

    const response = await client.chat.update({
      channel: inputs.channel_id,
      ts: inputs.init_ts,
      text: body.choices[0].message.content,
    });
    console.log(response);
    if (!response.ok) {
      return {
        error: `Slack APIの書き込みエラーなのだ. ${response.error}}`,
      };
    }
    return { outputs: response.ts };
  },
);
