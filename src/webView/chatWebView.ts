import * as path from "path";
export function getChatWebviewContent(
  fileContents: Array<{ path: string; content: string }>
) {
  return `<!DOCTYPE html>
  <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css">
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <style>
              :root {
                  --bg-primary: #0d1117;
                  --bg-secondary: #161b22;
                  --border-color: #30363d;
                  --text-primary: #c9d1d9;
                  --accent-color: #238636;
              }
              body {
                  background-color: var(--bg-primary);
                  color: var(--text-primary);
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  line-height: 1.6;
              }
              #container {
                  max-width: 900px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .section {
                  background-color: var(--bg-secondary);
                  border: 1px solid var(--border-color);
                  border-radius: 6px;
                  margin-bottom: 20px;
                  padding: 15px;
              }
              #files-list {
                  list-style-type: none;
                  padding: 0;
              }
              #files-list li {
                  background-color: var(--bg-primary);
                  border: 1px solid var(--border-color);
                  margin-bottom: 5px;
                  padding: 8px;
                  border-radius: 4px;
              }
              #task-input {
                  width: 100%;
                  min-height: 120px;
                  background-color: var(--bg-primary);
                  color: var(--text-primary);
                  border: 1px solid var(--border-color);
                  border-radius: 4px;
                  padding: 10px;
                  resize: vertical;
              }
              #response {
                  min-height: 200px;
                  max-height: 500px;
                  overflow-y: auto;
                  word-wrap: break-word;
              }
              #submit-btn {
                  background-color: var(--accent-color);
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  cursor: pointer;
                  border-radius: 4px;
                  transition: background-color 0.3s ease;
              }
              #submit-btn:hover {
                  background-color: #2ea44f;
              }
              .markdown-body {
                  background-color: transparent;
                  color: var(--text-primary);
              }
              #loading {
                  display: none;
                  text-align: center;
                  padding: 20px;
                  color: var(--text-primary);
              }
          </style>
      </head>
      <body>
          <div id="container">
              <div class="section">
                  <h3>Selected Files</h3>
                  <ul id="files-list">
                      <!-- Files will be dynamically populated -->
                  </ul>
              </div>
              
              <div class="section">
                  <textarea id="task-input" placeholder="Describe your task or ask a question about the selected files..."></textarea>
                  <button id="submit-btn" onclick="submitTask()">Generate Plan</button>
              </div>
  
              <div id="loading">
                  Generating response... Please wait.
              </div>
  
              <div class="section">
                  <div id="response" class="markdown-body"></div>
              </div>
          </div>
  
          <script>
              const vscode = acquireVsCodeApi();
              const responseDiv = document.getElementById('response');
              const loadingDiv = document.getElementById('loading');
              const filesList = document.getElementById('files-list');
              let accumulatedResponse = '';
  
              // Populate files list
              function populateFilesList(files) {
                  filesList.innerHTML = files.map(file => 
                      \`<li>\${file.name || 'Unnamed File'}</li>\`
                  ).join('');
              }
  
              function submitTask() {
                  const taskInput = document.getElementById('task-input');
                  const task = taskInput.value.trim();
                  
                  if (!task) {
                      vscode.postMessage({
                          command: 'error',
                          message: 'Please enter a task or question.'
                      });
                      return;
                  }
                  
                  // Reset UI
                  responseDiv.innerHTML = '';
                  loadingDiv.style.display = 'block';
                  accumulatedResponse = '';
                  
                  // Send task to extension
                  vscode.postMessage({
                      command: 'submitTask',
                      task: task
                  });
              }
  
              // Handle messages from the extension
              window.addEventListener('message', event => {
                  const message = event.data;
                  
                  // Hide loading indicator
                  loadingDiv.style.display = 'none';
  
                  switch (message.command) {
                      case 'updateFiles':
                          populateFilesList(message.files);
                          break;
                      
                      case 'stream':
                          accumulatedResponse += message.chunk;
                          responseDiv.innerHTML = marked.parse(accumulatedResponse);
                          break;
                      
                      case 'displayPlan':
                          responseDiv.innerHTML = marked.parse(message.plan);
                          break;
                      
                      case 'error':
                          responseDiv.innerHTML = \`## Error\n\n\${message.message}\`;
                          break;
                  }
              });
  
              // Initial files population (if any)
              populateFilesList(${JSON.stringify(
                fileContents.map((file) => ({
                  name: path.basename(file.path),
                }))
              )});
          </script>
      </body>
  </html>`;
}
