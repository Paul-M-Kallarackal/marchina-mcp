#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
  } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
    {
      name: "example-servers/brave-search",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
);

const BaseUrl = "https://marchina.calmmoss-a81a16c4.eastus.azurecontainerapps.io/api";

// Define the create project tool schema
const CREATE_PROJECT_TOOL: Tool = {
  name: "create_project",
  description: "Creates a new project with the specified name and description",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the project"
      },
      description: {
        type: "string", 
        description: "Description of the project"
      }
    },
    required: ["name", "description"]
  }
};

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [CREATE_PROJECT_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("No arguments provided");
    }

    if (name === "create_project") {
      const { name: projectName, description } = args as { name: string; description: string };
      
      try {
        const response = await fetch(`${BaseUrl}/mcp/guest/project`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: projectName,
            description: description,
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
          content: [{
            type: "text",
            text: `Project created successfully: ${JSON.stringify(data)}`
          }],
          isError: false
        };
      } catch (error) {
        return {
          content: [{
            type: "text", 
            text: `Error creating project: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
          }],
          isError: true
        };
      }
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);