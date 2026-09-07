import type { Metadata } from "next";
import Image from "next/image";

import { InfoPage, InfoSection } from "@/components/shared/info-page";
import { UrduLine } from "@/components/shared/urdu-line";
import { img } from "@/lib/data/images";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Mehrab began with one question: why pay more for a brand name if the product is no better? Our story, vision and mission for premium men's shalwar kameez at a fair price.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="Our Story"
      title="Elevate Tradition"
      intro="Mehrab started with a simple question."
      wide
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <blockquote className="border-l-2 border-brass pl-5 font-serif text-xl leading-snug text-foreground md:text-2xl">
            Why should someone pay more for a brand name if the product does
            not offer the same level of quality?
          </blockquote>

          <InfoSection title="Our Story">
            <p>
              After an expensive but disappointing shopping experience, we
              realised that many men face the same problem. They either pay a
              high price for a well known label or compromise on fabric,
              comfort and finishing.
            </p>
            <p>We wanted to offer a better option.</p>
            <p>
              At Mehrab, we select soft, wrinkle resistant fabric and focus on
              the small details that improve the overall outfit. This includes
              premium buttons, branded hem tags and a proper quality check for
              every stitched article.
            </p>
            <p>
              Instead of offering too many similar options, we choose a limited
              range of elegant colours that we would feel confident wearing
              ourselves. We give the same attention to the way your order is
              packed, using premium zip lock bags and shopping bags to make the
              complete experience feel special.
            </p>
            <UrduLine className="!mt-6">
              ہمارے نزدیک پریمیم صرف زیادہ قیمت کا نام نہیں۔ اصل پریمیم بہتر
              معیار، سکون اور توجہ ہے۔
            </UrduLine>
          </InfoSection>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted lg:sticky lg:top-28">
          <Image
            src={img("greenFull")}
            alt="MEHRAB dark green shalwar kameez, full suit"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="grid gap-10 border-t border-border pt-10 lg:grid-cols-2 lg:gap-14">
        <InfoSection title="Our Vision">
          <p>
            We want Mehrab to become a trusted name for men who want quality
            shalwar kameez at a fair price.
          </p>
          <p>
            Our goal is to begin with a carefully selected shalwar kameez range
            and gradually grow into a complete men&rsquo;s eastern wear brand.
            In the future, we plan to introduce designer collections and
            accessories while keeping our products within reach of our
            customers.
          </p>
          <p>
            We also want to take Mehrab beyond Pakistan and present the style
            and elegance of Pakistani menswear to a wider audience.
          </p>
          <UrduLine className="!mt-6">
            ہم چاہتے ہیں کہ اچھا معیار صرف چند لوگوں تک محدود نہ رہے۔
          </UrduLine>
        </InfoSection>

        <InfoSection title="Our Mission">
          <p>
            Our mission is to create stylish and comfortable eastern wear for
            students, professionals and businessmen between the ages of 25 and
            45.
          </p>
          <p>
            A Mehrab outfit should work for different occasions. You can wear
            it simply on Friday or pair it with a waistcoat, shawl or coat for
            a wedding or special event.
          </p>
          <p>
            Most importantly, we want you to feel good when you wear Mehrab.
            You should know that you look well dressed, without feeling that
            you paid extra only for a label.
          </p>
          <p>
            Our aim is to create the kind of outfit that people notice and ask:
          </p>
          <UrduLine className="!mt-4">
            &ldquo;یہ کہاں سے لیا ہے؟&rdquo;
          </UrduLine>
        </InfoSection>
      </div>

      <div className="border-t border-border pt-10 text-center">
        <p className="font-serif text-2xl tracking-tight md:text-3xl">
          Mehrab Essentials
        </p>
        <UrduLine className="mt-3 border-none pr-0 text-center">
          معیار بھی، وقار بھی۔
        </UrduLine>
      </div>
    </InfoPage>
  );
}
