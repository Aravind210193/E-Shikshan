const sendEmail = require('../utils/sendEmail');

// @desc    Send support/contact email (Public)
// @route   POST /api/support/contact
// @access  Public
exports.sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Missing required fields (name, email, message)' });
        }

        const adminEmail = process.env.EMAIL_USER;

        // Send notification to Admin
        const adminEmailResult = await sendEmail({
            to: adminEmail,
            subject: `[Support Inquiry] ${subject || 'General Contact'}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #4f46e5; padding: 20px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 20px;">Public Support Inquiry</h1>
                        </div>
                        <div style="padding: 30px;">
                            <p><b>From:</b> ${name} (${email})</p>
                            <p><b>Subject:</b> ${subject || 'N/A'}</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p><b>Message:</b></p>
                            <p style="white-space: pre-line;">${message}</p>
                        </div>
                    </div>
                </div>
            `
        });

        // Send Auto-reply to User
        await sendEmail({
            to: email,
            subject: 'We received your message - E-Shikshan Support',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: #10b981; padding: 20px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 20px;">Message Received</h1>
                        </div>
                        <div style="padding: 30px;">
                            <p>Hello <b>${name}</b>,</p>
                            <p>Thank you for reaching out to E-Shikshan. We have received your message and will get back to you shortly.</p>
                            <p>Your inquiry: "${subject || 'General inquiry'}" is being processed by our team.</p>
                            <br/>
                            <p>Best Regards,<br/>E-Shikshan Platform Team</p>
                        </div>
                    </div>
                </div>
            `
        });

        if (adminEmailResult.success) {
            res.status(200).json({ success: true, message: 'Your message has been sent successfully. Check your email for confirmation!' });
        } else {
            console.error('Support email failed:', adminEmailResult.error);
            res.status(500).json({ message: 'Email system error. Please try again later.' });
        }
    } catch (error) {
        console.error('Support controller error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
