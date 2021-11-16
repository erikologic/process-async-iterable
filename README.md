# process-async-iterable

Provide a framework for ETL (Extract Transform Load) operations based on the AsyncIterable protocol.

## Usage
`npm i -S process-async-iterable`
`import {} from 'process-async-iterable`

## How to compose a job

A job comprises different components that linked together will form a processing pipeline.

3 main class of components:

- producers: provide a feed of data into the pipeline
- transformers: receive data from upstream and emits data downstream - can be used to apply any kind of transformation to the data: filtering, mapping, etc
- consumers: pull the pipeline, usually into a destination sink

A pipeline is consumed in pull mode: only when the consumer will request the data, the producer will provide it.  
The type system is leveraged to confirm the consumer can consume the data produced by the producer.

### Job example: running a simple pipeline

```typescript
const run = consume(
    peek(simpleLogger)(
        fromIterable([1, 2, 3])
    )
);
run.catch(console.error);
```

Data flow will be: fromIterable -> simpleLogger -> consume

- Producer -> fromIterable: emits payloads through an AsyncIterable from the provided Iterable e.g. useful to simulate and test the processing pipeline
- Transformer -> peek(simpleLogger): transparent logger - receives a payload, logs it out, pass the incoming payload downstream
- Consumer -> consume: just pulls the pipeline

### More examples

Check [the acceptance tests](test/acceptance) for more use cases and examples.

### Components interface

Components are implemented leveraging the async generator pattern.  
_Node Streams are not type safe and shouldn't be used for processing any Object apart String and Buffer according to the docs.  
Also, they are due to be replaced by the WHATWG (web) Stream interface, although the API in Node is still in early stages._

#### A producer:

```typescript
async function* yourProducer (): AsyncIterable<YourPayload> {
    while (true) {
        // will be processed before the payload has been consumed
        yield yourPayload;
        // will be processed after the payload has been consumed
    }
}
```

`yield` is a particular Javascript construct that will queue the returning of `yourPayload` until a consumer will ask for it.  
Also, any further code execution will be halted until that pull happens.

#### A transformer:

```typescript
async function* yourTransformer(
  iterable: AsyncIterable<YourIncomingPayload>
): AsyncIterable<YourOutgoingPayload> {
  for await (const yourIncomingPayload of iterable) {
    const yourOutgoingPayload = yourTransformationFn(yourIncomingPayload);
    yield yourOutgoingPayload;
  }
}
```

Note: there are no constraints on the number of data incoming and outgoing.
`unfold` is an example of an incoming array being unfolded into its various elements

#### A consumer:

```typescript
async function yourConsumer(iterable: AsyncIterable<YourIncomingPayload>) {
  for await (const yourIncomingPayload of iterable) {
    yourFinalFn(yourIncomingPayload);
  }
}
```
