import axios from 'axios';
import { NextResponse } from 'next/server';

// Helper function to send a message via Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
      parse_mode: 'HTML'
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return false;
  }
}

export async function POST(request) {
  try {
    const { page, userAgent, referrer } = await request.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    // Validate environment variables
    if (!token || !chat_id) {
      return NextResponse.json({
        success: false,
        message: 'Telegram token or chat ID is missing.',
      }, { status: 400 });
    }

    const message = page === 'New Visitor' 
      ? `🌟 <b>New Visitor!</b>\n🔗 From: ${referrer}\n⏰ ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`
      : `📊 <b>User Left Site</b>\n⏱️ ${userAgent}\n⏰ ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`;

    // Send Telegram notification
    const telegramSuccess = await sendTelegramMessage(token, chat_id, message);

    if (telegramSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Visit tracked successfully!',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send notification.',
    }, { status: 500 });
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
}