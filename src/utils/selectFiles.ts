import * as path from "path";
import * as vscode from "vscode";
export async function SelectFiles() {
  const workspaceFolder = vscode.workspace.workspaceFolders;
  // If no workspace folder is found, show an error message
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder found");
    return;
  }
  console.log("workspace folder is ", workspaceFolder);
  const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");

  // Create quick pick items
  const items = files.map((file) => ({
    label: path.basename(file.path),
    description: vscode.workspace.asRelativePath(file),
    uri: file,
  }));

  // Show quick pick with multi-select
  const selected = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    placeHolder: "Select files to include in task context",
  });
  if (!selected) return;

  return selected.map((i) => i.uri);
}
