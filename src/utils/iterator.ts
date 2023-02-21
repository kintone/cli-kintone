type Iterators<T> = IterableIterator<T> | Generator<T>;
type AsyncIterators<T> = AsyncIterableIterator<T> | AsyncGenerator<T>;

// eslint-disable-next-line func-style
export async function* iterToAsyncIter<T>(
  source: Iterators<T>
): AsyncIterators<T> {
  for (const element of source) {
    yield element;
  }
}

// eslint-disable-next-line func-style
export async function* chunked<T>(
  source: AsyncIterators<T>,
  size: number
): AsyncGenerator<T[]> {
  let chunk = [];
  for await (const element of source) {
    chunk.push(element);
    if (chunk.length >= size) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length > 0) {
    yield chunk;
  }
}

// eslint-disable-next-line func-style
export async function* groupByKey<T, K>(
  source: AsyncIterableIterator<T> | AsyncGenerator<T>,
  keyFn: (element: T) => K
): AsyncGenerator<{ key: K; data: T[] }, void, undefined> {
  let array = [];
  for await (const { current, next } of withNext(source)) {
    array.push(current);
    const currentKey = keyFn(current);
    if (next === undefined || currentKey !== keyFn(next)) {
      yield { key: currentKey, data: array };
      array = [];
    }
  }
}

// eslint-disable-next-line func-style
export async function* groupByKeyChunked<T, K>(
  source: AsyncIterators<T>,
  keyFn: (element: T) => K,
  size: number
): AsyncGenerator<{ key: K; data: T[] }, void, undefined> {
  for await (const { key, data } of groupByKey(source, keyFn)) {
    for await (const chunk of chunked(
      iterToAsyncIter(data[Symbol.iterator]()),
      size
    )) {
      yield { key, data: chunk };
    }
  }
}

// eslint-disable-next-line func-style
export async function* withNext<T>(
  source: AsyncIterators<T>
): AsyncGenerator<{ current: T; next?: T }> {
  let { value: prev, done } = await source.next();
  if (done) {
    return;
  }
  for await (const value of source) {
    yield { current: prev, next: value };
    prev = value;
  }
  yield { current: prev, next: undefined };
}

// eslint-disable-next-line func-style
export async function* withIndex<T>(
  source: AsyncIterators<T>
): AsyncGenerator<{ data: T; index: number }> {
  let index = 0;
  for await (const value of source) {
    yield { data: value, index };
    index++;
  }
}
