import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 19,
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          borderRadius: "8px",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
        }}
      >
        D
      </div>
    ),
    {
      ...size,
    }
  );
}
