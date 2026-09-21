"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { services, site } from "@/content/site";
import { ease } from "@/lib/motion";

type Values = { name: string; email: string; company: string; role: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const empty: Values = { name: "", email: "", company: "", role: "", message: "" };

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter an email address like name@company.com.";
  if (!values.company.trim()) errors.company = "Enter your organization's name.";
  if (values.message.trim().length < 10) errors.message = "Tell us a little about what you're working on (at least 10 characters).";
  return errors;
}

const labels: Record<keyof Values, string> = {
  name: "Name",
  email: "Work email",
  company: "Organization",
  role: "Role",
  message: "What are you working on?",
};

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [botField, setBotField] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const [showSummary, setShowSummary] = useState(false);

  const update = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (touched[key]) setErrors(validate(next));
  };

  const blur = (key: keyof Values) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, company: true, message: true });
    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setStatus("sending");
    try {
      // Netlify Forms: post url-encoded to the static form declared in
      // public/__forms.html. Submissions are emailed from the Netlify dashboard.
      const body = new URLSearchParams({
        "form-name": "contact",
        "bot-field": botField,
        ...values,
        interests: interests.join(", "),
      });
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const field = (key: keyof Values, props: { type?: string; autoComplete?: string; optional?: boolean; multiline?: boolean }) => {
    const error = touched[key] ? errors[key] : undefined;
    const id = `contact-${key}`;
    const Input = props.multiline ? "textarea" : "input";
    return (
      <div className="field" data-invalid={Boolean(error)}>
        <label htmlFor={id}>
          {labels[key]} {props.optional && <span className="field__optional">(optional)</span>}
        </label>
        <Input
          id={id}
          name={key}
          type={props.multiline ? undefined : props.type ?? "text"}
          autoComplete={props.autoComplete}
          value={values[key]}
          onChange={update(key)}
          onBlur={blur(key)}
          required={!props.optional}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
          <p id={`${id}-error`} className="field__error">
            {error}
          </p>
        )}
      </div>
    );
  };

  const errorList = Object.entries(errors) as [keyof Values, string][];

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          className="form-status"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          style={{ padding: "clamp(1.5rem, 4vw, 3rem)" }}
        >
          <span className="hole" aria-hidden="true" style={{ marginBottom: "1.25rem" }} />
          <p className="t-h3">Thanks, {values.name.split(" ")[0]}. Your note is sent.</p>
          <p className="t-muted" style={{ marginTop: "0.75rem" }}>
            We&apos;ll follow up at {values.email}. If it&apos;s easier, you can also book a time on{" "}
            <a className="text-link" href={site.calendlyUrl} target="_blank" rel="noopener noreferrer">
              our calendar
            </a>
            .
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" className="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          <p hidden aria-hidden="true">
            <label>
              Leave this field empty
              <input
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
              />
            </label>
          </p>
          {showSummary && errorList.length > 0 && (
            <div ref={summaryRef} tabIndex={-1} className="form-status" role="alert">
              <p className="t-h4">Check {errorList.length === 1 ? "this field" : `these ${errorList.length} fields`}:</p>
              <ul style={{ marginTop: "0.5rem", display: "grid", gap: "0.25rem" }}>
                {errorList.map(([key, message]) => (
                  <li key={key}>
                    <a className="text-link" href={`#contact-${key}`}>
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="form__row">
            {field("name", { autoComplete: "name" })}
            {field("email", { type: "email", autoComplete: "email" })}
          </div>
          <div className="form__row">
            {field("company", { autoComplete: "organization" })}
            {field("role", { autoComplete: "organization-title", optional: true })}
          </div>

          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontSize: "0.9375rem", fontWeight: 500, marginBottom: "0.5rem", padding: 0 }}>
              What can we help with? <span className="field__optional">(optional)</span>
            </legend>
            <div className="interest-grid">
              {[...services.map((s) => s.title), "Not sure yet"].map((title) => (
                <label key={title} className="interest">
                  <input
                    type="checkbox"
                    name="interests"
                    value={title}
                    checked={interests.includes(title)}
                    onChange={(e) =>
                      setInterests((list) => (e.target.checked ? [...list, title] : list.filter((x) => x !== title)))
                    }
                  />
                  <span>{title}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {field("message", { multiline: true })}

          {status === "failed" && (
            <div className="form-status" role="alert">
              <p className="t-h4">Your note didn&apos;t send.</p>
              <p className="t-muted" style={{ marginTop: "0.25rem" }}>
                Check your connection and try again, or email us at{" "}
                <a className="text-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem 1.5rem" }}>
            <button type="submit" className="btn" disabled={status === "sending"} aria-disabled={status === "sending"}>
              <span className="btn__hole" aria-hidden="true" />
              {status === "sending" ? "Sending…" : "Send note"}
            </button>
            <p className="field__help">We only use your details to reply to this note.</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
