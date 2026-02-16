/**
 * Test Email Configuration
 * This script tests if email sending works with current environment variables
 */

require('dotenv').config();
const sendEmail = require('./src/utils/sendEmail');

console.log('🧪 Testing Email Configuration...\n');

// Check if environment variables are set
console.log('📋 Environment Variables:');
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ NOT SET'}`);
console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set (hidden)' : '❌ NOT SET'}`);
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ ERROR: Email credentials not configured!');
    console.log('\n📝 To fix:');
    console.log('1. Make sure .env file exists in server directory');
    console.log('2. Add EMAIL_USER and EMAIL_PASSWORD to .env file');
    console.log('3. For Gmail, use an App Password: https://myaccount.google.com/apppasswords');
    process.exit(1);
}

// Get test recipient email from command line or use default
const testEmail = process.argv[2] || process.env.EMAIL_USER;

console.log(`📧 Sending test email to: ${testEmail}\n`);

const testEmailHTML = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f7;">
  <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <div style="background: #4f46e5; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0;">✅ Email Test Successful!</h1>
    </div>
    <div style="padding: 30px; color: #333333;">
      <h2>E-Shikshan Email System Test</h2>
      <p>If you're reading this, your email configuration is working correctly!</p>
      <div style="background: #eef2ff; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Test Details:</strong></p>
        <p style="margin: 5px 0;">• Sent from: ${process.env.EMAIL_USER}</p>
        <p style="margin: 5px 0;">• Environment: ${process.env.NODE_ENV || 'development'}</p>
        <p style="margin: 5px 0;">• Time: ${new Date().toLocaleString()}</p>
      </div>
      <p>Your E-Shikshan platform is ready to send emails! 🎉</p>
    </div>
    <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
      <p>© 2026 E-Shikshan Platform - Email Configuration Test</p>
    </div>
  </div>
</body>
</html>
`;

// Send test email
(async () => {
    try {
        console.log('🚀 Sending email...\n');
        
        const result = await sendEmail({
            to: testEmail,
            subject: '🧪 E-Shikshan Email Configuration Test',
            html: testEmailHTML,
            text: 'E-Shikshan Email Test - If you can read this, your email configuration is working!'
        });

        if (result.success) {
            console.log('✅ SUCCESS! Email sent successfully!');
            console.log(`   Message ID: ${result.messageId}`);
            console.log(`   Recipient: ${testEmail}`);
            console.log('\n💡 Tips:');
            console.log('   • Check your inbox (and spam folder)');
            console.log('   • It may take a few seconds to arrive');
            console.log('   • If not received, check Gmail App Password');
            console.log('\n🎯 Next Steps:');
            console.log('   1. Verify email credentials are set in Render Dashboard');
            console.log('   2. Test email functionality in production');
        } else {
            console.log('❌ FAILED! Email could not be sent.');
            console.log(`   Error: ${result.error}`);
            console.log('\n🔧 Troubleshooting:');
            console.log('   • Verify EMAIL_USER is correct');
            console.log('   • Verify EMAIL_PASSWORD is a valid Gmail App Password');
            console.log('   • Check internet connection');
            console.log('   • Generate new App Password at: https://myaccount.google.com/apppasswords');
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   • Make sure sendEmail.js exists');
        console.log('   • Check nodemailer is installed: npm install nodemailer');
        console.log('   • Verify .env file configuration');
    }
})();
