export const SAMPLE_EMAILS = [
  {
    id: "phish_paypal",
    category: "Phishing",
    title: "PayPal Account Restriction Notice",
    subject: "Urgent: Your PayPal account has been temporarily restricted",
    sender: "security@paypal-verification-alert.xyz",
    text: `URGENT SECURITY ALERT:

Your PayPal account has been temporarily restricted due to multiple unrecognized login attempts from an unauthorized device in Bucharest, Romania.

To safeguard your funds and prevent permanent account termination, you must confirm your identity within 24 hours.

Failure to validate your credentials will result in indefinite suspension of your account and pending transactions.

Click the link below immediately to verify your identity and restore access:
http://paypal-security-update-center.com/login?token=94821a

Do not ignore this warning.

Sincerely,
PayPal Security & Fraud Prevention Center`,
    highlights: ["Urgent Security Alert", "restricted", "confirm your identity within 24 hours", "permanent account termination", "http://paypal-security-update-center.com/login"]
  },
  {
    id: "phish_ms365",
    category: "Phishing",
    title: "Microsoft 365 License Expiration Scare",
    subject: "Final Warning: Office 365 License Expiring Today",
    sender: "no-reply@192.168.1.105",
    text: `Final Warning: Your Microsoft 365 Enterprise license has expired.

All cloud services, including your Outlook email inbox, Teams chat history, and OneDrive documents, will be permanently deleted tonight at 23:59 UTC.

To prevent critical data loss, update your corporate billing details and sign in with your Microsoft password immediately:
http://192.168.1.105/ms-office/login.php

Enter your corporate email and current password to re-validate your active directory session.

IT Cloud Infrastructure Operations`,
    highlights: ["Final Warning", "permanently deleted", "sign in with your Microsoft password", "http://192.168.1.105/ms-office/login.php"]
  },
  {
    id: "phish_ceo_wire",
    category: "Phishing",
    title: "CEO Executive Fraud (BEC Wire Transfer)",
    subject: "Confidential Wire Transfer Request - Urgent",
    sender: "ceo.office@corp-executive-hq.top",
    text: `Hi,

Are you at your desk right now?

I am currently in an executive board meeting and cannot take incoming calls. We are finalizing an urgent vendor acquisition agreement and need to process a confidential wire transfer of $28,500.00 today.

Please respond immediately to this email with your cell phone number so I can text you the beneficiary wire routing details.

Keep this transaction confidential until the announcement is made public.

Best regards,
Chief Executive Officer`,
    highlights: ["Are you at your desk", "cannot take incoming calls", "confidential wire transfer of $28,500.00", "respond immediately"]
  },
  {
    id: "phish_coinbase",
    category: "Phishing",
    title: "Cryptocurrency Unauthorized Withdrawal Alert",
    subject: "Coinbase: Unauthorized withdrawal of 1.45 BTC initiated",
    sender: "alert@coinbase-security-resolution.ru",
    text: `Coinbase Security Notification:

An unauthorized withdrawal request for 1.45 BTC ($96,250 USD) has been initiated from IP address 185.220.101.4 (Tor Exit Node).

If you did NOT authorize this transaction, cancel the withdrawal immediately within 15 minutes by entering your private recovery seed phrase and 2-step verification code at:
http://coinbase-auth-resolve.ru/restore?tx=99482

Failure to act will allow the blockchain transaction to confirm irreversibly.

Coinbase Asset Protection Team`,
    highlights: ["Unauthorized withdrawal", "cancel the withdrawal immediately within 15 minutes", "private recovery seed phrase", "http://coinbase-auth-resolve.ru/restore"]
  },
  {
    id: "suspicious_invoice",
    category: "Suspicious",
    title: "Overdue Generic Invoice with Tracking Link",
    subject: "Overdue Notice: Invoice #INV-2026-991",
    sender: "accounting@global-billing-services.net",
    text: `Dear Customer,

Please be advised that Invoice #INV-2026-991 issued on October 15 remains unpaid on your account.

Attached is your billing statement summary. Please remit payment promptly to avoid accruing late administrative fees.

To review the detailed line items and pay via credit card or ACH transfer, click here:
http://invoice-viewer-redirect.net/pay?id=88291

If you have already paid this invoice, please disregard this automated notification.

Customer Accounts Receivable`,
    highlights: ["Dear Customer", "remit payment promptly", "http://invoice-viewer-redirect.net/pay"]
  },
  {
    id: "suspicious_job",
    category: "Suspicious",
    title: "High-Paying Remote Job Offer Lure",
    subject: "Work From Home Opportunity: $50/hour Data Entry Specialist",
    sender: "recruiter@career-talent-portal.click",
    text: `Hello,

We came across your profile and were impressed by your background. We are actively hiring for an immediate Remote Data Entry / Administrative Specialist position.

Compensation: $50.00 / hour (20-30 hours per week, flexible schedule).
Equipment: Company MacBook Pro and $1,200 home office stipend provided upon enrollment.

To schedule your interview, please reply with your full legal name, current mobile number, and resume.

Best regards,
Global Talent Acquisition Team`,
    highlights: ["$50.00 / hour", "equipment provided", "reply with your full legal name, current mobile number"]
  },
  {
    id: "safe_sprint",
    category: "Safe",
    title: "Engineering Sprint Planning Meeting Agenda",
    subject: "Sprint Planning & Retrospective Agenda - Nov 24",
    sender: "marcus.chen@company.internal",
    text: `Hi team,

Hope everyone had a great weekend. Please find the agenda for tomorrow's sprint planning and retro meeting:

1. Review Q4 sprint velocity and remaining backlog items (20 min)
2. Retrospective on the authentication service migration (15 min)
3. Story point estimation for public API rate limiting (25 min)

Google Meet Link: https://meet.google.com/abc-defg-hij
Jira Board: https://company.atlassian.net/jira/software/projects/SEC/boards/1

Please ensure your task updates are logged before 9:30 AM tomorrow.

Best,
Marcus Chen
Lead Security Engineer`,
    highlights: ["Google Meet Link", "Jira Board", "Sprint velocity"]
  },
  {
    id: "safe_github",
    category: "Safe",
    title: "GitHub Pull Request Notification",
    subject: "GitHub: [phishguard/core] Pull Request #48 Merged",
    sender: "notifications@github.com",
    text: `User @elena-dev has merged pull request #48 into main:
'feat: implement calibrated risk scoring and SQLite persistence'

Changes:
+ 12 files changed, 842 insertions(+), 35 deletions(-)
+ All 8 unit tests passed on CI runner (macOS arm64).

View changes, inline diffs, and comments on GitHub:
https://github.com/phishguard/core/pull/48

You are receiving this because you are subscribed to this repository.`,
    highlights: ["merged pull request", "https://github.com/phishguard/core/pull/48"]
  },
  {
    id: "safe_stripe",
    category: "Safe",
    title: "Stripe Billing Receipt Confirmation",
    subject: "Receipt for Your Payment to Cloud Services Inc.",
    sender: "receipts@stripe.com",
    text: `Hi Alex,

This receipt confirms your monthly subscription payment of $49.00 to Cloud Services Inc.

Date: November 21, 2026
Payment Method: Visa ending in 4242
Invoice Number: 9482-1084

You can manage your billing preferences or download a PDF tax invoice anytime from your account dashboard:
https://dashboard.stripe.com/receipts/acct_192847

Thanks for your business!
The Stripe Team`,
    highlights: ["receipt confirms your monthly subscription", "https://dashboard.stripe.com/receipts"]
  }
];
