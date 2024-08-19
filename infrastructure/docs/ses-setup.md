# SES setup - Amazon Simple Email Service

Setup your email service, for example to send email from an address like `noreply@ggbot.org`.

Choose an AWS region, it can be the same as _ggbot data_ region for instance _Europe (Frankfurt)_,
in that case set the environment variable `AWS_SES_REGION` as

```sh
export AWS_SES_REGION=eu-central-1
```

Go to SES on AWS console, select the choosen region and configure a new identity which _Identity type_ will be **Domain**.
Insert your DNS domain, for example `ggbot.org`.
Expand _Advanced DKIM settings_ and select _Easy DKIM_ with **RSA_2048_BIT** _DKIM signing key length_.
Finally click on _Create Identity_ then go for _Publish DNS records to Route53_.

Once the email domain address is verified, your _Amazon SES_ is still in a limited _sandbox environment_:
you need to perform further verification steps to be able to request _production access_.

Create another identity of type _Email address_: you can use the email of the root account.
Check your email inbox and for an email from `no-reply-aws@amazon.com` and click on the verification link.

Once done, go to _Send test email_, choose _Formatted_ email format and _Successfully delivered_ scenario.
Enter subject and body and click on _Send test email_.

When all required steps have green light click on _Request production access_. Set

- _Mail type_ to _Transactional_
- _Website URL_ to the webapp URL previously deployed, for example `https://www.ggbot.org`
- optionally add another email in _Additional contacts_, AWS support will contact by default on your root email account

Follow the steps you will receive by email, the support will ask for the use case and other info before enabling the production access.
