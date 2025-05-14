# Reasoning

Reasoning is a functionality of AI that can handle more complex tasks through explicit logical reasoning. It breaks down problems into smaller sub-steps and reveals intermediate reasoning stages.

Using a reasoning AI is well-suited for handling complex tasks such as scientific reasoning or legal interpretation. However, since the reasoning process requires more computation and memory, you should decide whether to enable the reasoning option based on requirements.

In Ailoy, you can easily enable a reasoning model with a simple option. If you'd like to use reasoning, you can activate it as shown below:

```python
# This is where the actual LLM call happens
async for resp in agent.run(
  "Please solve me a simultaneous equation: x+y=3, 4x+3y=12",
  do_reasoning=True
):
  print(resp.content, end='')
print()
```

Since reasoning is an internal process, you may not want to include it in the output. In such cases, you can use the `ignore_reasoning` option to exclude it from the output.

```python
# This is where the actual LLM call happens
async for resp in agent.run(
  "Please solve me a simultaneous equation: x+y=3, 4x+3y=12",
  reasoning=True,
  ignore_reasoning=True
):
  print(resp.content, end='')
print()
```
