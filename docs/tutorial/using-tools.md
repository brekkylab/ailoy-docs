import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ToolStructureSvg from './img/tool-structure.svg';

# Using Tools

One of the most powerful features in Ailoy is the **tool calling system**.
It allows you to extend the capabilities of your LLM by connecting it to external APIs or tools.
This way, your agent can access real-time or domain-specific information, even if it wasn’t part of the model’s original training data.
You can attach an agent for a custom service you’ve built, like whether or location.
You could also build financial decision-making app with real-time exchange rate or stock price.

## How tool calling works

Let's take a quick look at how tool calling works in general. In most agent system, tool calling can be achieved by the following process.

<ToolStructureSvg style={{ width: "40%", height: "40%" }}/>

(1) \[Tool Description\] Assistant (or LLM) can recognize a tool based on its description (at it’s initialization).

(2) User provides an input prompt to the assistant.

(3) \[Tool Call\] If the user's question is related to a tool, the assistant can invoke the tool using the specified format.

(4) \[Tool Result\] Tool performs its task and returns a response.

(5) Assistant can incorporate the tool's output to produce a more accurate answer.

## Using tool calls in Ailoy

Now let me explain how to use tool calling in Ailoy. In this example, we’ll use the [Frankfurters API](https://frankfurter.dev/) to add real-time exchange rate lookup functionality.

First step is defining a tool.

<Tabs>
<TabItem value="py" label="Python">
```python
rt = Runtime()
agent = Agent(rt, model_name="qwen3-8b")
agent.initialize()

frankfurters = {
  "type": "restapi",
  "description": {
    "name": "frankfurter",
    "description": "Get the latest currency exchange rates of target currencies based on the 'base' currency",
    "parameters": {
        "type": "object",
        "properties": {
            "base": {
                "type": "string",
                "description": "The ISO 4217 currency code to be the divider of the currency rate to be got."
            },
            "symbols": {
                "type": "string",
                "description": "The target ISO 4217 currency codes separated by comma."
            }
        },
    }
  },
  "behavior": {
    "baseURL": "https://api.frankfurter.dev/v1/latest",
    "method": "GET",
    "headers": {
      "accept": "application/json"
    }
  },
}
agent.add_restapi_tool(frankfurters)
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
const rt = await createRuntime();
const agent = await createAgent(rt, {model: {name: "qwen3-8b"}});

const frankfurters = {
  type: "restapi",
  description: {
    name: "frankfurter",
    description: "Get the latest currency exchange rates of target currencies based on the 'base' currency",
    parameters: {
        type: "object",
        properties: {
            base: {
                type: "string",
                description: "The ISO 4217 currency code to be the divider of the currency rate to be got."
            },
            symbols: {
                type: "string",
                description: "The target ISO 4217 currency codes separated by comma."
            }
        }
    }
  },
  behavior: {
    baseURL: "https://api.frankfurter.dev/v1/latest",
    method: "GET",
    headers: {
      accept: "application/json"
    }
  },
};
agent.add_restapi_tool(frankfurters);
```
</TabItem>
</Tabs>

The `description` defines how the AI recognizes and understands the tool.
In contrast, the `behavior` field specifies what should happen when the AI attempts to execute the tool.
Naturally, the format of the `behavior` depends on its type.
In this example, since we are using a REST API tool, the behavior includes the API’s URL, HTTP method, and headers.

:::info
For more details about tool definitions, see the [Tools](../tools) section.
:::

For the ease of implementation, Ailoy provides presets for several commonly used tools, including the Frankfurters API.

If you find a proper tool from preset, you can simply imports it into the agent:

<Tabs>
<TabItem value="py" label="Python">
```python
agent.add_tools_from_preset("frankfurter")
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
agent.add_tools_from_preset("frankfurter");
```
</TabItem>
</Tabs>

By calling `run` function, you can see that the agent uses the Frankfurters API to incorporate real-time exchange rate information into its response.

<Tabs>
<TabItem value="py" label="Python">
```python
question = "I want to buy 250 U.S. Dollar and 350 Chinese Yuan with my Korean Won. How much do I need to take?"
async for resp in agent.run(question):
    print(resp.content, end='')
print()
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
const question = "I want to buy 250 U.S. Dollar and 350 Chinese Yuan with my Korean Won. How much do I need to take?";
for await (const resp in agent.run(question)) {
    process.stdout.write(resp.content);
}
process.stdout.write("\n");
```
</TabItem>
</Tabs>

(TODO) console output

## Full source code

```python
from ailoy import AsyncRuntime, Agent

rt = AsyncRuntime()

agent = Agent(rt, model_name="qwen3-8b")

await agent.initialize()

# Attach frankfurter's API
agent.add_tools_from_preset("frankfurter")

question = "I want to buy 250 U.S. Dollar and 350 Chinese Yuan with my Korean Won. How much do I need to take?"
async for resp in agent.run(question):
    print(resp.content, end='')
print()

await agent.deinitialize()

rt.close()
```

:::note
Tools aren't free — every token counts.

Calling external APIs or running local AI models consumes real resources.
If you're using an API, you might encounter unexpectedly high bills.
If you're using on-device AI, your system can slow down or even crash.

Avoid sending unnecessary data. Keep your chat context focused and concise.
:::