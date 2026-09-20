import Link from "next/link";

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="brand" aria-label="Lovelace Technologies home" onClick={onClick}>
      <span className="brand__mark" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mark-dark" src="/brand/lovelace-mark.png" alt="" width={206} height={256} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mark-light" src="/brand/lovelace-mark-light.png" alt="" width={206} height={256} />
      </span>
      <span>
        Lovelace<span className="brand__suffix"> Technologies</span>
      </span>
    </Link>
  );
}
