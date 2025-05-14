import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# RAG with Vector Store

**Retrieval-Augmented Generation (RAG)** is a powerful method that enhances language models with external knowledge. Instead of relying solely on the model’s internal training data, RAG retrieves relevant documents from a knowledge base—typically a vector store—and injects them into the prompt at inference time. This allows the model to generate more accurate, up-to-date, and context-aware responses.

RAG is particularly useful when:

* The knowledge base is too large to fit within the model’s context window.
* Real-time or domain-specific information is needed.
* You want to combine static model knowledge with dynamic data sources.

### Initializing a Vector Store

Ailoy simplifies the construction of RAG pipelines through its built-in `VectorStore` component, which works alongside the `Agent`.

To initialize a vector store:

<Tabs>
<TabItem value="py" label="Python">
```python
from ailoy import Runtime
from ailoy.vectorstore import VectorStore, FAISSConfig

rt = Runtime()
with VectorStore(rt, FAISSConfig(embedding="bge-m3")) as vs:
    ...
```
</TabItem>
<TabItem value="node" label="JavaScript(Node)">
```typescript
import { createRuntime, VectorStore } from "ailoy-node";

const rt = await createRuntime();
const vs = new VectorStore(rt, {
  type: "faiss",
  embedding: "bge-m3",
});
await vs.initialize();
```
</TabItem>
</Tabs>

> Ailoy currently supports both **FAISS** and **ChromaDB** as vector store backends.
> Refer to the official configuration guide for backend-specific options.

> 💡 **Note:** At this time, the only supported embedding model is `"bge-m3"`.
> Additional embedding models will be supported in future releases.

### Inserting Documents into the Vector Store

You can insert text along with optional metadata into the vector store:

```python
vs.insert(
    "Ailoy is a lightweight library for building AI applications", 
    metadata={"topic": "Ailoy"}
)
```

In practice, you should split large documents into smaller chunks before inserting them. This improves retrieval quality. You may use any text-splitting tool (e.g., [LangChain](https://python.langchain.com/docs/concepts/text_splitters/)), or utilize Ailoy’s low-level runtime API for text splitting. (See [Calling Low-Level APIs](./calling-low-level-apis.md) for more details.)

### Retrieving Relevant Documents

To retrieve documents similar to a given query:

```python
query = "What is Ailoy?"
items = vs.retrieve(query, top_k=5)
```

This returns a list of `VectorStoreRetrieveItem` instances representing the most relevant chunks, ranked by similarity. The number of results is controlled via the `top_k` parameter (default is 5).

### Constructing an Augmented Prompt

Once documents are retrieved, you can construct a context-enriched prompt as follows:

```python
prompt = f"""
    Based on the provided contexts, try to answer user's question.
    Context: {items}
    Question: {query}
"""
```

You can then pass this prompt to the agent for inference:

```python
for resp in agent.run(prompt):
    print(resp.content, end='')
print()
```

### Complete Example

```python
from ailoy import Runtime
from ailoy.vectorstore import VectorStore, FAISSConfig

rt = Runtime()
with Agent(rt, model_name="qwen3-8b") as agent, VectorStore(rt, FAISSConfig(embedding="bge-m3")) as vs:
    # Insert items
    vs.insert(
        "Ailoy is a lightweight library for building AI applications", 
        metadata={"topic": "Ailoy"}
    )

    # Search the most similar items
    query = "What is Ailoy?"
    items = vs.retrieve(query)

    # Augment user query
    prompt = f"""
        Based on the provided contexts, try to answer user's question.
        Context: {items}
        Question: {query}
    """

    # Invoke agent
    for resp in agent.run(prompt):
        print(resp.content, end='')
    print()
```

> **Tip:** For best results, ensure your documents are chunked semantically (e.g., by paragraphs or sections).
