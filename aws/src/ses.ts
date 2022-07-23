import * as AWS from "aws-sdk";
import { region } from "./region.js";
import { domainName } from "./route53.js";

const ses = new AWS.SES({ apiVersion: "2010-12-01", region });

export type SendEmailInput = {
  email: string;
  html: string;
  text: string;
  subject: string;
};

const noReplyAddress = `noreply@${domainName}`;

export function sendEmail({ email, html, text, subject }: SendEmailInput) {
  const Charset = "UTF-8";

  return new Promise((resolve, reject) => {
    ses.sendEmail(
      {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Body: {
            Html: { Charset, Data: html },
            Text: { Charset, Data: text },
          },
          Subject: { Charset, Data: subject },
        },
        Source: noReplyAddress,
      },
      (error, data) => (error ? reject(error) : resolve(data))
    );
  });
}
