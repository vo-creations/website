import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Label from "@/components/Label";
import { legalDateLabel, privacyUpdated } from "@/lib/content-dates";
import { contactEmailsLabel } from "@/lib/site";
import { leaderboardSessionCookieName } from "@/lib/supabase/session-cookie";

export default function PrivacyPage() {
  const sessionCookie = leaderboardSessionCookieName();
  return (
    <div className="editorial">
      <Nav variant="editorial" />
      <main id="main" className="legal-main">
      <section className="pb-12 pt-4 text-center">
        <div className="mx-auto max-w-[720px] text-center">
          <Label>Legal and policies</Label>
          <h1 className="mb-6 text-[clamp(32px,5vw,52px)] font-black leading-[1.05] tracking-tighter">
            Privacy Policy
          </h1>
          <p className="mx-auto max-w-[560px] text-[clamp(15px,1.6vw,17px)] leading-relaxed text-text-secondary">
            Last updated {legalDateLabel(privacyUpdated)}. This policy covers vocreations.com, run by Vo Creations LLC.
          </p>
        </div>
      </section>

      <div className="mx-auto h-px max-w-[1000px] bg-border" />

      <section className="py-10">
        <div className="mx-auto max-w-[720px] space-y-10 text-base leading-relaxed text-[#d4d4d0]">
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">What we collect</h2>
            <p>
              If you book a call, we receive the details you submit through Calendly, including your name, email, and anything you write about your company. If you email us, we receive that message and your email address.
            </p>
            <p className="mt-3">
              The public site loads Google Analytics (measurement ID G-1TESF8060F). Google Analytics uses cookies and collects usage data such as pages viewed, roughly where a visit comes from, and the device or browser type. The site also loads Vercel Analytics for page measurement, and Vercel hosts the site, so hosting logs can include an IP address and the page requested.
            </p>
            <p className="mt-3">
              We do not respond to browser Do Not Track signals, because there is no common standard for them.
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
              Vercel hosts the site and provides Vercel Analytics. Google provides Google Analytics. Calendly provides the page used to book a call. Those providers process data for us so the site and booking work.
            </p>
            <p className="mt-3">
              If you play a video on this site, the platform that hosts it (Instagram, TikTok, YouTube or Facebook) may receive your IP address and set its own cookies under its own privacy policy.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-[20px] font-extrabold tracking-tight text-text md:text-[22px]">Cookies</h2>
            <p>
              Google Analytics sets _ga and _ga_1TESF8060F. Those cookies can last up to 2 years. You can opt out with{" "}
              <a className="underline underline-offset-4" href="https://tools.google.com/dlpage/gaoptout">
                Google&apos;s Analytics opt-out add-on
              </a>
              .
            </p>
            <p className="mt-3">
              {sessionCookie ? (
                <>
                  The leaderboard session cookie is named {sessionCookie}. If the session does not fit in one cookie, it is stored as {sessionCookie}.0 and further numbered cookies.
                </>
              ) : (
                <>
                  The leaderboard session cookie is named sb-, then the Supabase project ref, then -auth-token. The site does not set a custom name. If the session does not fit in one cookie, that name is split into numbered cookies ending in .0, .1, and so on.
                </>
              )}{" "}
              It is set only after you sign in, it can last up to 400 days, and it is not set just by browsing the marketing pages.
            </p>
            <p className="mt-3">
              The homepage stores a vo-intro key in sessionStorage. It is functional, and it is used only to show the intro once per visit. It is not a cookie, and it is not sent to our server.
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
            <p className="mt-3">
              California residents can ask what we hold, ask us to correct or delete it, and will not be treated differently for asking.
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
      </main>
      <Footer tone="editorial" />
    </div>
  );
}
