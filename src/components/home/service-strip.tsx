import { RefreshCw, ShieldCheck, Truck, Wallet } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Free Express Shipping",
    note: "On all orders over Rs 15,000",
  },
  {
    icon: RefreshCw,
    title: "7-Day Easy Exchange",
    note: "Free size exchange, no questions",
  },
  {
    icon: Wallet,
    title: "Cash on Delivery",
    note: "Pay when it arrives, nationwide",
  },
  {
    icon: ShieldCheck,
    title: "Handmade Guarantee",
    note: "Crafted in our Lahore atelier",
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
