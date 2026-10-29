import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Label from "@/components/Label";
import { contactEmailsLabel } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <>
      <Nav />

      <section className="px-6 pb-16 pt-[160px]">
        <div className="mx-auto max-w-[720px] text-center">
          <Label>Legal and policies</Label>
          <h1 className="mb-6 text-[clamp(32px,5vw,52px)] font-black leading-[1.05] tracking-tighter">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-[560px] text-[clamp(15px,1.6vw,17px)] leading-relaxed text-text-secondary">
            Last updated October 29, 2026. This policy covers vocreations.com, run by Vo Creations LLC.
          </p>
        </div>
      </section>

      <div className="mx-auto h-px max-w-[1000px] bg-border" />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-[720px] space-y-10 text-base leading-relaxed text-[#d4d4d0]">
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">What we collect</h2>
            <p>
              If you book a call, we receive the details you submit in the Google Calendar booking form, including your name, email, and anything you write about your company. If you email us, we receive that message and your email address.
            </p>
            <p className="mt-3">
              The public site loads Google Analytics (measurement ID G-1TESF8060F). Google Analytics uses cookies and collects usage data such as pages viewed, roughly where a visit comes from, and the device or browser type. The site also loads Vercel Analytics for page measurement, and Vercel hosts the site, so hosting logs can include an IP address and the page requested.
            </p>
            <p className="mt-3">
              The creator leaderboard, if you sign in, stores a session cookie so the sign-in can stay active. That cookie is not set just by browsing the marketing pages.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">How we use it</h2>
            <p>
              We use booking details and emails to reply and to decide whether a campaign is a fit. We use analytics and hosting logs to see which pages are used and to keep the site running. We do not sell personal data.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Who else handles it</h2>
            <p>
              Vercel hosts the site and provides Vercel Analytics. Google provides Google Analytics and the calendar used to book a call. Those providers process data for us so the site and the booking form work.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">How long we keep it</h2>
            <p>
              We keep booking details and email threads for as long as we are talking, and for as long as a later signed campaign agreement requires. You can ask us to delete a marketing inquiry that is not tied to a signed agreement.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Your requests</h2>
            <p>
              Email {contactEmailsLabel()} to ask what we hold about you, to correct it, or to ask us to delete it. We will reply to those addresses.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Children</h2>
            <p>This site is not for children under 13, and we do not knowingly collect their information.</p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Changes</h2>
            <p>If this policy changes, the date at the top of this page changes with it.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
