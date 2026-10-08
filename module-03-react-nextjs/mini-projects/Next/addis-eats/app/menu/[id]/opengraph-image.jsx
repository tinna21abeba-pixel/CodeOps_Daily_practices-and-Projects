import { ImageResponse } from "next/og";
import dishes from "../../data/dishes";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = dishes.find((item) => item.id.toString() === id);

  const name = dish?.name || "Ethiopian Dish";
  const category = dish?.category || "Specialty";
  const price = dish ? `${dish.price} ETB` : "";
  const description = dish?.description || "Authentic Ethiopian dining.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          color: "#ffffff",
          padding: "64px",
          fontFamily: "sans-serif",
          border: "12px solid #f59e0b",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#f59e0b",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Addis Eats
          </div>
          <div
            style={{
              backgroundColor: "#27272a",
              color: "#fbbf24",
              padding: "10px 24px",
              borderRadius: "9999px",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#d4d4d8",
              lineHeight: 1.4,
              maxWidth: "960px",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #27272a",
            paddingTop: "28px",
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#f59e0b",
            }}
          >
            {price}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a1a1aa",
            }}
          >
            Traditional Ethiopian Flavor
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
