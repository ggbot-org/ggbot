import { Navigation } from "_components/Navigation";
import { FC } from "react";

import { mount } from "./_mount.js";

const Page: FC = () => (
  <div>
    <Navigation />

    <main>
      <h1>Terms of Service</h1>

      <p>
        Welcome to <em>ggbot2</em>. Please read this <em>Terms of Service</em>{" "}
        carefully as you agree to be bound by it while using the <em>ggbot2</em>{" "}
        website.
      </p>

      <h2>Website access</h2>

      <p>
        You access <em>ggbot2</em> website with your account email.
      </p>

      <p>Keep your email safe, it is your responsibility.</p>
      <h2>Binance API</h2>

      <p>
        The <em>ggbot2</em> engine needs your grant to access your Binance
        account using Binance API key.
      </p>

      <p>
        It is crucial to understand that <em>ggbot2</em> will use a Binance API
        key only if its <b>withdrawal permission is disabled</b>. This means
        that <em>ggbot2</em> as well as any other human or software that will
        access the Binance API key you provided, will not be able to withdraw
        from your Binance account.
      </p>

      <h2>Product pricing</h2>

      <p>
        All prices shown on the website include the applicable VAT rate.
        Depending on your country of purchase, other local charges and taxes may
        also apply.
      </p>

      <h2>Privacy</h2>

      <p>
        Please review our <a href="/privacy">Privacy Policy</a> as it governs
        the privacy practices undertaken by <em>ggbot2</em>.
      </p>
    </main>
  </div>
);

mount(Page);