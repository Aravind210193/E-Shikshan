const HackathonRegistration = require('../models/HackathonRegistration');
const AdminHackathon = require('../models/AdminHackathon');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const Admin = require('../models/Admin');

// Register for a hackathon
exports.register = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    const {
      teamName,
      teamSize,
      teamMembers,
      projectTitle,
      projectDescription,
      techStack,
      githubUrl,
      portfolioUrl,
      experience,
      motivation,
      phone,
    } = req.body;

    // Check if hackathon exists
    const hackathon = await AdminHackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    console.log('[Registration] Hackathon found:', hackathon.title, hackathon._id.toString());

    // Load full user details to populate required fields
    const user = await User.findById(userId).select('name email phone');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('[Registration] Loaded user for registration:', {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    // Check if user already registered
    const existingRegistration = await HackathonRegistration.findOne({
      userId,
      hackathonId,
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this hackathon' });
    }

    // Create registration
    const registration = await HackathonRegistration.create({
      userId,
      hackathonId,
      instructor: hackathon.createdBy || null,
      userDetails: {
        name: user.name,
        email: user.email,
        phone: phone || user.phone,
      },
      teamName,
      teamSize,
      teamMembers: teamMembers || [],
      projectTitle,
      projectDescription,
      techStack: techStack || [],
      githubUrl,
      portfolioUrl,
      experience,
      motivation,
    });

    // Notify Instructor
    if (hackathon.createdBy) {
      const instructor = await Admin.findById(hackathon.createdBy);
      if (instructor) {
        // Platform Notification
        await Notification.create({
          recipient: instructor._id,
          recipientType: 'Admin',
          title: 'New Hackathon Registration',
          message: `${user.name} has registered for ${hackathon.title}${teamName ? ` (Team: ${teamName})` : ''}`,
          type: 'general',
          relatedId: hackathonId,
        });

        // Email Notification
        try {
          await sendEmail({
            to: instructor.email,
            subject: `New Registration: ${hackathon.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="background: #4f46e5; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">New Hackathon Registration</h1>
                  </div>
                  <div style="padding: 20px;">
                    <p>Hello <b>${instructor.name}</b>,</p>
                    <p>A new student has registered for your hackathon: <b>${hackathon.title}</b>.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <h3>Registration Details:</h3>
                    <ul>
                      <li><b>Student:</b> ${user.name} (${user.email})</li>
                      <li><b>Team Name:</b> ${teamName}</li>
                      <li><b>Team Size:</b> ${teamSize}</li>
                      <li><b>Project:</b> ${projectTitle || 'N/A'}</li>
                    </ul>
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/hackathon-instructor/applications" style="display: block; width: 200px; margin: 30px auto; padding: 12px; background: #4f46e5; color: white; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold;">View Registration</a>
                  </div>
                </div>
              </div>
            `
          });
        } catch (emailErr) {
          console.error('Failed to send hackathon registration email:', emailErr);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Successfully registered for hackathon',
      registration,
    });
  } catch (err) {
    console.error('Hackathon registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.fromEntries(
          Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
        ),
      });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's hackathon registrations
exports.getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;

    const registrations = await HackathonRegistration.find({ userId })
      .populate('hackathonId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      registrations,
    });
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is registered for a hackathon
exports.checkRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    const registration = await HackathonRegistration.findOne({
      userId,
      hackathonId,
    });

    res.json({
      success: true,
      isRegistered: !!registration,
      registration: registration || null,
    });
  } catch (err) {
    console.error('Check registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    const registration = await HackathonRegistration.findOneAndDelete({
      userId,
      hackathonId,
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (err) {
    console.error('Cancel registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get registrations for instructor
exports.getInstructorRegistrations = async (req, res) => {
  try {
    const instructorId = req.admin._id;

    // Find registrations where this instructor is assigned
    const registrations = await HackathonRegistration.find({ instructor: instructorId })
      .populate('userId', 'name email avatar')
      .populate('hackathonId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      registrations,
    });
  } catch (err) {
    console.error('Get instructor registrations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const registrationId = req.params.id;

    const registration = await HackathonRegistration.findById(registrationId)
      .populate('hackathonId', 'title')
      .populate('userId', 'name email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    await registration.save();

    // Notify Student
    await Notification.create({
      recipient: registration.userId._id,
      recipientType: 'User',
      title: `Hackathon Update: ${registration.hackathonId.title}`,
      message: `Your registration for "${registration.hackathonId.title}" has been updated to: ${status}${message ? `. Message: ${message}` : ''}`,
      type: 'general',
      relatedId: registration.hackathonId._id,
    });

    // Email Notification to Student
    try {
      await sendEmail({
        to: registration.userId.email,
        subject: `Update on your Hackathon registration: ${registration.hackathonId.title}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f0fdf4;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    <div style="background: ${status === 'rejected' ? '#f43f5e' : '#10b981'}; padding: 25px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Hackathon Status Update</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px;">Hi <b>${registration.userId.name}</b>,</p>
                        <p style="font-size: 15px; line-height: 1.6;">There has been an update to your registration for <b>${registration.hackathonId.title}</b>.</p>
                        
                        <div style="margin: 25px 0; padding: 20px; background: #fdf2f8; border-left: 4px solid ${status === 'rejected' ? '#f43f5e' : '#10b981'}; border-radius: 4px;">
                            <p style="margin: 0; font-size: 12px; color: #be185d; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Current Registration Status</p>
                            <p style="margin: 5px 0 0; font-size: 18px; color: #831843; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                            ${message ? `<p style="margin: 15px 0 0; font-size: 14px; color: #475569; border-top: 1px dashed #f9a8d4; pt-15"><b>Instructor Feedback:</b><br/>${message}</p>` : ''}
                        </div>

                        <p style="font-size: 14px; color: #64748b;">Get ready to code! Check your dashboard for next steps and hackathon resources.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/hackathons" style="display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View Hackathons</a>
                        </div>
                    </div>
                </div>
            </div>
        `
      });
    } catch (emailErr) {
      console.error('Failed to send hackathon status email:', emailErr);
    }

    res.json({ success: true, registration });
  } catch (err) {
    console.error('Update hackathon status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete registration by instructor/admin
exports.deleteRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;

    const registration = await HackathonRegistration.findById(registrationId)
      .populate('hackathonId', 'title')
      .populate('userId', 'name email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Email Notification to Student before deletion
    try {
      if (registration.userId && registration.userId.email) {
        await sendEmail({
          to: registration.userId.email,
          subject: `Registration Cancelled: ${registration.hackathonId.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #fff1f2;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="background: #e11d48; padding: 25px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Registration Update</h1>
                </div>
                <div style="padding: 30px;">
                  <p style="font-size: 16px;">Hi <b>${registration.userId.name}</b>,</p>
                  <p style="font-size: 15px; line-height: 1.6;">Your registration for the hackathon <b>${registration.hackathonId.title}</b> has been removed by the organizer or administrator.</p>
                  
                  <div style="margin: 25px 0; padding: 20px; background: #fff1f2; border-left: 4px solid #e11d48; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #9f1239; font-weight: bold;">Status: REMOVED / CANCELLED</p>
                    <p style="margin: 10px 0 0; font-size: 13px; color: #4b5563;">If you believe this is a mistake, please contact support or the hackathon organizer.</p>
                  </div>

                  <p style="font-size: 14px; color: #64748b;">You can browse other hackathons and register for upcoming events on our platform.</p>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/hackathons" style="display: inline-block; padding: 12px 30px; background: #e11d48; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse Events</a>
                  </div>
                </div>
              </div>
            </div>
          `
        });
      }
    } catch (emailErr) {
      console.error('Failed to send hackathon deletion email:', emailErr);
    }

    await HackathonRegistration.findByIdAndDelete(registrationId);

    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (err) {
    console.error('Delete hackathon registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
