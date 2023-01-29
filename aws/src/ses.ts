// TODO import { awsRegion } from "@ggbot2/infrastructure"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Destination, Message } from "@aws-sdk/client-ses";

// TODO
// why sending from a region other than us-east-1 does not work?
// const ses = new SESClient({ apiVersion: "2010-12-01", region: awsRegion });
const ses = new SESClient({ apiVersion: "2010-12-01", region: "us-east-1" });

export type SendEmailInput = {
  html: string;
  source: string;
  subject: string;
  text: string;
  toAddresses: string[];
};

export const sendEmail = async ({
  html,
  source,
  subject,
  toAddresses,
  text,
}: SendEmailInput) => {
  const Charset = "UTF-8";

  const destination: Destination = {
    ToAddresses: toAddresses,
  };

  const message: Message = {
    Body: {
      Html: { Charset, Data: html },
      Text: { Charset, Data: text },
    },
    Subject: { Charset, Data: subject },
  };

  const command = new SendEmailCommand({
    Destination: destination,
    Message: message,
    Source: source,
  });

  await ses.send(command);
};
