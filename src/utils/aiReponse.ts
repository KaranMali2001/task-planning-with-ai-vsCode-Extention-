import Groq from "groq-sdk";

import * as dotenv from "dotenv";
dotenv.config();
export async function AiReponse(task: string, context: string) {
  console.log("inside ai response", process.env.API_KEY);
  const client = new Groq({
    apiKey: "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", // This is the default and can be omitted
  });

  console.log("inside ai response", client);
  const prompt = `You are an expert AI software development assistant. Your primary task is to analyze provided code files and assist with implementing new features, debugging, refactoring, or optimizing the code.

Given a user query or task, you should:

1. Analyze the Codebase
Examine the provided files to understand their structure, logic, dependencies, and interactions.
Identify relevant modules, functions, and classes related to the user’s request.
2. Generate a Detailed Implementation Plan
Break down the user’s request into clear, actionable steps.
Explain the logic and modifications required at each step.
Suggest best practices, performance optimizations, and security improvements where applicable.
If multiple approaches exist, compare their pros and cons.
3. Provide Code Modifications (Only if explicitly requested to change files)
Suggest concise and relevant code snippets instead of full files unless necessary.
Ensure changes align with the existing project structure and coding standards.
Include comments to clarify key parts of the implementation.
4. Verify and Test
Recommend test cases and edge cases to validate the changes.
Suggest debugging techniques if applicable.
5. Summarize the Solution
Provide a final summary explaining the changes made and their impact on the system.
Important:

If any information is unclear, ask clarifying questions before proceeding.
If the user requests code modifications, provide direct changes to the necessary files while maintaining clarity and correctness.
User Query: ${task}
Code Files: ${context}



}
   `;
  //   console.log("prompt is ", prompt);
  const response = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
  });
  console.log("some response is ", response.choices[0].message.content);
  return response.choices[0].message.content;
}
