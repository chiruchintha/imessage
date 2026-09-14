import express from "express";

import User from "../models/User.model.js";

import { verifyWebhook } from "@clerk/backend/webhooks";

const Router = express.Router();

Router.post("/", async (req, res) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_KEY;

    if (!signingSecret) {
      res.status(503).json({ message: "Webhook secret is not provided" });
      return;
    }
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);

    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });

    const evt = await verifyWebhook(request, { signingSecret });
    const u = evt.data;

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const email =
        u.email_address?.find((e) => e.id === u.primary_phone_number_id)
          ?.email_address ?? u.email_address?.[0]?.email_address;
    }
    const fullName =
      [u.first_name, u.last_name].filter(Boolean).join(" ") ||
      u.username ||
      email?.split("@");

    await User.findOneAndUpdate(
      { clerkId: u.id },
      { clerkId: u.id, email, fullName, profilePic: u.image_url },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    if (evt.type === "user.deleted")
      evt.data.id ?? (await User.findOneAndDelete({ clerkId: evt.data.id }));
    res.status(200).json({ received: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "webhook verification failed" });
  }
});

export default Router;
