import type { Event } from "@/types";
import Icon from "@/components/ui/Icon";
import { googleCalendarUrl } from "@/lib/events/calendar";

/**
 * Two options cover nearly everyone: Google Calendar opens pre-filled in the
 * browser; the .ics file opens straight into Apple Calendar on iPhone/Mac and
 * into Outlook on Windows (including Aston's university Outlook).
 */
export default function AddToCalendar({ event }: { event: Event }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
      <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold">
        <Icon name="calendar" size={18} />
        Google Calendar
      </a>
      <a href={`/events/${event.id}/calendar.ics`} className="btn btn-outline-gold" download>
        <Icon name="calendar" size={18} />
        Apple / Outlook
      </a>
    </div>
  );
}
