import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Label from "@/components/Label";

export default function RefundPolicyPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-16 pt-[160px]">
        <div className="mx-auto max-w-[720px] text-center">
          <Label>Legal and policies</Label>
          <h1 className="mb-6 text-[clamp(32px,5vw,52px)] font-black leading-[1.05] tracking-tighter">
            Refund Policy
          </h1>
          <p className="mx-auto max-w-[560px] text-[clamp(15px,1.6vw,17px)] leading-relaxed text-text-secondary">
            Last updated: October 28, 2026. This policy covers Vo Creations agency campaigns.
          </p>
        </div>
      </section>

      <div className="mx-auto h-px max-w-[1000px] bg-border" />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-[720px] space-y-10 text-[15px] leading-relaxed text-text-secondary">
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
              Agency campaigns
            </h2>
            <p>
              Vo Creations LLC runs in-house UGC programs for AI startups and consumer apps. Campaigns start at $50K+ a month. The fee is all-inclusive: trained creators, scripts, posting, creator bonuses, and weekly reporting. Paid media, the ad spend, is outside the fee and billed on top.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">
              No refunds after launch
            </h2>
            <p>
              There are no refunds after a campaign launches. The minimum engagement is 90 days. After that, the work is month to month. You can stop without a long contract. A month that has already launched is not refunded, including a quiet month while accounts warm up.
            </p>
          </div>
          <p>
            The public mentorship program is discontinued, and this page does not offer a mentorship refund.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
