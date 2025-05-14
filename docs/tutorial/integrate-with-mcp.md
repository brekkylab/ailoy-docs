# Integrate with MCP

The **Model Context Protocol (MCP)** is an open protocol developed by Anthropic to standardize how language models interact with external systems—such as tools, memory backends, and context managers. MCP enables structured, dynamic communication between an LLM and its environment, empowering models to access external tools, retrieve real-time information, and perform complex, multi-step reasoning.

### Using MCP with Ailoy

Ailoy Agents can seamlessly integrate with existing MCP-compliant servers. For example, the following code connects to the official GitHub MCP server:

```python
from mcp import StdioServerParameters

agent.add_tools_from_mcp_server(
    StdioServerParameters(
        command="npx",
        args=["-y", "@modelcontextprotocol/server-github"]
    )
)
```

This launches the GitHub MCP server as a subprocess using standard I/O for communication. The agent automatically discovers the tools exposed by the server and registers them into its internal toolset.

### Querying via MCP Tools

Once the tools are registered, the agent can invoke them naturally through its `query()` method:

```python
question = "Search the repository named brekkylab/ailoy and describe what it does based on its README.md."
for resp in agent.query(question):
    print(resp.content, end='')
print()
```

This demonstrates how the agent utilizes the GitHub MCP tools to search repositories and summarize their contents.

(TODO) console output

### Complete Example

Here is the full source code to set up an agent, connect it to the GitHub MCP server, and issue a query:

```python
from ailoy import AsyncRuntime, Agent
from mcp import StdioServerParameters

rt = Runtime()
with Agent(rt, model_name="qwen3-8b") as agent:
    # Add tools from Github MCP server
    agent.add_tools_from_mcp_server(
        StdioServerParameters(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-github"]
        )
    )

    question = "Search the repository named brekkylab/ailoy and describe what it does based on its README.md."
    for resp in agent.run(question):
        print(resp.content, end='')
    print()
```

> **Note**: This example assumes that Node.js and the `@modelcontextprotocol/server-github` package are available in your environment.
