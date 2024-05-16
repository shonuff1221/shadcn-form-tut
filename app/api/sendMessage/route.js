import { NextRequest, NextResponse } from "next/server";

/**
 * Validates the presence and format of the WEBHOOK_URL environment variable.
 * @param {string} webhookUrl - The Discord webhook URL.
 * @returns {boolean} - True if the webhook URL is valid, false otherwise.
 */
function isValidWebhookUrl(webhookUrl) {
  // Implement your validation logic here
  return true;
}

/**
 * Sends a message to the Discord webhook.
 * @param {string} webhookUrl - The Discord webhook URL.
 * @param {Object} messageData - The message data to be sent.
 * @returns {Promise<Response>} - The response from the Discord webhook.
 */
async function sendMessageToDiscord(webhookUrl, messageData) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    // Handle potential errors from the Discord webhook
    if (!response.ok) {
      console.error(
        `Failed to send message to Discord: ${response.status} ${response.statusText}`
      );
      // Add additional error handling and logging as needed
    }

    return response;
  } catch (error) {
    console.error("Error sending message to Discord:", error);
    // Add additional error handling and logging as needed
    throw error;
  }
}

/**
 * Handles the POST request to send a message.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(req) {
  const webhookUrl = process.env.WEBHOOK_URL;

  // Validate the WEBHOOK_URL environment variable
  if (!isValidWebhookUrl(webhookUrl)) {
    console.error("Invalid WEBHOOK_URL environment variable");
    return NextResponse.json({ error: "Invalid webhook URL" }, { status: 400 });
  }

  const body = await req.formData();
  console.log("body", body);

  // Validate the form data
  const emailAddress = body.get("emailAddress");
  const mattressType = body.get("mattressType");
  const phoneNumber = body.get("phoneNumber");

  if (!emailAddress || !mattressType || !phoneNumber) {
    console.error("Missing required form data");
    return NextResponse.json(
      { error: "Missing required form data" },
      { status: 400 }
    );
  }

  // Sanitize and validate the form data to prevent potential security risks

  const messageData = {
    embeds: [
      {
        title: "New Inquiry",
        fields: [
          {
            name: "emailAddress",
            value: emailAddress,
          },
          {
            name: "mattressType",
            value: mattressType,
          },
          {
            name: "phoneNumber",
            value: phoneNumber,
          },
        ],
      },
    ],
  };

  await sendMessageToDiscord(webhookUrl, messageData);

  return NextResponse.json({ message: "ok" }, { status: 200 });
}
