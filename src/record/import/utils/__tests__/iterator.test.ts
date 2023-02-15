import {
  chunked,
  groupByKey,
  groupByKeyChunked,
  iterToAsyncIer,
  withIndex,
  withNext,
} from "../iterator";
import { Readable } from "stream";

const arrayToAsyncIter = <T = unknown>(arr: T[]): AsyncIterableIterator<T> =>
  iterToAsyncIer(arr[Symbol.iterator]());

describe("chunked", () => {
  it("can separate data source by chunk", async () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
    const actual = [];
    for await (const chunk of chunked(arrayToAsyncIter(source), 3)) {
      actual.push(chunk);
    }
    expect(actual).toStrictEqual(expected);
  });
});

describe("groupByKey", () => {
  it("can separate date source by group", async () => {
    const source = [
      { name: "banana", type: "fruit" },
      { name: "orange", type: "fruit" },
      { name: "tomato", type: "vegetables" },
      { name: "carrot", type: "vegetables" },
      { name: "asparagus", type: "vegetables" },
      { name: "beef", type: "meat" },
      { name: "cherries", type: "fruit" },
      { name: "pork", type: "meat" },
      { name: "chicken", type: "meat" },
    ];
    const expected = [
      {
        key: "fruit",
        data: [
          { name: "banana", type: "fruit" },
          { name: "orange", type: "fruit" },
        ],
      },
      {
        key: "vegetables",
        data: [
          { name: "tomato", type: "vegetables" },
          { name: "carrot", type: "vegetables" },
          { name: "asparagus", type: "vegetables" },
        ],
      },
      {
        key: "meat",
        data: [{ name: "beef", type: "meat" }],
      },
      {
        key: "fruit",
        data: [{ name: "cherries", type: "fruit" }],
      },
      {
        key: "meat",
        data: [
          { name: "pork", type: "meat" },
          { name: "chicken", type: "meat" },
        ],
      },
    ];
    const actual = [];
    for await (const chunk of groupByKey(
      arrayToAsyncIter(source),
      (el) => el.type
    )) {
      actual.push(chunk);
    }
    expect(actual).toStrictEqual(expected);
  });
});

describe("groupByKeyChunked", () => {
  it("can separate date source by group and chunked", async () => {
    const chunkSize = 2;
    const source = [
      { name: "banana", type: "fruit" },
      { name: "orange", type: "fruit" },
      { name: "tomato", type: "vegetables" },
      { name: "carrot", type: "vegetables" },
      { name: "asparagus", type: "vegetables" },
      { name: "beef", type: "meat" },
      { name: "cherries", type: "fruit" },
      { name: "pork", type: "meat" },
      { name: "chicken", type: "meat" },
    ];
    const expected = [
      {
        key: "fruit",
        data: [
          { name: "banana", type: "fruit" },
          { name: "orange", type: "fruit" },
        ],
      },
      {
        key: "vegetables",
        data: [
          { name: "tomato", type: "vegetables" },
          { name: "carrot", type: "vegetables" },
        ],
      },
      {
        key: "vegetables",
        data: [{ name: "asparagus", type: "vegetables" }],
      },
      {
        key: "meat",
        data: [{ name: "beef", type: "meat" }],
      },
      {
        key: "fruit",
        data: [{ name: "cherries", type: "fruit" }],
      },
      {
        key: "meat",
        data: [
          { name: "pork", type: "meat" },
          { name: "chicken", type: "meat" },
        ],
      },
    ];
    const actual = [];
    for await (const chunk of groupByKeyChunked(
      arrayToAsyncIter(source),
      (el) => el.type,
      chunkSize
    )) {
      actual.push(chunk);
    }
    expect(actual).toStrictEqual(expected);
  });
});

describe("withNextIterator", () => {
  it("can iterate from data source with next value", async () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [
      { current: 1, next: 2 },
      { current: 2, next: 3 },
      { current: 3, next: 4 },
      { current: 4, next: 5 },
      { current: 5, next: 6 },
      { current: 6, next: 7 },
      { current: 7, next: 8 },
      { current: 8, next: 9 },
      { current: 9, next: 10 },
      { current: 10, next: undefined },
    ];
    const actual = [];
    for await (const data of withNext(arrayToAsyncIter(source))) {
      actual.push(data);
    }
    expect(actual).toStrictEqual(expected);
  });
});

describe("withIndexIterator", () => {
  it("can iterate from data source with index", async () => {
    const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [
      { data: 1, index: 0 },
      { data: 2, index: 1 },
      { data: 3, index: 2 },
      { data: 4, index: 3 },
      { data: 5, index: 4 },
      { data: 6, index: 5 },
      { data: 7, index: 6 },
      { data: 8, index: 7 },
      { data: 9, index: 8 },
      { data: 10, index: 9 },
    ];
    const actual = [];
    for await (const data of withIndex(arrayToAsyncIter(source))) {
      actual.push(data);
    }
    expect(actual).toStrictEqual(expected);
  });
});
