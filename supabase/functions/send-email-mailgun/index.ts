import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, text, from }: EmailRequest = await req.json();

    if (!to || !subject) {
      throw new Error("Missing required fields: to, subject");
    }

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      throw new Error("Mailgun credentials not configured");
    }

    const fromAddress = from || `noreply@${MAILGUN_DOMAIN}`;

    // Build form data for Mailgun API
    const formData = new FormData();
    formData.append("from", fromAddress);
    formData.append("to", to);
    formData.append("subject", subject);
    
    if (html) {
      formData.append("html", html);
    }
    if (text) {
      formData.append("text", text);
    }

    console.log(`Sending email to ${to} with subject: ${subject}`);

    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Mailgun error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-email-mailgun function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
