# Marchina MCP Server

This is the Marchina MCP server that creates projects in the guest account through Claude Desktop or Cursor.

## Instructions

1. Paste the following config to your `mcp.json` and wait for it to connect:

```json 
{
  "mcpServers": {
    "marchina": {
      "command": "npx",
      "args": ["-y @marchina/npx-mcp"],
      "env": {}
    }
  }
}
```



2. Once connected, you can describe your Marchina Project to Cursor and it will create it for you.

For example, you can say:
"I want to create a new Marchina project called 'My E-commerce App' that will be an online store for selling handmade crafts"

Cursor will use the `create_project` tool to create your project in the guest account and return the project details.