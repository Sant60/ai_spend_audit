import { Resend } from "resend";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  try {
    const body = await request.json();

    await resend.emails.send({
      from: "onboarding@resend.dev",

      to: body.email,

      subject: "Your AI Spend Audit Report",

      html: `
  <div style="
    font-family: Arial, sans-serif;
    line-height: 1.7;
    max-width: 600px;
    margin: auto;
    padding: 24px;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
  ">

    <h2 style="margin-bottom: 8px;">
      AI Spend Audit Report
    </h2>

    <p style="color:#444;">
      Hello ${body.name},
    </p>

    <p>
      Your audit report is ready. Here's a quick summary of your current setup.
    </p>

    <hr style="margin: 20px 0;" />

    <div style="
      background:#f7f7f7;
      padding:16px;
      border-radius:8px;
    ">

      <p>
        <strong>Current Tool:</strong>
        ${body.audit.currentToolName}
      </p>

      <p>
        <strong>Current Plan:</strong>
        ${body.audit.currentPlanName}
      </p>

      <p>
        <strong>Estimated Monthly Savings:</strong>
        $${body.audit.monthlySavings}
      </p>

      <p>
        <strong>Recommended Plan:</strong>
        ${body.audit.recommendation.planName}
      </p>

      <p>
        <strong>Why:</strong>
        ${body.audit.recommendation.reason}
      </p>

    </div>

    <p style="margin-top: 24px;">
      Thanks for trying AI Spend Audit.
    </p>

  </div>
`,
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to send email",
      },
      {
        status: 500,
      },
    );
  }
}
