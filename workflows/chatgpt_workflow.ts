import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { InitialResponseDefinition } from "../functions/initial_response/definition.ts";
import { MainResponseDefinition } from "../functions/main_response/definition.ts";
import { InsertContentIntoDatastoreDefinition } from "../functions/slack_datastore/insert_content.ts";
import { DeleteContentFromDatastoreDefinition } from "../functions/slack_datastore/delete_content.ts";
import { GetContentsFromDatastoreDefinition } from "../functions/slack_datastore/get_contents.ts";

const ChatGPTWorkflow = DefineWorkflow({
  callback_id: "chatgpt_workflow",
  title: "chat ChatGPT",
  description: "Chat with ChatGPT",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      content: {
        type: Schema.types.string,
      },
      ts: {
        type: Schema.slack.types.timestamp,
      },
    },
    required: ["channel_id", "content"],
  },
});

// datastoreの削除(debug用) Step
// ChatGPTWorkflow.addStep(
//   DeleteContentFromDatastoreDefinition,
//   {
//     channel_id: ChatGPTWorkflow.inputs.channel_id,
//   },
// );

// 初期メッセージを送信する Step
const initRes = ChatGPTWorkflow.addStep(
  InitialResponseDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
    content: ChatGPTWorkflow.inputs.content,
  },
);

// slackの同一チャンネルの直近10件のメッセージを取得する Step
const getContentsRes = ChatGPTWorkflow.addStep(
  GetContentsFromDatastoreDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
  },
);

// request ChatGPT API and post response into slack Step
const chatgpt_res = ChatGPTWorkflow.addStep(
  MainResponseDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
    user_id: ChatGPTWorkflow.inputs.user_id,
    content: ChatGPTWorkflow.inputs.content,
    init_ts: initRes.outputs.ts,
    history: getContentsRes.outputs.contents,
  },
);

// ユーザーのメッセージをデータストアに保存する Step
ChatGPTWorkflow.addStep(
  InsertContentIntoDatastoreDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
    user_id: ChatGPTWorkflow.inputs.user_id,
    role: "user",
    content: ChatGPTWorkflow.inputs.content,
    ts: ChatGPTWorkflow.inputs.ts,
    history: getContentsRes.outputs.contents,
  },
);

// slackの同一チャンネルの直近10件のメッセージを取得する Step
const getContentsRes2 = ChatGPTWorkflow.addStep(
  GetContentsFromDatastoreDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
  },
);

// ChatGPTのAPIの結果をデータストアに保存する Step
ChatGPTWorkflow.addStep(
  InsertContentIntoDatastoreDefinition,
  {
    channel_id: ChatGPTWorkflow.inputs.channel_id,
    user_id: chatgpt_res.outputs.ai_id,
    role: "assistant",
    content: chatgpt_res.outputs.ans,
    ts: chatgpt_res.outputs.ts,
    history: getContentsRes2.outputs.contents,
  },
);
export default ChatGPTWorkflow;
