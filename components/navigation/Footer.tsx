import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/help", label: "Help" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">MedLink</p>
          <p className="text-sm text-slate-500">
            Helping patients discover trusted doctors and hospitals nearby.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-slate-600">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} MedLink. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
