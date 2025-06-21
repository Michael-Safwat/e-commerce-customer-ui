import emailjs from '@emailjs/browser';

// Frontend Email Service using EmailJS
// This service handles sending emails from the frontend

export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
}

class EmailService {
  // EmailJS configuration
  // You'll need to replace these with your actual EmailJS credentials
  private readonly SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
  private readonly TEMPLATE_ID_PASSWORD_RESET = 'YOUR_PASSWORD_RESET_TEMPLATE_ID'; // Replace with your template ID
  private readonly TEMPLATE_ID_VERIFICATION = 'YOUR_VERIFICATION_TEMPLATE_ID'; // Replace with your template ID
  private readonly PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // For now, we'll simulate email sending until you provide EmailJS credentials
      console.log('Email would be sent via EmailJS:', {
        to: emailData.to,
        subject: emailData.subject,
        content: emailData.htmlContent
      });
      
      // Uncomment this code once you have your EmailJS credentials:
      /*
      const response = await emailjs.send(
        this.SERVICE_ID,
        'template_id', // You'll need to create templates in EmailJS
        {
          to_email: emailData.to,
          subject: emailData.subject,
          message: emailData.htmlContent,
          from_email: 'ecommerceapp2025@gmail.com'
        },
        this.PUBLIC_KEY
      );
      
      return response.status === 200;
      */
      
      // Simulate success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(toEmail: string, name: string, resetToken: string): Promise<boolean> {
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Dear ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 2 hours.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Thanks,<br>The E-Commerce Team</p>
      </div>
    `;

    return this.sendEmail({
      to: toEmail,
      subject: 'Reset Your Password',
      htmlContent: htmlContent
    });
  }

  async sendVerificationEmail(toEmail: string, name: string, verificationToken: string): Promise<boolean> {
    const verifyLink = `${window.location.origin}/users/verify?token=${verificationToken}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Dear ${name},</p>
        <p>Please click the button below to verify your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Account
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
        <p>If you did not register, please ignore this email.</p>
        <p>Thanks,<br>The E-Commerce Team</p>
      </div>
    `;

    return this.sendEmail({
      to: toEmail,
      subject: 'Verify Your Email',
      htmlContent: htmlContent
    });
  }
}

export const emailService = new EmailService(); 