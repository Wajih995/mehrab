import { RefreshCw, ShieldCheck, Truck, Wallet } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Nationwide Delivery",
    note: "From Karachi to all of Pakistan",
  },
  {
    icon: RefreshCw,
    title: "7-Day Easy Exchange",
    note: "Free size exchange — T&Cs apply",
  },
  {
    icon: Wallet,
    title: "Cash on Delivery",
    note: "Pay when it arrives, nationwide",
  },
  {
    icon: ShieldCheck,
    title: "Handmade Guarantee",
    note: "Crafted in our Karachi atelier",
  },
];

export function ServiceStrip() {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4 md:gap-4 md:py-10">
        {services.map(({ icon: Icon, title, note }) => (
          <div key={title} className="flex items-center gap-3.5">
            <Icon className="size-6 shrink-0 text-brass" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium leading-tight">{title}</p>
              <p className="mt-0.5 text-2xs text-muted-foreground">{note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
