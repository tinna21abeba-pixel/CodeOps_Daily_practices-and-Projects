import "server-only";

export function errorResponse(status, code, message, fieldErrors) {
  const error = { code, message };
  if (fieldErrors) error.fieldErrors = fieldErrors;
  return Response.json({ error }, { status });
}

export const notFound = (what = "Resource") =>
  errorResponse(404, "NOT_FOUND", `${what} not found.`);