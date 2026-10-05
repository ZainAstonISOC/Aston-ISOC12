import { ImageResponse } from "next/og";
import { getEventById, CATEGORY_LABELS } from "@/lib/events";
import { formatEventDate } from "@/lib/events/time";
import { OG_COLORS, OG_SIZE, loadOgAssets, ogFooterHost } from "@/lib/og";

/**
 * Each event gets its own share card, so a link dropped into a WhatsApp group
 * shows the event's title, date and place rather than the generic site card.
 * Rendered on demand and refreshed whenever the event is edited in /admin.
 */

export const alt = "Aston ISOC event";
export const size = OG_SIZE;
export const contentType = "image/png";

const { bg, bg3, gold, goldSoft, text, muted } = OG_COLORS;

/** Long titles step down in size rather than overflowing the card. */
function titleSize(title: string): number {
  if (title.length > 64) return 54;
  if (title.length > 40) return 66;
  return 80;
}

export default async function EventImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, { markSrc, fonts }] = await Promise.all([getEventById(id), loadOgAssets()]);

  const title = event?.title ?? "Aston ISOC Events";
  const eyebrow = event ? CATEGORY_LABELS[event.category] : "What's on";
  const when = event
    ? event.isRecurring
      ? `${event.recurringNote ?? "Weekly"} · ${event.time}`
      : `${formatEventDate(event.date)} · ${event.time}${event.endTime ? `–${event.endTime}` : ""}`
    : "Events, circles and community";
  const where = event?.location ?? "Aston University, Birmingham";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `linear-gradient(150deg, ${bg3} 0%, ${bg} 62%)`,
          fontFamily: "DM Sans",
          color: text,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -140,
            top: -80,
            width: 640,
            height: 640,
            borderRadius: 640,
            background: "radial-gradient(circle, rgba(216,175,114,0.20) 0%, rgba(216,175,114,0) 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            bottom: 28,
            left: 28,
            borderRadius: 26,
            border: "1px solid rgba(216,175,114,0.28)",
          }}
        />

        <div style={{ display: "flex", flex: 1, padding: "84px 96px 120px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
              <div style={{ width: 44, height: 2, background: gold }} />
              <div style={{ fontSize: 22, letterSpacing: 6, color: gold, textTransform: "uppercase" }}>{eyebrow}</div>
            </div>

            <div
              style={{
                fontFamily: "Playfair Display",
                fontSize: titleSize(title),
                lineHeight: 1.08,
                color: "#fff",
                maxWidth: 720,
              }}
            >
              {title}
            </div>

            <div style={{ display: "flex", fontSize: 30, color: goldSoft, marginTop: 34 }}>{when}</div>
            <div style={{ display: "flex", fontSize: 26, color: muted, marginTop: 10, maxWidth: 720 }}>{where}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 240, height: 240 }}>
            <img src={markSrc} width={240} height={240} alt="" />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            bottom: 66,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: muted,
          }}
        >
          <span>{ogFooterHost() ?? "Aston ISOC"}</span>
          <span style={{ color: goldSoft }}>@astonisoc</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
