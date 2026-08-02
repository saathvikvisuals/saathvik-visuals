export const metadata = {
  title: "Just Enough — Privacy Policy",
};

export default function JustEnoughPrivacyPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "6rem 1.5rem",
        lineHeight: 1.7,
        fontFamily: "var(--font-libre-franklin, system-ui), sans-serif",
        color: "var(--ink)",
        background: "var(--void, transparent)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-signature, cursive)",
          fontSize: "1.5rem",
          color: "var(--accent)",
          marginBottom: "0.5rem",
        }}
      >
        Saathvik Visuals
      </p>
      <h1
        style={{
          fontFamily: "var(--font-raleway, sans-serif)",
          fontSize: "2.25rem",
          marginBottom: "0.25rem",
        }}
      >
        Privacy Policy — Just Enough
      </h1>
      <p style={{ color: "var(--muted)" }}>
        <em>Last updated: July 2026</em>
      </p>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--line)",
          margin: "2rem 0",
        }}
      />
      <p>
        Just Enough is a single-player puzzle game. Playing it never requires
        an account — this policy explains what happens on the rare path where
        you choose to create one.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>By default: nothing.</strong> You can play every level, keep
        your streak, and unlock every achievement without ever signing in. No
        account, no login, no data leaves your device.
      </p>
      <p>
        <strong>If you choose to sign in</strong> (optional, always
        skippable, via email/password or Google) to keep your progress synced
        across devices, we collect:
      </p>
      <ul>
        <li>
          Your email address, and your name/profile picture if you sign in
          with Google
        </li>
        <li>
          Your game progress: completed levels, perfect-clear levels, and
          your Daily Challenge streak
        </li>
      </ul>
      <p>
        This is handled through Firebase (a Google Cloud service) for
        authentication and storage. We don&apos;t run our own servers —
        Firebase is the only third party involved, and it only receives what
        is listed above.
      </p>
      <p>
        We use Sentry for crash reporting only — if the app crashes or hits
        an unexpected error, a report (device type, OS version, and the error
        itself) is sent to help us fix it. This never includes your email,
        game progress, or any personal data. We have no other analytics SDK.
      </p>

      <h2>What&apos;s stored on your device</h2>
      <p>Regardless of whether you sign in, the app saves data locally, on-device:</p>
      <ul>
        <li>Whether you&apos;ve completed the onboarding intro</li>
        <li>Your current and best Daily Challenge streak</li>
        <li>
          Which levels you&apos;ve completed and which you&apos;ve cleared
          perfectly (for Achievements)
        </li>
        <li>Your haptics/sound preferences</li>
      </ul>
      <p>
        If you&apos;re signed in, this same data is also synced to your
        account so it&apos;s available on another device.
      </p>

      <h2>Advertising</h2>
      <p>
        Just Enough shows optional rewarded video ads (e.g. &quot;watch an ad
        for a hint&quot;) via Google AdMob. Ads are requested as
        non-personalized. AdMob and its ad partners may collect device
        identifiers and usage data to serve and measure these ads, per{" "}
        <a href="https://policies.google.com/privacy">
          Google&apos;s Privacy &amp; Terms
        </a>
        . This applies only when an ad is shown; it&apos;s not tied to your
        account or game progress.
      </p>

      <h2>Sharing</h2>
      <p>
        The one place data leaves the app by your own action is if you tap
        &quot;Share result&quot; after a Daily Challenge — that opens your
        device&apos;s native share sheet so you can send a text message, post
        to social media, etc. That&apos;s initiated entirely by you, each
        time, and goes wherever you choose to send it.
      </p>

      <h2>Deleting your data</h2>
      <p>
        Signing out doesn&apos;t delete your cloud data. To delete your
        account and everything synced to it, email us at the address below
        and we&apos;ll remove it. Uninstalling the app removes everything
        stored on-device, whether or not you were signed in.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        This app is not directed at children, and the optional account system
        requires an email address, which is not something we knowingly
        collect from children under the age required by applicable law (e.g.
        under 13 in the US, under 16 in the EU where applicable).
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we add anything else that collects data (analytics, ads), this
        document will be updated first, describing exactly what changed and
        why.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy, or to request account/data deletion:{" "}
        <strong>saathvikk202@gmail.com</strong>
      </p>
    </main>
  );
}
