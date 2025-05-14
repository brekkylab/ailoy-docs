# Tools

In Ailoy, a **tool** allows an agent to access functionality beyond what the base language model can offer, such as real-time data or domain-specific APIs. Each tool is defined using two components:

### Description

The `description` field defines how the AI understands and uses the tool. It follows the standard described in [Transformer's tool definitions](https://huggingface.co/docs/transformers/v4.51.3/en/chat_templating_writing#tool-definitions), including details such as the tool's name, purpose, input parameters, and example usage. This helps the LLM decide *when* and *how* to use the tool.

### Behavior

The `behavior` field defines how the tool actually behaves when invoked. This varies depending on the tool type. For example, a REST API tool includes the endpoint URL, HTTP method, and headers. A native tool may define a Python function, while a universal tool delegates the behavior to a pre-defined module.

## Tool types

There are three types of tools in Ailoy. While they all share a common `description` format, each type defines `behavior` differently.

### Built-in tools

Built-in tools uses the function of Ailoy’s internal module system. It work across all environments. These tools are pre-registered and can be referenced by name.

**Behavior**: Defined by preset behavior implemented inside Ailoy.

### Native tools

Native tools allow developers to define custom Python functions that will be executed when the AI requests a tool call. This is useful for logic that lives inside your application.

**Behavior**: A Python function or coroutine that will be called with arguments from the AI.

### RESTAPI tools

RESTAPI tools allow the AI to access external APIs over HTTP. This is ideal for retrieving real-time or third-party information.

**Behavior**: TODO

## Available tools

### Calculator

### Frankfurters

### TMDB

### Nytimes
