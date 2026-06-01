"use client";

import * as React from "react";
import { FormField } from "@/components/forms/form-field/FormField";
import { Button } from "@/components/actions/button/Button";
import { ButtonLink } from "@/components/actions/button/ButtonLink";
import { aboutCopy } from "@/content/approach";
import { cn } from "@/lib/cn";
import s from "./sections.module.css";

/**
 * Contact — progressive enhancement (B3):
 *  - If NEXT_PUBLIC_FORMSPREE_ID is set, the form POSTs to Formspree and shows
 *    inline success/error status (no secrets in the repo).
 *  - Otherwise it composes a prefilled `mailto:` and opens the mail client.
 * The direct mailto link is always present as a no-JS / no-config fallback.
 */
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactSection() {
  const [name, setName] = React.useState("");
  const [emailFrom, setEmailFrom] = React.useState("");
  const [need, setNeed] = React.useState("Full-time role");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<SubmitState>("idle");

  const email = aboutCopy.email;
  const usesFormspree = Boolean(FORMSPREE_ID);

  function openMailto() {
    const subject = encodeURIComponent(
      name ? `Portfolio enquiry from ${name}` : "Portfolio enquiry",
    );
    const body = encodeURIComponent(
      [
        name ? `Name: ${name}` : "",
        emailFrom ? `Email: ${emailFrom}` : "",
        need ? `Engagement: ${need}` : "",
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!usesFormspree) {
      openMailto();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: emailFrom,
          need,
          message,
          _subject: name
            ? `Portfolio enquiry from ${name}`
            : "Portfolio enquiry",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmailFrom("");
        setNeed("Full-time role");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";
  const helperText = usesFormspree
    ? "Sends straight to my inbox — I'll reply by email."
    : "Submitting opens your email client with this message prefilled.";
  const submitLabel = usesFormspree
    ? submitting
      ? "Sending…"
      : "Send message"
    : "Draft email to Edgar";

  const statusMessage =
    status === "success"
      ? "Thanks — your message is on its way. I'll reply by email soon."
      : status === "error"
        ? `Something went wrong. Please email me directly at ${email}.`
        : "";

  return (
    <section id="contact" className={cn(s.section, s.contactSection)}>
      <div className="container">
        <div className={s.contactGrid}>
          <div className={s.contactCopy}>
            <p className={cn(s.eyebrow, "ts-label-md")}>Work together</p>
            <h2 className={cn(s.heading, "ts-display-section")}>
              Build clear, accessible product interfaces.
            </h2>
            <p className={cn(s.lead, "ts-body-lg")}>
              Bring me into health, wellness, sports, or lifestyle products
              that need stronger flows, design systems, or accessibility-focused
              UI.
            </p>
            <div className={cn(s.contactLinks, "ts-body-md")}>
              <a href={`mailto:${email}`}>{email}</a>
              <span>Open to full-time roles and contract work</span>
            </div>
          </div>

          <form className={cn(s.contactForm, s.formPanel)} onSubmit={handleSubmit}>
            <div className={s.contactRow}>
              <FormField label="Your name">
                {({ id }) => (
                  <input
                    id={id}
                    className="field-control"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Your name"
                  />
                )}
              </FormField>

              <FormField label="Work email">
                {({ id }) => (
                  <input
                    id={id}
                    className="field-control"
                    type="email"
                    value={emailFrom}
                    onChange={(e) => setEmailFrom(e.target.value)}
                    autoComplete="email"
                    placeholder="name@company.com"
                    required={usesFormspree}
                  />
                )}
              </FormField>
            </div>

            <FormField label="Role or project need">
              {({ id }) => (
                <select
                  id={id}
                  className="field-control"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                >
                  <option>Full-time role</option>
                  <option>Contract / project</option>
                  <option>Design system consult</option>
                  <option>Audit & advisory</option>
                </select>
              )}
            </FormField>

            <FormField label="Message" helperText={helperText}>
              {({ id, describedBy }) => (
                <textarea
                  id={id}
                  aria-describedby={describedBy}
                  className="field-control"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Share the role, product, timeline, or scope you want to discuss."
                  required={usesFormspree}
                />
              )}
            </FormField>

            <div className={s.contactActions}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
              >
                {submitLabel}
              </Button>
              <ButtonLink href={`mailto:${email}`} variant="ghost" size="lg">
                Email Edgar directly
              </ButtonLink>
            </div>

            {statusMessage ? (
              <p
                className={cn(s.contactStatus, "ts-body-sm")}
                data-state={status}
                role="status"
                aria-live="polite"
              >
                {statusMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
