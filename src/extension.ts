// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { AiReponse } from "./utils/aiReponse";
import { SelectFiles } from "./utils/selectFiles";
import { getChatWebviewContent } from "./webView/chatWebView";
import { getFileContent } from "./utils/getFileContent";

let selectedFiles: vscode.Uri[] | undefined = [];
export function activate(context: vscode.ExtensionContext) {
  //register the command
  const selectFileCommand = vscode.commands.registerCommand(
    "taskPlanner.selectFiles",
    async () => {
      //get selected files
      selectedFiles = await SelectFiles();
      //directly open the chat
      vscode.commands.executeCommand("taskPlanner.openChat");
    }
  );
  const openChatCommand = vscode.commands.registerCommand(
    "taskPlanner.openChat",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "taskPlannerChat",
        "Task Planner Chat",
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
        }
      );
      const fileContents = await getFileContent(selectedFiles);
      panel.webview.html = getChatWebviewContent(fileContents);
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
            case "submitTask":
              console.log("INSIDE SUBMIT TASK");
              const task = message.task;
              console.log("task is ", task);
              const response = await AiReponse(
                task,
                JSON.stringify(fileContents)
              );
              panel.webview.postMessage({
                command: "displayPlan",
                plan: response,
              });

              vscode.window.showInformationMessage(`Task submitted: ${task}`);
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );
  context.subscriptions.push(openChatCommand, selectFileCommand);
}
