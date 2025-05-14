import AiloyInternalSvg from './img/ailoy-internal.svg';

# Calling low-level APIs

As mentioned before, `Agent` is just a wrapper of `Runtime`. In a nutshell, internal engine called `VM` takes the role of handling compute-intensive tasks like LLM inference. `Runtime` itself can be considered as a middleman between `VM` and the user. It delegates user’s requests to the `VM`, and vice-versa.

 <AiloyInternalSvg style={{ width: "50%", height: "50%" }}/>

Using the runtime directly, you can send requests to the VM yourself. This is useful when you need more sophisticate configuration, or calling the APIs that are not covered in high-level API.

Let’s take a look at how the lower-level API works. We’ll use `split_text` operator for text transformation. The `split_text` operator transforms a long document into a set of smaller chunks. This operation is essential for Retrieval-Augmented Generation (RAG).

We’ll use Lev Tolstoy's [What Men Live by](https://www.gutenberg.org/files/6157/6157-h/6157-h.htm) as a reference text.

```python
from ailoy import AsyncRuntime, Agent

rt = AsyncRuntime()

with open("what_men_live_by.txt") as f:
  text = f.read()

result = rt.call("split_text", {"text": text})
chunks = result["chunks"]

# 12 chunks
print(len(chunks))

# Print first chunk
print(chunks[0])

rt.close()
```

TODO(console output)

TODO See low-level API reference for details.
