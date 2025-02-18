import * as vscode from "vscode";
export async function getFileContent(selectedFiles: vscode.Uri[] | undefined) {
  const fileContents = await Promise.all(
    selectedFiles!.map(async (f) => {
      try {
        const content = await vscode.workspace.fs.readFile(f);
        return {
          path: f.path,
          content: content.toString(),
        };
      } catch (error) {
        console.error(error);
        return {
          path: f.path,
          content: "",
        };
      }
    })
  );
  return fileContents;
}
