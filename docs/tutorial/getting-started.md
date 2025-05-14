import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting started

The first step in using Ailoy is to define the `Runtime`.

<Tabs>
<TabItem value="py" label="Python">
```python
from ailoy import AsyncRuntime

# The runtime must be instantiated to use Ailoy
rt = AsyncRuntime()

# ... (your code) ...

# Close the runtime
rt.close()
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
import { createRuntime } from "ailoy-node";

# The runtime must be instantiated to use Ailoy
const rt = await createRuntime();

# ... (your code) ...

# Close the runtime
await rt.close()
```
</TabItem>
</Tabs>

`Runtime` contains Ailoy’s internal engine. The functionality of Ailoy are usually carried out by internal threads called VM.

The easiest way to use LLM with Ailoy is working with `Agent` class. The `Agent` class provides high-level APIs that abstracts Ailoy’s runtime, allowing you to use the functionality of LLM effortlessly. In this example, we’ll use `qwen3` with on-device run.

```python
from ailoy import Agent

agent = Agent(rt, model_name="qwen3-0.6b")

# Initialize runtime.
# During this step, model parameters are downloaded and the LLM is set up for execution
await agent.initialize()

# ... (your code) ...

# Once the agent is no longer needed, it can be released
await agent.deinitialize()
```

Once an `Agent` has been defined, LLM can be run with the `query`. It is defined as an (async) iterator, each output  consists of LLM’s answer. This can be considered as a single step of generation.

```python
# This is where the actual LLM call happens.
async for resp in agent.run("Please give me a short poem about AI"):
  print(resp.content, end='')
print()
```

TODO Output format description

Putting it all together, the complete code looks like this:

```python
from ailoy import AsyncRuntime, Agent

# The runtime must be instantiated to use Ailoy
rt = AsyncRuntime()

# An agent is created on runtime
agent = Agent(rt, model_name="qwen3-0.6b")

# Initialize runtime.
# During this step, model parameters are downloaded and the LLM is set up for execution
await agent.initialize()

# This is where the actual LLM call happens
async for resp in agent.run("Please give me a short poem about AI"):
  print(resp.content, end='')
print()

# Once the agent is no longer needed, it can be released
await agent.deinitialize()

# Close the runtime
rt.close()
```
