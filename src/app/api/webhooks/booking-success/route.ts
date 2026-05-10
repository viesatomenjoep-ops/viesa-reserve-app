import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { bed_id, bed_name, user_name, phone, date } = body;

    // Here you would typically validate the data and update your database
    // For example, marking the bed as BOOKED in Supabase.
    
    // Construct the payload for Make.com / n8n / Vapi
    const automationPayload = {
      event: 'booking_success',
      timestamp: new Date().toISOString(),
      customer: {
        name: user_name,
        phone: phone, // Already includes country code from the form
      },
      booking: {
        bed_id,
        bed_name,
        date,
      }
    };

    console.log("Triggering automation with payload:", automationPayload);

    // TODO: Actually send the payload to your Make.com webhook URL
    // await fetch('https://hook.eu1.make.com/YOUR_WEBHOOK_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(automationPayload)
    // });

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
