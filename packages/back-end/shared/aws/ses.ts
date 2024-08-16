import { SES } from "@aws-sdk/client-ses";

interface SendEmailProps {
  to?: string;
  subject: string;
  body: string;
  source?: string;
}

export async function sesSendEmail({
  to = "flipsourcer@gmail.com",
  subject,
  body,
  source = "hello@flipsourcer.com",
}: SendEmailProps) {
  const ses = new SES({ apiVersion: "2010-12-01" });

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: source,
  };

  try {
    await ses.sendEmail(params);
  } catch (e) {
    console.log(e);
  }
}
