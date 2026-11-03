import { ImageResponse } from "next/og";

export const alt = "David Ishaku — Product designer and frontend engineer";
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
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "system-ui, sans-serif",
          color: "#171717",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#98988f",
          }}
        >
          David Ishaku
        </div>

        <div
          style={{
            fontSize: 60,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            maxWidth: 900,
          }}
        >
          I design and build digital experiences shaped by curiosity.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#6f6f69",
          }}
        >
          <span>Product design · Frontend engineering</span>
          <span>davidishaku560@gmail.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
