import Icon from "@/components/ui/Icon";
import CopyLinkButton from "./CopyLinkButton";
import { feedHttpsUrl, feedWebcalUrl, googleSubscribeUrl } from "@/lib/events/calendar";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

/**
 * Subscribing (rather than adding events one by one) means new events,
 * changed times and cancellations appear in the student's own calendar
 * automatically.
 */
export default function SubscribeCalendar() {
  return (
    <div
      className="subscribe-band"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
        gap: "clamp(1.5rem, 4vw, 3rem)",
        alignItems: "center",
        padding: "clamp(1.75rem, 4vw, 2.5rem)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        background: "linear-gradient(150deg, rgba(216,175,114,0.07), rgba(19,13,40,0.45))",
      }}
    >
      <div>
        <p className="eyebrow">Never miss one</p>
        <h2 style={{ fontFamily: PF, color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "0.6rem" }}>
          Put every ISOC event in your calendar
        </h2>
        <p style={{ fontFamily: DM, fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: "46ch" }}>
          Subscribe once and new events, time changes and cancellations show up on your phone
          automatically — including Jumu&apos;ah every Friday.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <a href={googleSubscribeUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
          <Icon name="calendar" size={18} />
          Subscribe in Google Calendar
        </a>
        <a href={feedWebcalUrl()} className="btn btn-outline-gold">
          <Icon name="calendar" size={18} />
          Subscribe in Apple Calendar
        </a>
        <CopyLinkButton url={feedHttpsUrl()} label="Copy link for Outlook" />
        <p style={{ fontFamily: DM, fontSize: "0.76rem", color: "var(--muted-2)", lineHeight: 1.6 }}>
          Outlook: Add calendar → Subscribe from web → paste the link.
        </p>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .subscribe-band { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
