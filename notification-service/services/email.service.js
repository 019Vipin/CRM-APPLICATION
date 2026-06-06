const nodemailer = require("nodemailer");

/**
 * Creates a transporter using environment config.
 * Falls back to Ethereal (test) SMTP if no real config is provided.
 */
const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port: parseInt(port) || 587,
            secure: parseInt(port) === 465,
            auth: { user, pass }
        });
    }

    // Development fallback: log to console instead
    return null;
};

/**
 * Sends an email notification.
 * If no SMTP config is set, logs the email to console (simulated send).
 */
exports.sendEmail = async ({ to, subject, body }) => {
    const transporter = createTransporter();

    if (!transporter) {
        // Simulated send in dev mode
        console.log("\n========== [EMAIL SIMULATED] ==========");
        console.log(`  TO:      ${to}`);
        console.log(`  SUBJECT: ${subject}`);
        console.log(`  BODY:    ${body}`);
        console.log("========================================\n");
        return { messageId: "simulated-" + Date.now() };
    }

    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"CRM System" <no-reply@crm.app>',
        to,
        subject,
        text: body
    });

    console.log("Email sent:", info.messageId);
    return info;
};

/**
 * Build email subject and body based on event type
 */
exports.buildEmailContent = (event) => {
    const { eventType, ticketId } = event;

    const templates = {
        TICKET_CREATED: {
            subject: `[CRM] New Ticket Created: ${ticketId}`,
            body: `A new support ticket (${ticketId}) has been created. Our team will review it shortly.`
        },
        TICKET_ASSIGNED: {
            subject: `[CRM] Ticket Assigned to You: ${ticketId}`,
            body: `Ticket ${ticketId} has been assigned to you. Please log in to the CRM portal to review and action it.`
        },
        TICKET_UPDATED: {
            subject: `[CRM] Ticket Updated: ${ticketId}`,
            body: `Ticket ${ticketId} has been updated. Please log in to the CRM portal to view the latest changes.`
        },
        TICKET_RESOLVED: {
            subject: `[CRM] Your Ticket Has Been Resolved: ${ticketId}`,
            body: `Good news! Your support ticket (${ticketId}) has been resolved. Please log in to review the resolution.`
        },
        TICKET_CLOSED: {
            subject: `[CRM] Ticket Closed: ${ticketId}`,
            body: `Your support ticket (${ticketId}) has been closed. Thank you for using our support service.`
        }
    };

    return templates[eventType] || {
        subject: `[CRM] Ticket Update: ${ticketId}`,
        body: `There is an update on ticket ${ticketId}. Please log in to the CRM portal.`
    };
};
