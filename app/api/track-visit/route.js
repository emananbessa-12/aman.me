import axios from 'axios';
import { NextResponse } from 'next/server';

// Helper function to get location from IP
async function getLocationFromIP(ip) {
  try {
    // Use ipapi.co for free IP geolocation
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    if (data.city && data.region && data.country) {
      return `${data.city}, ${data.region}, ${data.country}`;
    } else if (data.country) {
      return data.country;
    }
    return 'Unknown location';
  } catch (error) {
    console.error('Location lookup failed:', error);
    return 'Location lookup failed';
  }
}

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

    // Get visitor's IP for location lookup
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 'Unknown IP';
    
    // Get geographic location (only if we have a real IP)
    let location = 'Unknown location';
    if (ip && ip !== 'Unknown IP' && !ip.startsWith('127.') && !ip.startsWith('::1')) {
      location = await getLocationFromIP(ip);
    }

    const message = page === 'New Visitor' 
      ? `🌟 <b>New Visitor!</b>\n📍 <b>Location:</b> ${location}\n🔗 <b>From:</b> ${referrer}\n⏰ ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`
      : `📊 <b>User Left Site</b>\n📍 <b>Location:</b> ${location}\n⏱️ ${userAgent}\n⏰ ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}`;

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