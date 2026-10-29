import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Label from "@/components/Label";
import { contactEmailsLabel } from "@/lib/site";

// TODO: counsel review before treating this page as final legal text.

export default function TermsPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-16 pt-[160px]">
        <div className="mx-auto max-w-[720px] text-center">
          <Label>Legal and policies</Label>
          <h1 className="mb-6 text-[clamp(32px,5vw,52px)] font-black leading-[1.05] tracking-tighter">
            Terms
          </h1>
          <p className="mx-auto max-w-[560px] text-[clamp(15px,1.6vw,17px)] leading-relaxed text-text-secondary">
            Last updated October 29, 2026. These terms cover vocreations.com and services from Vo Creations LLC.
          </p>
        </div>
      </section>

      <div className="mx-auto h-px max-w-[1000px] bg-border" />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-[720px] space-y-10 text-base leading-relaxed text-[#d4d4d0]">
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Using the site</h2>
            <p>
              You may browse vocreations.com and book a call. Do not misuse the site, attempt to break it, or copy it in bulk.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Campaigns</h2>
            <p>
              A campaign is governed by the signed agreement with that client. If this page and that agreement conflict, the signed agreement controls.
            </p>
            <p className="mt-3">
              Campaigns start at $50K+ a month and include daily Slack reporting. The minimum is 90 days, then month to month. Paid media is billed separately, on top of the monthly fee. You own every video produced for your campaign. There are no refunds after launch. The refund terms are on the{" "}
              <Link href="/refund-policy" className="text-text underline decoration-white/30 underline-offset-4">
                refund policy
              </Link>
              . The CPM guarantee is as defined in the client agreement.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">The site itself</h2>
            <p>
              Vo Creations LLC owns the site design, text, and marks on vocreations.com, other than client logos shown as brands we have worked with and videos a client owns under its agreement.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Disclaimers</h2>
            <p>
              The site is provided as available. Campaign examples are anonymized past results. They are not a promise that the next campaign matches those numbers.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Limitation of liability</h2>
            <p>
              To the extent the law allows, Vo Creations LLC is not liable for indirect or consequential damages arising from use of the site. Liability for a campaign is set in that client&apos;s signed agreement.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Governing law</h2>
            <p>These website terms are governed by the laws of the State of New York.</p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Changes and contact</h2>
            <p>
              If these terms change, the date at the top of this page changes with them. Questions: {contactEmailsLabel()}.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
