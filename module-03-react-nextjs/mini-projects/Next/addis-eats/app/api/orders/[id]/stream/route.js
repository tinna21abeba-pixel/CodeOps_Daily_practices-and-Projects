import { findOrder, toPublicOrder } from "@/app/lib/store";
import { getSession } from "@/app/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session?.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const initial = findOrder(id);
  if (!initial) {
    return new Response("Order not found", { status: 404 });
  }

  if (initial.userId !== session.userId && session.user?.role !== "staff") {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();
  let timer;

  const stream = new ReadableStream({
    start(controller) {
      function sendUpdate() {
        try {
          const order = findOrder(id);
          if (!order) {
            controller.close();
            return true;
          }
          const data = toPublicOrder(order);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          if (order.status === "delivered" || order.status === "cancelled") {
            controller.close();
            return true;
          }
          return false;
        } catch {
          return true;
        }
      }

      if (sendUpdate()) return;

      timer = setInterval(() => {
        const finished = sendUpdate();
        if (finished) clearInterval(timer);
      }, 3000);

      request.signal.addEventListener("abort", () => {
        clearInterval(timer);
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
