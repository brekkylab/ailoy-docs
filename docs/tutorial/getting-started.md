import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting started

The very first step to using Ailoy is to define `Runtime`.

<Tabs>
<TabItem value="py" label="Python">
```python
from ailoy import Runtime

# The runtime must be instantiated to use Ailoy
rt = Runtime()

# ... (your code) ...

# Close the runtime
rt.close()
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
import { startRuntime } from "ailoy-node";

// The runtime must be instantiated to use Ailoy
const rt = await startRuntime();

// ... (your code) ...

# Stop the runtime
await rt.stop()
```
</TabItem>
</Tabs>

`Runtime` contains Ailoy’s internal engine. The functionality of Ailoy are usually carried out by internal threads called VM.

The easiest way to use LLM with Ailoy is working with `Agent` class.
The `Agent` class provides high-level APIs that abstracts Ailoy’s runtime, allowing you to use the functionality of LLM effortlessly.
In this example, we’ll use Alibaba's [qwen3](https://github.com/QwenLM/Qwen3) with on-device run.

<Tabs>
<TabItem value="py" label="Python">
```python
from ailoy import Agent

# During this step, the model parameters are downloaded and the LLM is set up for execution
agent = Agent(rt, model_name="qwen3-0.6b")

# ... (your code) ...

# Once the agent is no longer needed, it can be released
agent.delete()
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
import { createAgent } from "ailoy-node";

// During this step, the model parameters are downloaded and the LLM is set up for execution
const agent = await createAgent(rt, {model: {name: "qwen3-0.6b"}})

// ... (your code) ...

// Once the agent is no longer needed, it can be released
await agent.delete()
```
</TabItem>
</Tabs>

This process may take some time, as it involves downloading the model parameters.
Once an Agent is defined, you can run the LLM using the query method.
The output is returned as an iterator that yields the LLM’s response.
This can also be considered a single step in successive generation process.

<Tabs>
<TabItem value="py" label="Python">
```python
# This is where the actual LLM call happens.
for resp in agent.run("Please give me a short poem about AI"):
  print(resp.content, end='')
print()
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
// This is where the actual LLM call happens
for await (const resp of ex.run("Please give me a short poem about AI")) {
  process.stdout.write(`${resp.content}`);
}
process.stdout.write("\n");
```
</TabItem>
</Tabs>

Then, you may see an output similar to this.

```
In the heart of innovation, AI dreams take flight—  
With thoughts that spark and find their way to light.  
It learns and creates, no bound, no strain—  
A world of dreams, where dreams may be found.
```

:::note
Don't be surprised if the output changes each time you run it.
An LLM's output includes a certain level of randomness based on the temperature setting.
:::

All done! You've just activated an LLM. 🎉

Putting it all together, the complete code looks like this:

<Tabs>
<TabItem value="py" label="Python">
```python
from ailoy import AsyncRuntime, Agent

# The runtime must be instantiated to use Ailoy
rt = Runtime()

# An agent is created on runtime
agent = Agent(rt, model_name="qwen3-0.6b")

# Initialize runtime.
# During this step, the model parameters are downloaded and the LLM is set up for execution
agent.initialize()

# This is where the actual LLM call happens
for resp in agent.run("Please give me a short poem about AI"):
  print(resp.content, end='')
print()

# Once the agent is no longer needed, it can be released
agent.delete()

# Stop the runtime
rt.close()
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
import { startRuntime, createAgent } from "ailoy-node";

(async () => {
  // The runtime must be instantiated to use Ailoy
  const rt = await startRuntime();

  // During this step, the model parameters are downloaded and the LLM is set up for execution
  const agent = await createAgent(rt, {model: {name: "qwen3-0.6b"}})

  // This is where the actual LLM call happens
  for await (const resp of ex.run("Please give me a short poem about AI")) {
    process.stdout.write(`${resp.content}`);
  }
  process.stdout.write("\n");

  // Once the agent is no longer needed, it can be released
  await agent.delete()

  // Stop the runtime
  await rt.stop()
})();
```
</TabItem>
</Tabs>
