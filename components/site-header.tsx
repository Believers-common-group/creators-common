import Link from "next/link";

const links = [
  ["Discover", "/discover"],
  ["Creators", "/creators"],
  ["Works", "/works"],
  ["Experiences", "/experiences"],
  ["Studio", "/studio"],
  ["Registry", "/registry"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Creators Common home">
          <span className="brand-mark" aria-hidden="true" />
          Creators Common
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
