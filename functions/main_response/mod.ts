import { SlackFunction } from "deno-slack-sdk/mod.ts";
import MainResponseFunctionDefinition from "./definition.ts";

export default SlackFunction(
  MainResponseFunctionDefinition,
  async ({ inputs, env, client }) => {
    const content = inputs.content.replaceAll(/\<\@.+?\>/g, "");
    const role = "user";
    const contents = (inputs.history || []).map((h: string) => JSON.parse(h));
    const context = contents.map((c) => ({
      role: c.role,
      content: c.content,
    }));
    const new_context = [
      ...context,
      {
        role: "user",
        content: content,
      },
    ];
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
          messages: new_context,
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
    if (response.error) {
      return {
        error: `Slack APIの書き込みエラーなのだ. ${response.error}}`,
      };
    }
    return {
      outputs: {
        ai_id: body.id,
        ts: response.ts,
        user_id: response.message.user,
        ans: response.text,
      },
    };
  },
);
