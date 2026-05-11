import { expect, test } from "@playwright/test";

test.describe("Relayhouse web widget", () => {
  test("drop-in smoke page loads widget and posts messages to chat endpoint", async ({
    page,
  }) => {
    let chatRequestBody: unknown = null;

    await page.route("**/api/chat?botId=demo", async (route) => {
      chatRequestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          botId: "demo",
          conversationId: "smoke-conversation",
          reply: "Smoke reply from Relayhouse.",
        }),
      });
    });

    await page.goto("/widget-smoke.html");

    await page.getByRole("button", { name: "Open chat" }).click();
    await page.getByPlaceholder("Write a message").fill("What are your hours?");
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("Smoke reply from Relayhouse.")).toBeVisible();
    expect(chatRequestBody).toMatchObject({
      message: "What are your hours?",
    });
  });
});
