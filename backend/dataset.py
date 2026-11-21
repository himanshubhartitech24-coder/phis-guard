"""
Synthetic & Curated Training Dataset for PhishGuard ML Model.
Contains diverse, realistic phishing, suspicious, and legitimate email samples.
"""

TRAINING_DATA = [
    # ==================== PHISHING SAMPLES ====================
    {
        "text": "URGENT: Your PayPal account has been temporarily restricted due to unauthorized login attempts. You must confirm your identity within 24 hours or your account will be permanently closed. Click here immediately to verify your credentials: http://paypal-security-update-center.com/login?token=8923",
        "label": "phishing"
    },
    {
        "text": "Final Warning: Your Microsoft Office 365 license has expired. All your OneDrive files and Outlook emails will be deleted today. Update your billing information and re-enter your password now: http://192.168.1.105/ms-office/login.php",
        "label": "phishing"
    },
    {
        "text": "Security Alert from Bank of America: A wire transfer of $4,850.00 was requested from your checking account. If this was not you, cancel the transaction immediately by providing your online banking credentials and OTP pin: http://boa-secure-verify.xyz/auth",
        "label": "phishing"
    },
    {
        "text": "HR Department Notice: Immediate action required. Due to mandatory policy changes, all employees must review the attached severance and compensation guidelines. Sign in with your corporate email password: http://tinyurl.com/hr-portal-login-secure",
        "label": "phishing"
    },
    {
        "text": "From: CEO <executive-office@company-corp-secure.top>\nSubject: Quick wire transfer needed ASAP\nAre you at your desk? I am in a board meeting and cannot take calls. I need you to immediately process a confidential wire transfer of $24,500 to our vendor. Reply with your cell number.",
        "label": "phishing"
    },
    {
        "text": "IRS Official Notification: You have an unclaimed tax refund of $1,420.50 pending deposit. Submit your Social Security Number, bank account details, and full name to claim your tax return now: http://irs-gov-refund-portal.club/claim",
        "label": "phishing"
    },
    {
        "text": "FedEx Delivery Notification: Your package delivery tracking #US94827104 was suspended because of an incorrect shipping address. Pay the redelivery fee of $2.99 and update your card details here: http://fedex-redelivery-address.online/pay",
        "label": "phishing"
    },
    {
        "text": "Coinbase Alert: Unusual withdrawal detected from IP 84.17.45.192. 1.25 BTC ($82,000) will be transferred in 15 minutes. To cancel this withdrawal, verify your private recovery seed phrase immediately at http://coinbase-auth-resolve.ru/restore",
        "label": "phishing"
    },
    {
        "text": "Netflix Membership Suspended: We were unable to process your monthly subscription payment. Update your credit card and billing address immediately to avoid service termination: http://netflix-billing-recovery.site/login",
        "label": "phishing"
    },
    {
        "text": "Google Workspace Security: Critical security vulnerability detected on your account. Someone in Russia tried to access your emails. Enter your current password and phone verification code to secure your account: http://google-support-accounts.top/auth",
        "label": "phishing"
    },
    {
        "text": "DHL Express: Urgent! Customs clearance clearance failure for shipment #DH-8849201. Please download the payment slip and enter your credit card information to release your parcel: http://dhl-express-track-customs.cc/invoice",
        "label": "phishing"
    },
    {
        "text": "DocuSign: CEO has sent you an urgent contract 'Confidential Acquisition NDA.pdf' to review and sign. View document now by authenticating your corporate credentials: http://docusign-envelope-review.info/sign?doc=992",
        "label": "phishing"
    },
    {
        "text": "Amazon Customer Support: Your Amazon prime account has been flagged for fraudulent purchases (Order #402-998271-92). Call our urgent fraud hotline or log in to confirm your identity: http://amazon-account-support-center.xyz",
        "label": "phishing"
    },
    {
        "text": "Meta Facebook Security: Your business page will be deleted in 48 hours due to trademark and copyright violations. If you think this is a mistake, appeal the decision by submitting your Facebook login password: http://meta-copyright-appeal.buzz",
        "label": "phishing"
    },
    {
        "text": "Apple ID Security: Your Apple ID has been locked for security reasons. To unlock, verify your identity and enter your Apple ID password and credit card details: http://apple-id-manage-icloud.icu/verify",
        "label": "phishing"
    },
    {
        "text": "You have won $2,500,000 USD in the European International Mega Lottery! To claim your cash prize, send your full name, passport scan, and $150 processing fee via Western Union or Bitcoin wallet.",
        "label": "phishing"
    },
    {
        "text": "IT Helpdesk Urgent Notice: We are migrating all staff email accounts to the new Exchange cloud server tonight. Failure to validate your username and password will result in total loss of mailbox access. Click: http://it-helpdesk-exchange-migration.top",
        "label": "phishing"
    },
    {
        "text": "Wells Fargo Alert: Suspicious debit card activity detected at Target #4912 for $720.00. Lock your card or dispute this charge immediately by providing your card number, CVV, and PIN code: http://wellsfargo-fraud-prevention.work/verify",
        "label": "phishing"
    },

    # ==================== SUSPICIOUS SAMPLES ====================
    {
        "text": "Subject: Invoice #88291 Overdue Reminder\nDear Customer, Attached is your outstanding invoice from last month. Please review the details and remit payment to avoid late penalties. If you have questions, click our customer portal: http://invoice-viewer-redirect.net/pay?id=88291",
        "label": "suspicious"
    },
    {
        "text": "Hey, are you free for a quick call this afternoon? We have an exciting business partnership proposal that could triple your company's revenue. View our presentation pitch deck here: http://bit.ly/3X9vQpL",
        "label": "suspicious"
    },
    {
        "text": "Notification: You have 1 unread secure message waiting from Healthcare Provider Portal. The link will expire in 3 days. Access your patient records at: http://health-portal-msg.click/read",
        "label": "suspicious"
    },
    {
        "text": "Action required regarding your domain registration. Your domain expiration date is approaching soon. Renew your domain name now to prevent downtime: http://cheap-domain-renewals.biz/cart?domain=phishguard.io",
        "label": "suspicious"
    },
    {
        "text": "Job Offer: Remote Data Entry Specialist position available. Salary $45/hour. No prior experience required. Flexible working hours. Kindly reply with your resume, phone number, and current home address to start immediately.",
        "label": "suspicious"
    },
    {
        "text": "Unclaimed inheritance fund: I am Barrister David Morgan, legal representative of a deceased foreign diplomat who left $18.5M in an offshore escrow account. Please contact me confidentially at davidmorgan_law@consultant.com.",
        "label": "suspicious"
    },
    {
        "text": "Exclusive discount: You have been selected for an 85% discount on top brand watches and electronics. Limited stock remaining. Click here to claim your coupon voucher before it expires: http://daily-super-deals.shop/promo",
        "label": "suspicious"
    },
    {
        "text": "Software Update: A new patch for Zoom Client is available. Please download and install the update executable from our mirror server: http://104.21.32.89/downloads/zoom-client-patch.exe",
        "label": "suspicious"
    },
    {
        "text": "Your survey invitation: Participate in our 3-minute consumer opinion survey and receive an Amazon $50 digital gift card code. Click to begin: http://survey-rewards-claim.club/start",
        "label": "suspicious"
    },
    {
        "text": "Webinar registration confirmed: 'Maximizing SaaS Margins in 2026'. Click here to add to your calendar or check the speaker roster: http://event-track-hub.link/attendees?id=49",
        "label": "suspicious"
    },
    {
        "text": "Greetings, We noticed your website has SEO indexing errors that are hurting your Google rankings. We can provide a comprehensive audit report. Let us know if you want us to send the PDF audit.",
        "label": "suspicious"
    },

    # ==================== SAFE / LEGITIMATE SAMPLES ====================
    {
        "text": "Subject: Sprint Planning & Retrospective Agenda - Nov 24\nHi team, Hope everyone had a great weekend. Please find the agenda for tomorrow's sprint planning meeting attached. We will review the Q4 sprint backlog, discuss sprint velocity, and finalize story points for the authentication service redesign. See you at 10:00 AM on Google Meet: https://meet.google.com/abc-defg-hij",
        "label": "safe"
    },
    {
        "text": "Subject: GitHub: [company/api-gateway] Pull Request #142 Merged\nUser @sarah-dev has merged pull request #142 into main: 'feat: add rate limiting middleware for public endpoints'. View changes and CI test runs at https://github.com/company/api-gateway/pull/142",
        "label": "safe"
    },
    {
        "text": "Subject: Your Amazon.com order #112-9847123-49124 has shipped\nHi Alex, Your order containing 'Logitech MX Master 3S Wireless Mouse' has been shipped via UPS. Estimated delivery date: Wednesday, Nov 25. Track your package anytime in your Amazon mobile app or at https://www.amazon.com/your-orders",
        "label": "safe"
    },
    {
        "text": "Subject: Quarterly Town Hall Meeting Recording & Slides\nDear Colleagues, Thank you for joining today's all-hands town hall. The presentation deck and recording are now uploaded to our internal Confluence wiki at https://confluence.corp.internal/townhall-q4. Please submit your questions for next month's AMA in the Slack #general channel.",
        "label": "safe"
    },
    {
        "text": "Subject: Stripe Receipt: Payment of $49.00 for GitHub Team\nThank you for your payment to GitHub, Inc. This receipt confirms your subscription payment for the billing period of Nov 20 to Dec 20. You can view or download your invoice PDF at https://dashboard.stripe.com/receipts/acct_192847",
        "label": "safe"
    },
    {
        "text": "Subject: Security Notice: New login from Chrome on macOS\nAlex, We noticed a new sign-in to your Google Account from a Mac in San Francisco, CA. If this was you, you don't need to do anything. If this wasn't you, review your devices in your Google Account Security Dashboard at https://myaccount.google.com/security",
        "label": "safe"
    },
    {
        "text": "Subject: Lunch and Learn: Introduction to Machine Learning in Cybersecurity\nHi everyone, Join us this Thursday at 12:30 PM in the 4th-floor cafeteria for our monthly Lunch & Learn session. Our senior security engineer Marcus will talk about TF-IDF text vectorization and heuristic threat detection. RSVP on the calendar invite.",
        "label": "safe"
    },
    {
        "text": "Subject: Cloudflare Weekly Performance Digest\nHi Alex, Here is your weekly traffic summary for domain example.com. Total requests served: 1,420,910 (99.8% cache hit ratio). Blocked threats: 342. Peak bandwidth: 45 Mbps. Access your analytics dashboard at https://dash.cloudflare.com",
        "label": "safe"
    },
    {
        "text": "Subject: Invitation: Coffee catch up @ Tue Nov 25, 2026 3pm - 3:30pm (EST)\nHi Alex, Let's catch up on the design system migration and token variables. Looking forward to our chat. Location: Philz Coffee / Google Meet.",
        "label": "safe"
    },
    {
        "text": "Subject: Figma: Elena commented on 'PhishGuard UX Prototype v2'\nElena left a comment on frame 'Risk Gauge Dashboard': 'Love the dark cybersecurity neon aesthetics! Let's ensure the contrast ratio meets WCAG AAA standards.' Reply directly in Figma at https://www.figma.com/file/x92ks1",
        "label": "safe"
    },
    {
        "text": "Subject: Jira Service Desk: Ticket #SEC-4091 Resolved\nYour request regarding 'Request for developer staging VPN credentials' has been completed by IT Systems Admin Dave. If you need further assistance, reply to this ticket directly.",
        "label": "safe"
    },
    {
        "text": "Subject: Monthly Newsletter: Engineering at Scale - Issue #42\nWelcome to this month's newsletter. In this issue: distributed consensus algorithms, optimizing SQLite read replicas in edge environments, and modern frontend state management with React 18.",
        "label": "safe"
    }
]
