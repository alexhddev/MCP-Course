# Steps for MCP TypeScript project

1. **Initialize the project in emtpy folder:**
   ```bash
   npm init -y
   ```

2. **Install MCP and express dependencies:**
   ```bash
   npm install @modelcontextprotocol/sdk express
   ```

3. **Install dev dependencies:**
   ```bash
   npm install @types/node zod @types/express tsx typescript
   ```

4. **Create HelloName mcp files:**
   - create src/Server.ts
   - create src/MainStdio.ts

5. **Test the MCP:**
   - create .vscode/mcp.json file and add the server