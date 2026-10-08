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
            Authentic Ethiopian Culinary Delights
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#d4d4d8",
              lineHeight: 1.4,
              maxWidth: "960px",
            }}
          >
            Experience freshly prepared traditional dishes, rich spices, and savory feasts delivered across Addis Ababa.
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
              fontSize: 24,
              color: "#f59e0b",
              fontWeight: 700,
            }}
          >
            Order Fresh Online
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a1a1aa",
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
