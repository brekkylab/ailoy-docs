import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ToolStructureSvg from './img/tool-structure.svg';

# Using Tools

One of the most powerful features in Ailoy is the tool calling system.
It allows you to extend the capabilities of your LLM by connecting it to external tools or APIs.
This way, the agent can access real-time or domain-specific information, even if it wasn’t part of the model’s training data.
For example, you can attach weather or location services to your agent.
You could also build a financial decision-making app using real-time exchange rates or stock prices.
Moreover, the agent can execute financial decisions itself with LLM, enabling powerful automation.

## How tool calling works

Let's take a quick look at how tool calling works in general. In most agent system, tool calling can be achieved by the following process.

<ToolStructureSvg style={{ width: "40%", height: "40%" }}/>

(1) \[Tool Description\] Assistant (or LLM) can recognize a tool based on its description (at it’s initialization).

(2) User provides an input prompt to the assistant.

(3) \[Tool Call\] If the user's question is related to a tool, the assistant can invoke the tool using the specified format.

(4) \[Tool Result\] Tool performs its task and returns a response.

(5) Assistant can incorporate the tool's output to produce a more accurate answer.

## Building an Agent with Tool Support

Now, let's see how to make an agent tool-aware in Ailoy.
In this example, we’ll use the [Frankfurter API](https://frankfurter.dev/) to add real-time exchange rate lookup functionality.

The first step is to define a tool.

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
const rt = await startRuntime();
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
agent.addToolsFromPreset("frankfurter");
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

The output looks like this:
```
id='call_fe4b76ff-021c-409b-a835-df83b425f35e' type='function' function=ToolCallFunction(name='frankfurter', arguments={'symbols': 'USD,CNY', 'base': 'KRW'})role='tool' name='frankfurter' tool_call_id='call_fe4b76ff-021c-409b-a835-df83b425f35e' content='{"CNY": 0.00516, "USD": 0.00072}'To buy 250 U.S. Dollars (USD) and 350 Chinese Yuan (CNY) using Korean Won (KRW), you need to calculate the total amount of KRW required based on the exchange rates:

- **1 USD = 0.00072 KRW**
- **1 CNY = 0.00516 KRW**

### Step 1: Calculate KRW for USD
$$ 250 \, \text{USD} \times \frac{1}{0.00072} = 250 \, \text{USD} \times 1388.89 \approx 347,222 \, \text{KRW} $$

### Step 2: Calculate KRW for CNY
$$ 350 \, \text{CNY} \times \frac{1}{0.00516} = 350 \, \text{CNY} \times 193.88 \approx 67,858 \, \text{KRW} $$

### Step 3: Add both amounts
$$ 347,222 \, \text{KRW} + 67,858 \, \text{KRW} = 415,080 \, \text{KRW} $$

### Final Answer:
You need approximately **415,080 Korean Won** to buy 250 USD and 350 CNY.
```

## Full source code

<Tabs>
<TabItem value="py" label="Python">
```python
from ailoy import Runtime, Agent

rt = Runtime()

agent = Agent(rt, model_name="qwen3-8b")
agent.initialize()

# Attach frankfurter's API
agent.add_tools_from_preset("frankfurter")

question = "I want to buy 250 U.S. Dollar and 350 Chinese Yuan with my Korean Won. How much do I need to take?"
for resp in agent.run(question):
    print(resp.content, end="")
print()

agent.delete()

rt.close()
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
import { startRuntime, createAgent } from "ailoy";

(async () => {
  const rt = await startRuntime();

  const agent = await createAgent(rt, { model: { name: "qwen3-8b" } });

  // Attach frankfurter's API
  agent.addToolsFromPreset("frankfurter");

  const question =
    "I want to buy 250 U.S. Dollar and 350 Chinese Yuan with my Korean Won. How much do I need to take?";
  for await (const resp of agent.run(question)) {
    process.stdout.write(`${resp.content}`);
  }
  process.stdout.write("\n");

  await agent.delete();

  await rt.stop();
})();
```
</TabItem>
</Tabs>

:::warning
Tools aren't free — every token counts.

Calling external APIs or running local AI models consumes real resources.
If you're using an API, you might encounter unexpectedly high bills.
If you're using on-device AI, your system can slow down or even crash.

Avoid sending unnecessary data. Keep your chat context focused and concise.
:::