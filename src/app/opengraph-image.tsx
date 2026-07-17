import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #111111 0%, #1a1030 55%, #2c1a4d 100%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: 4, color: "#bea7ff", textTransform: "uppercase" }}>
          Saathvik Visuals
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 68, fontWeight: 800, textAlign: "center", maxWidth: 980 }}>
          Trusted UI/UX &amp; Product Designer
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "#d8cdf5", maxWidth: 860, textAlign: "center" }}>
          Cinematic product concepts, client websites, and full-stack SaaS builds
        </div>
      </div>
    ),
    { ...size }
  );
}
