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
          background: "#0a0a0b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Rilan
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            textAlign: "center",
          }}
        >
          Freelance Web Developer
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 18,
            color: "#2563eb",
          }}
        >
          Modern Websites for Businesses
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
