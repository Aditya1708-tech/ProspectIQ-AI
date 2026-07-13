# Templates for deterministic RM actions in ProspectIQ NBAIQ Engine.
# Strictly relationship management activities. No banking products are mentioned.

ACTION_TEMPLATES = {
  "Call Customer": {
    "title": "Call Customer",
    "description": "Initiate a direct relationship call to check client satisfaction and resolve minor queries.",
    "reason": "Routine touchpoint to sustain engagement and assess service quality.",
    "expectedDuration": "15 mins",
    "priority": "MEDIUM",
    "owner": "Relationship Manager",
    "sla": "48 Hours",
    "headline": "Conduct Client Engagement Call",
    "summary": "Touch base via phone to discuss satisfaction, log feedback, and identify potential support areas.",
    "checklist": [
      "Review customer profile",
      "Check recent transaction flags",
      "Log conversation outcomes in CRM"
    ],
    "talkingPoints": [
      "Ask how their recent transactions and digital banking experience have been.",
      "Inquire if they need any assistance with active banking profiles."
    ],
    "preparationNotes": [
      "Review last interaction notes to reference previous discussion points."
    ],
    "successCriteria": "Log client satisfaction status and update next interaction date."
  },
  "Schedule Meeting": {
    "title": "Schedule Meeting",
    "description": "Schedule a structured relationship meeting (virtual or face-to-face) to discuss long-term financial plans.",
    "reason": "High priority client touchpoint requested based on significant portfolio changes or urgency score.",
    "expectedDuration": "45 mins",
    "priority": "HIGH",
    "owner": "Relationship Manager",
    "sla": "24 Hours",
    "headline": "Book Client Relationship Meeting",
    "summary": "Arrange a direct discussion to review overall banking experience and alignment on goals.",
    "checklist": [
      "Review profile and recent interaction notes",
      "Draft customized relationship agenda",
      "Send meeting invite and confirm attendance"
    ],
    "talkingPoints": [
      "Acknowledge relationship loyalty and outline discussion agenda.",
      "Explore financial goals for the current fiscal year."
    ],
    "preparationNotes": [
      "Prepare standard branch agenda and ensure meeting room reservation if in-person."
    ],
    "successCriteria": "Confirm meeting schedule, record agenda, and send calendar invites."
  },
  "Relationship Review": {
    "title": "Relationship Review",
    "description": "Perform an in-depth relationship review, assessing client holdings, communication preferences, and active notes.",
    "reason": "Warranted for newly converted prospects or clients showing high growth potential.",
    "expectedDuration": "30 mins",
    "priority": "MEDIUM",
    "owner": "Relationship Manager",
    "sla": "7 Days",
    "headline": "Conduct In-Depth Relationship Review",
    "summary": "Analyze client segment suitability and verify RM coverage alignment.",
    "checklist": [
      "Verify contact preferences and preferred language",
      "Check profile completeness score",
      "Assess branch note history"
    ],
    "talkingPoints": [
      "Discuss preferred channels of contact and check if details are accurate.",
      "Ask for general feedback regarding relationship management coverage."
    ],
    "preparationNotes": [
      "Confirm preferred contact numbers and language preferences are updated in registry."
    ],
    "successCriteria": "Profile parameters verified and RM assignment certified."
  },
  "Portfolio Review": {
    "title": "Portfolio Review",
    "description": "Perform a holistic portfolio analysis examining asset balances, liquidity health, and overall wealth distribution.",
    "reason": "Wealth potential metrics suggest opportunity for rebalancing and structured capital management.",
    "expectedDuration": "40 mins",
    "priority": "HIGH",
    "owner": "Relationship Manager",
    "sla": "48 Hours",
    "headline": "Execute Comprehensive Portfolio Audit",
    "summary": "Assess balance distributions and trace transaction behavior to optimize relationship asset levels.",
    "checklist": [
      "Audit cash and savings balances",
      "Review current asset allocation ratios",
      "Check for redundant or inactive accounts"
    ],
    "talkingPoints": [
      "Discuss current balance allocations and inquire about future liquidity requirements.",
      "Review historical asset trends and check if current structure meets goals."
    ],
    "preparationNotes": [
      "Compile consolidated account balance sheet before calling."
    ],
    "successCriteria": "Record rebalancing suggestions and register customer response notes."
  },
  "Income Verification Follow-up": {
    "title": "Income Verification Follow-up",
    "description": "Contact the client to obtain updated income certificates or business ledger reports to verify risk parameters.",
    "reason": "Salary credits undetected or income stability score indicates variance, requiring documentation update.",
    "expectedDuration": "20 mins",
    "priority": "MEDIUM",
    "owner": "Relationship Manager",
    "sla": "3 Days",
    "headline": "Request Income Documentation Update",
    "summary": "Acquire current income proof to resolve profile data anomalies and align risk ratings.",
    "checklist": [
      "Identify missing income details or missing salary credit events",
      "Draft document request email with secure upload link",
      "Verify received documents upon upload"
    ],
    "talkingPoints": [
      "Explain the periodic requirement to verify income files for profile maintenance.",
      "Guide client on how to securely upload the documentation."
    ],
    "preparationNotes": [
      "Locate the specific transactions and gaps that triggered the verification request."
    ],
    "successCriteria": "Obtain updated documentation or verify incoming salary flow patterns."
  },
  "KYC Update Reminder": {
    "title": "KYC Update Reminder",
    "description": "Alert the client about pending KYC updates and collect identity and address proofs.",
    "reason": "TrustLayer flagged incomplete profile records or pending regulatory KYC deadlines.",
    "expectedDuration": "15 mins",
    "priority": "HIGH",
    "owner": "Operations Desk",
    "sla": "24 Hours",
    "headline": "Acquire Pending KYC Verification Documents",
    "summary": "Obtain valid identity/address credentials to prevent account constraints.",
    "checklist": [
      "Check specific KYC deficiencies (e.g. expired ID, missing signature)",
      "Initiate outreach via primary phone/email channels",
      "Submit updated documents to compliance system"
    ],
    "talkingPoints": [
      "Inform customer that KYC updates are required by regulatory guidelines to keep accounts fully active.",
      "Discuss convenient options for submitting proof documents."
    ],
    "preparationNotes": [
      "Identify the exact expired or missing KYC item from trust audit records."
    ],
    "successCriteria": "Collect KYC documents and submit to compliance verification queue."
  },
  "Dormancy Reactivation": {
    "title": "Dormancy Reactivation",
    "description": "Reach out to the customer to discuss account reactivation procedures and resolve operational bottlenecks.",
    "reason": "Account is marked as dormant or inactive, with zero transactional velocity in recent quarters.",
    "expectedDuration": "25 mins",
    "priority": "HIGH",
    "owner": "Operations Desk",
    "sla": "48 Hours",
    "headline": "Initiate Dormancy Reactivation Procedure",
    "summary": "Guide the dormant client through required transaction reactivation steps and verify account status.",
    "checklist": [
      "Review dormancy date and check historical transaction activity",
      "Prepare reactivation forms and guide customer through completion",
      "Process reactivation request in primary registry"
    ],
    "talkingPoints": [
      "Ask if there are specific operational reasons that led to reduced account activity.",
      "Explain the simple steps needed to restore full account status."
    ],
    "preparationNotes": [
      "Verify if any outstanding fees or incomplete documentation is blocking account usage."
    ],
    "successCriteria": "Log reactivation request and trigger verification deposit."
  },
  "Digital Engagement Follow-up": {
    "title": "Digital Engagement Follow-up",
    "description": "Contact the client to assist with digital service setup, including net banking, mobile app access, and UPI.",
    "reason": "Low digital adoption score and high cash dependency suggest opportunities to improve transaction convenience.",
    "expectedDuration": "20 mins",
    "priority": "LOW",
    "owner": "Relationship Manager",
    "sla": "7 Days",
    "headline": "Introduce Digital Banking Features",
    "summary": "Offer walkthroughs of digital channels to reduce branch dependency and improve transactional ease.",
    "checklist": [
      "Check which digital channels are currently inactive",
      "Send step-by-step registration guides",
      "Follow up to assist with first digital transaction"
    ],
    "talkingPoints": [
      "Highlight the convenience of tracking balances and transfer details via the mobile application.",
      "Offer secure, step-by-step assistance in setting up online profile access."
    ],
    "preparationNotes": [
      "Review latest digital platform updates and secure login protocols to guide the user."
    ],
    "successCriteria": "Confirm registration on mobile or online banking portal."
  },
  "Savings Trend Discussion": {
    "title": "Savings Trend Discussion",
    "description": "Host a goal-based cash flow review to analyze savings health and discuss budgeting parameters.",
    "reason": "Behavioral analytics indicate savings ratio declines or elevated cash withdrawals.",
    "expectedDuration": "30 mins",
    "priority": "MEDIUM",
    "owner": "Relationship Manager",
    "sla": "7 Days",
    "headline": "Discuss Cash Flow and Savings Trends",
    "summary": "Engage client on budgeting dynamics and balance preservation.",
    "checklist": [
      "Examine recent cash flow deficits and savings ratio changes",
      "Draft relationship talking points around balance volatility",
      "Log client savings objectives"
    ],
    "talkingPoints": [
      "Inquire if recent variations in cash reserves are temporary or planned allocations.",
      "Review strategies for maintaining stable balances."
    ],
    "preparationNotes": [
      "Generate monthly credit versus debit flow charts to highlight during discussions."
    ],
    "successCriteria": "Outline savings targets and log feedback on cash outflow drivers."
  },
  "Annual Financial Review": {
    "title": "Annual Financial Review",
    "description": "Conduct the annual relationship review to realign financial profiles and trace annual growth milestones.",
    "reason": "High wealth potential profile requires annual strategic relationship calibration.",
    "expectedDuration": "60 mins",
    "priority": "MEDIUM",
    "owner": "Relationship Manager",
    "sla": "30 Days",
    "headline": "Complete Annual Financial Alignment",
    "summary": "Review the full year of banking interactions, update risk profiles, and set next year's relationship targets.",
    "checklist": [
      "Compile annual transaction summaries and interaction history",
      "Assess changes in risk appetite and occupation stability",
      "Conduct in-depth review meeting and update records"
    ],
    "talkingPoints": [
      "Celebrate key milestones achieved during the year.",
      "Review whether active relationship parameters align with current goals."
    ],
    "preparationNotes": [
      "Request current asset allocation reports and compile the customer file."
    ],
    "successCriteria": "Update annual risk parameters and schedule next year's review bounds."
  },
  "Business Health Check": {
    "title": "Business Health Check",
    "description": "Review trade cash flow parameters, invoice clearing cycles, and seasonal working capital requirements.",
    "reason": "MSME category profile indicates high turnover volumes that warrant business-specific consultation.",
    "expectedDuration": "45 mins",
    "priority": "HIGH",
    "owner": "Relationship Manager",
    "sla": "3 Days",
    "headline": "Execute MSME Business Health Check",
    "summary": "Discuss invoice processing, merchant settlement velocity, and current business ledger trends.",
    "checklist": [
      "Review current account cash flows and GST transaction matching",
      "Examine seasonal dip trends in business ledger",
      "Document current credit line utilization"
    ],
    "talkingPoints": [
      "Inquire about recent supply chain or payment collection cycles.",
      "Discuss working capital patterns and trade services support."
    ],
    "preparationNotes": [
      "Analyze business credits history and merchant terminal records."
    ],
    "successCriteria": "Document business liquidity requirements and log working capital feedback."
  },
  "Quarterly Touchpoint": {
    "title": "Quarterly Touchpoint",
    "description": "Execute the standard quarterly relationship maintenance checkpoint call.",
    "reason": "Scheduled touchpoint to review status and keep communication channels open.",
    "expectedDuration": "15 mins",
    "priority": "LOW",
    "owner": "Relationship Manager",
    "sla": "30 Days",
    "headline": "Conduct Routine Quarterly Contact Check",
    "summary": "Touch base briefly to maintain active relationship connection and confirm records accuracy.",
    "checklist": [
      "Review recent branch notes and check for unresolved queries",
      "Initiate quarterly brief call",
      "Record any requests or feedback in database"
    ],
    "talkingPoints": [
      "Check if they have any active questions regarding their branch operations.",
      "Verify that contact and address records remain up to date."
    ],
    "preparationNotes": [
      "Quickly scan the interaction history from the previous quarter."
    ],
    "successCriteria": "Confirm client contact information is valid and log call notes."
  },
  "Customer Appreciation Call": {
    "title": "Customer Appreciation Call",
    "description": "Initiate a thank-you call to VIP clients to check relationship status and express appreciation.",
    "reason": "High savings health and active engagement scores warrant premium appreciation outreach.",
    "expectedDuration": "15 mins",
    "priority": "LOW",
    "owner": "Relationship Manager",
    "sla": "30 Days",
    "headline": "Conduct Relationship Appreciation Call",
    "summary": "Express relationship appreciation, discuss experience, and note premium requests.",
    "checklist": [
      "Review VIP status flags and loyalty benchmarks",
      "Initiate touchpoint to express appreciation",
      "Document any premium feedback or concerns"
    ],
    "talkingPoints": [
      "Thank them for their valued relationship trust.",
      "Ask if there are areas where we can further enhance their experience."
    ],
    "preparationNotes": [
      "Confirm loyalty indicators and verify that no active complaints are unresolved."
    ],
    "successCriteria": "Record feedback on premium services and reinforce relationship goodwill."
  },
  "Document Verification": {
    "title": "Document Verification",
    "description": "Review and verify uploaded customer documentation against operational databases.",
    "reason": "Newly uploaded client details or registry modifications require verification by operations.",
    "expectedDuration": "20 mins",
    "priority": "MEDIUM",
    "owner": "Operations Desk",
    "sla": "24 Hours",
    "headline": "Complete Pending Document Verification",
    "summary": "Verify registry profiles against uploaded identification or business certificates.",
    "checklist": [
      "Examine uploaded files for clarity and valid expiration dates",
      "Verify names and addresses against primary databases",
      "Clear status flags and notify Relationship Manager"
    ],
    "talkingPoints": [],
    "preparationNotes": [
      "Retrieve the specific uploaded documents from the operational queue."
    ],
    "successCriteria": "Complete verification registry update and archive files."
  },
  "No Immediate Action": {
    "title": "No Immediate Action",
    "description": "No active contact required. Monitor relationship telemetry for standard triggers.",
    "reason": "All data parameters are verified and priority indices remain within normal baseline bounds.",
    "expectedDuration": "0 mins",
    "priority": "LOW",
    "owner": "Relationship Manager",
    "sla": "Next Quarter",
    "headline": "Relationship Parameters Stable",
    "summary": "No proactive contact is necessary at this time. Maintain standard background monitoring.",
    "checklist": [],
    "talkingPoints": [],
    "preparationNotes": [],
    "successCriteria": "Standard monitors verified; baseline parameters within nominal range."
  }
}
