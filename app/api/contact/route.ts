import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Integrate your preferred email provider
    //
    // Option 1: Resend
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL,
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `New project inquiry from ${name}`,
    //   html: `
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Company:</strong> ${body.company || "N/A"}</p>
    //     <p><strong>Project Type:</strong> ${body.projectType || "N/A"}</p>
    //     <p><strong>Budget:</strong> ${body.budget || "N/A"}</p>
    //     <p><strong>Message:</strong> ${message}</p>
    //   `,
    // });
    //
    // Option 2: Formspree (just forward to their endpoint)
    // Option 3: EmailJS (client-side, no server route needed)

    // Simulated success for demo
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
