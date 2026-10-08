import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1c1917",
          color: "#ffffff",
          padding: "64px",
          fontFamily: "sans-serif",
          border: "12px solid #ea580c",
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
              color: "#ea580c",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Habesha Restaurant
          </div>
          <div
            style={{
              backgroundColor: "#292524",
              color: "#fdba74",
              padding: "10px 24px",
              borderRadius: "9999px",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Ethiopian Cuisine
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
              fontSize: 60,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Authentic Ethiopian Cuisine
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#d6d3d1",
              lineHeight: 1.4,
              maxWidth: "960px",
            }}
          >
            Experience authentic Ethiopian dishes, savory stews, and traditional dining crafted with fresh ingredients and spices.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #292524",
            paddingTop: "28px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#ea580c",
              fontWeight: 700,
            }}
          >
            Order Fresh Online
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a8a29e",
            }}
          >
            Traditional Hospitality
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
