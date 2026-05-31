"use client";

import * as React from "react";
import { FormField } from "@/components/forms/form-field/FormField";
import { Button } from "@/components/actions/button/Button";
import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import s from "./hub.module.css";

const sessionTypes = ["Intro call (15m)", "Portfolio walkthrough (30m)", "Project chat (45m)"];

/**
 * Panel 05 — Booking. Visible labels; until a scheduler is wired this opens
 * a prefilled `mailto:` to erbonilla@outlook.com (hub §4, B3).
 */
export function BookingPanel() {
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [type, setType] = React.useState(sessionTypes[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Session request: ${type}`);
    const body = encodeURIComponent(
      `Hi Edgar,\n\nI'd like to book a "${type}".\nPreferred date: ${date || "(flexible)"}\nPreferred time: ${time || "(flexible)"}\n\nThanks!`,
    );
    window.location.href = `mailto:${aboutCopy.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section className={s.panel} aria-labelledby="hub-booking-title">
      <div className={s.panelHead}>
        <h3 id="hub-booking-title" className={cn(s.panelTitle, "ts-title-sm")}>
          05 · Request a session
        </h3>
        <p className={cn(s.panelHelp, "ts-body-sm")}>
          Send preferred details and I&rsquo;ll confirm by email.
        </p>
      </div>

      <form className={s.bookingForm} onSubmit={handleSubmit}>
        <FormField label="Session type">
          {({ id }) => (
            <select
              id={id}
              className="field-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {sessionTypes.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          )}
        </FormField>

        <FormField label="Preferred date">
          {({ id }) => (
            <input
              id={id}
              type="date"
              className="field-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          )}
        </FormField>

        <FormField label="Preferred time">
          {({ id }) => (
            <input
              id={id}
              type="time"
              className="field-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          )}
        </FormField>

        <Button type="submit" variant="primary" size="lg">
          Draft session request
        </Button>
      </form>
    </section>
  );
}
