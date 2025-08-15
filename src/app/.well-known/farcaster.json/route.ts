import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ",
      payload: "eyJkb21haW4iOiJzZWEtc2Vhd2VsbC52ZXJjZWwuYXBwIn0",
      signature: "MHgyZmVjZGFiNjNlYjQ3ZjgyMThmYzljMWQ3NzQ0YTBmMDdkOTU3MjVjYmE2ODY4MGJlOTkwNWIzOTU0MjA4YTFjM2QzMzMzZTI1ODAxMTEyODg5YWJiN2ZiZTEwZDM2YzlkNDZkZDUwMTViYjhjMjVlMGZhYTVlYjI1MjNlOTEyZDFi",
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Open",
      webhookUrl: `${appUrl}/api/webhook`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#555555",
      primaryCategory: "social",
    },
  };

  return Response.json(config);
}
