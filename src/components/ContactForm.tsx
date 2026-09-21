"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { services, site } from "@/content/site";
import { ease } from "@/lib/motion";

type Values = {
  name: string;
  email: string;
  company: string;
  role: string;
  website: string;
  message: string;
};
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const empty: Values = { name: "", email: "", company: "", role: "", website: "", message: "" };

/** Netlify stores up to 8MB per submission. */
const MAX_FILE = 8 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.md,.key,.pages,.zip";

const prettySize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)}KB` : `${(bytes / 1024 / 1024).toFixed(1)}MB`;

/** Accepts "lovelace.com" as readily as a full address. */
function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter an email address like name@company.com.";
  if (!values.company.trim()) errors.company = "Enter your organization's name.";
  if (values.website.trim()) {
    try {
      const url = new URL(normalizeUrl(values.website));
      if (!url.hostname.includes(".")) throw new Error("no tld");
    } catch {
      errors.website = "Enter a web address like lovelacetechnologies.com.";
    }
  }
  if (values.message.trim().length < 10) errors.message = "Tell us a little about what you're working on (at least 10 characters).";
  return errors;
}

const labels: Record<keyof Values, string> = {
  name: "Name",
  email: "Work email",
  company: "Organization",
  role: "Role",
  website: "Website",
  message: "What are you working on?",
};

export function ContactForm() {
  const [values, setValues] = useState<Values>(empty);
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [botField, setBotField] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    setTouched({ name: true, email: true, company: true, website: true, message: true });
    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setShowSummary(false);
    setStatus("sending");
    try {
      // Netlify Forms: posted as multipart to the static form declared in
      // public/__forms.html, so an attachment can ride along. Submissions and
      // files appear in the Netlify dashboard.
      const body = new FormData();
      body.set("form-name", "contact");
      body.set("bot-field", botField);
      Object.entries(values).forEach(([key, value]) =>
        body.set(key, key === "website" ? normalizeUrl(value) : value),
      );
      body.set("interests", interests.join(", "));
      if (file) body.set("attachment", file, file.name);
      // No Content-Type header: the browser sets the multipart boundary.
      const res = await fetch("/__forms.html", { method: "POST", body });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  const takeFile = (picked: File | null) => {
    if (!picked) {
      setFile(null);
      setFileError(null);
      return;
    }
    if (picked.size > MAX_FILE) {
      setFile(null);
      setFileError(`That file is ${prettySize(picked.size)}. The limit is 8MB \u2014 send a link instead.`);
      return;
    }
    setFile(picked);
    setFileError(null);
  };

  const field = (
    key: keyof Values,
    props: {
      type?: string;
      autoComplete?: string;
      optional?: boolean;
      multiline?: boolean;
      help?: string;
      placeholder?: string;
    },
  ) => {
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
          placeholder={props.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : props.help ? `${id}-help` : undefined}
        />
        {error ? (
          <p id={`${id}-error`} className="field__error">
            {error}
          </p>
        ) : (
          props.help && (
            <p id={`${id}-help`} className="field__help">
              {props.help}
            </p>
          )
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

          {field("website", {
            type: "url",
            autoComplete: "url",
            optional: true,
            help: "Your company site, so we can see what you\u2019re working with.",
            placeholder: "lovelacetechnologies.com",
          })}

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

          <div className="field">
            <label htmlFor="contact-attachment">
              Attach an RFP or proposal <span className="field__optional">(optional)</span>
            </label>
            <div
              className="dropzone"
              data-dragging={dragging}
              data-invalid={Boolean(fileError)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                takeFile(e.dataTransfer.files?.[0] ?? null);
              }}
            >
              <input
                ref={fileInputRef}
                id="contact-attachment"
                type="file"
                name="attachment"
                accept={ACCEPT}
                className="dropzone__input"
                aria-describedby={fileError ? "contact-attachment-error" : "contact-attachment-help"}
                onChange={(e) => takeFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <p className="dropzone__file">
                  <span className="hole" aria-hidden="true" />
                  <span className="dropzone__name">{file.name}</span>
                  <span className="t-caption">{prettySize(file.size)}</span>
                  <button
                    type="button"
                    className="dropzone__remove"
                    onClick={() => {
                      takeFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      fileInputRef.current?.focus();
                    }}
                  >
                    Remove
                    <span className="visually-hidden"> {file.name}</span>
                  </button>
                </p>
              ) : (
                <p className="dropzone__prompt">
                  <span className="dropzone__action">Choose a file</span> or drop it here
                </p>
              )}
            </div>
            {fileError ? (
              <p id="contact-attachment-error" className="field__error" role="alert">
                {fileError}
              </p>
            ) : (
              <p id="contact-attachment-help" className="field__help">
                PDF, Word, PowerPoint, Excel or text. Up to 8MB.
              </p>
            )}
          </div>

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
