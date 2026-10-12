import type { CapturedRequest } from "./httpTestServer";

export type MultipartPart = {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
};

/**
 * Minimal multipart/form-data parser for assertions -- not a general-purpose
 * decoder. The boundary is random per request (form-data generates it), so
 * tests must extract fields from the parsed parts rather than snapshotting
 * the raw body.
 */
export const parseMultipartFormData = (
  req: CapturedRequest,
): MultipartPart[] => {
  const contentType = req.headers["content-type"] ?? "";
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/.exec(contentType);
  if (!boundaryMatch) {
    throw new Error(`Content-Type has no multipart boundary: ${contentType}`);
  }
  const boundaryMarker = Buffer.from(
    `--${boundaryMatch[1] ?? boundaryMatch[2]}`,
  );
  const buffer = req.rawBodyBuffer;

  const parts: MultipartPart[] = [];
  let boundaryStart = buffer.indexOf(boundaryMarker);
  while (boundaryStart !== -1) {
    const partStart = boundaryStart + boundaryMarker.length;
    const nextBoundaryStart = buffer.indexOf(boundaryMarker, partStart);
    if (nextBoundaryStart === -1) {
      break;
    }

    // The segment between this boundary and the next is "\r\n<headers>\r\n\r\n<body>\r\n".
    let segment = buffer.subarray(partStart, nextBoundaryStart);
    if (segment.subarray(0, 2).toString("ascii") === "\r\n") {
      segment = segment.subarray(2);
    }
    if (segment.subarray(-2).toString("ascii") === "\r\n") {
      segment = segment.subarray(0, -2);
    }

    const headerEnd = segment.indexOf("\r\n\r\n");
    if (headerEnd !== -1) {
      const headerText = segment.subarray(0, headerEnd).toString("utf-8");
      const data = segment.subarray(headerEnd + 4);
      const dispositionMatch = /name="([^"]*)"(?:;\s*filename="([^"]*)")?/.exec(
        headerText,
      );
      const contentTypeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerText);
      parts.push({
        name: dispositionMatch?.[1] ?? "",
        filename: dispositionMatch?.[2],
        contentType: contentTypeMatch?.[1],
        data,
      });
    }

    boundaryStart = nextBoundaryStart;
  }
  return parts;
};
