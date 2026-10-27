import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.legalName} — Industrial Precision, Crafted Premium`;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0F1115 0%, #171A21 55%, #241F15 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 640,
            height: 640,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(201,162,75,0.30), transparent 65%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#4A5CFF,#1B2BFF,#0F1ED8)",
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: 800,
              borderRadius: 12,
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>GRAFINDO</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", letterSpacing: 4 }}>
              INDUSTRIAL PRECISION, CRAFTED PREMIUM
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
          <span style={{ fontSize: 18, color: "#C9A24B", letterSpacing: 4, textTransform: "uppercase" }}>
            Sticker · Graphic · Emblem · Soft Emblem
          </span>
          <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Manufacturing precision for your brand identity.
          </span>
          <span style={{ fontSize: 24, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
            In-house production in Cikarang · Batch-level QC · 480+ industrial clients
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 24 }}>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.55)" }}>{siteConfig.legalName}</span>
          <span style={{ fontSize: 18, color: "#C9A24B" }}>grafindomitrasemesta.com</span>
        </div>
      </div>
    ),
    size,
  );
}
