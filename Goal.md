Autonomous Coding Agent Prompt 

React Native + Expo Mobile App — Website-to-App Conversion 

1. Project Objective 

Build a production-quality React Native Android application using Expo based on the target website provided below. 

The immediate objective is NOT to connect to or depend on the existing website backend. 

The objective is to create a fully functional, polished mobile-app prototype/MVP that can be demonstrated to the website/brand owner. 

If the owner approves the application, the project should then be architected so that the mobile app can be connected to their actual backend—whether that backend is: 

WordPress / WooCommerce 

Laravel 

Node.js 

PHP 

Custom REST API 

GraphQL API 

Any other backend/API architecture 

The app must therefore be developed with a backend-agnostic architecture wherever practical. 

 

2. Target Website 

Target Website: 

[https://oneummahbd.shop/] 

Treat the website as the primary source of truth for understanding: 

Brand identity 

Products/services 

Content 

Navigation 

User journeys 

Business logic visible to customers 

Features 

Categories 

Search 

Filtering 

Checkout/order flows 

Customer account functionality 

Promotions 

Forms 

Contact information 

Policies 

Images/media 

Icons 

Typography 

Color system 

Layout patterns 

Other customer-facing functionality 

 

3. Core Mission 

Work autonomously through the following continuous development loop: 

Understand → Research → Extract → Audit → Architect → Implement → Test → Review → Improve → Document 

Continue this loop until the application reaches a level where it can realistically be: 

Demonstrated to the website owner. 

Used as a convincing functional prototype. 

Evaluated for commercial development. 

Extended into a production application after backend/API integration. 

Do not stop after creating a few screens. 

The target is a functional application, not a static UI mockup. 

 

4. Phase 1 — Understand the Brand 

Before implementing the application, thoroughly analyze the target website. 

Determine: 

Brand 

Brand positioning 

Target audience 

Brand personality 

Visual identity 

Logo usage 

Primary/secondary colors 

Typography 

Iconography 

Photography/image style 

Tone of voice 

Design patterns 

Business 

Understand: 

What the business sells/provides 

Main customer journeys 

Primary conversion goals 

Product/service structure 

Customer account requirements 

Ordering/purchasing process 

Promotions 

Customer support 

Business-specific workflows 

Document all findings. 

Create: 

docs/brand-analysis.md 

 

5. Phase 2 — Website Intelligence & Data Extraction 

Systematically inspect the target website and collect as much relevant information as possible. 

Identify and document: 

Pages 

Routes 

Navigation 

Header 

Footer 

Menus 

Categories 

Products/services 

Product/service details 

Images 

Videos 

Banners 

Promotions 

Forms 

Search 

Filters 

Sorting 

Authentication 

Account functionality 

Cart 

Checkout 

Orders 

Wishlist/favorites 

Reviews 

Contact mechanisms 

FAQs 

Policies 

Notifications 

Any other customer-facing functionality 

Do not blindly copy the website. 

Instead, determine: 

What should exist in a mobile experience? 

Create: 

docs/website-feature-inventory.md 

Use a feature matrix: 

Website Feature 

Mobile Equivalent 

Priority 

Prototype Status 

Backend Dependency 

Example 

Example 

High 

Planned 

Yes 

Example 

Example 

Medium 

Implemented 

No 

 

6. Phase 3 — Mobile UX Transformation 

Do not simply reproduce the website inside React Native. 

Convert the website experience into a modern native mobile experience. 

Analyze: 

Mobile navigation 

Bottom tabs 

Navigation stack 

Gestures 

Touch targets 

Mobile-first layouts 

Loading states 

Empty states 

Error states 

Offline states 

Pull-to-refresh 

Modals 

Bottom sheets 

Mobile forms 

Search experience 

Product/service discovery 

Checkout flow 

Account experience 

The final application should feel like a real Android application, not a website wrapped in a mobile container. 

 

7. Phase 4 — Technical Architecture 

Use: 

React Native 

Expo 

TypeScript 

Expo Router where appropriate 

Modern React patterns 

Modular architecture 

Reusable components 

Feature-based organization 

Proper state management 

Proper API abstraction 

Environment configuration 

The architecture must allow the backend to be replaced or connected later without rewriting the entire application. 

Backend abstraction 

Create a clear service/API layer such as: 

src/ 
├── app/ 
├── components/ 
├── features/ 
├── screens/ 
├── navigation/ 
├── services/ 
│   ├── api/ 
│   ├── auth/ 
│   ├── products/ 
│   ├── orders/ 
│   └── users/ 
├── hooks/ 
├── store/ 
├── types/ 
├── utils/ 
├── constants/ 
├── config/ 
└── assets/ 
 

Adapt this structure if a better architecture is identified. 

Avoid tightly coupling UI components directly to backend implementation details. 

 

8. Authentication 

Implement the authentication architecture required for the future production application. 

The prototype should support the following flows: 

Google Authentication 

Google sign-in 

Account creation 

Login state 

Logout 

Session handling 

Error handling 

Facebook Authentication 

Facebook sign-in 

Account creation 

Login state 

Logout 

Session handling 

Error handling 

OTP Authentication 

Implement the UX and architecture for: 

Phone/email input 

OTP request 

OTP verification 

Resend OTP 

Countdown 

Invalid OTP handling 

Expired OTP handling 

Loading states 

Authentication state 

Where real credentials/backend services are unavailable, create a clean mock/service abstraction rather than hard-coding fake production logic into the UI. 

Document exactly what will need to be connected when the real backend becomes available. 

 

9. Customer Account 

Implement a complete customer-facing account experience where applicable. 

Potential features include: 

Profile 

Edit profile 

Authentication status 

Addresses 

Orders 

Order details 

Wishlist/favorites 

Saved preferences 

Logout 

Account deletion/request flow 

Notifications 

Support/contact 

AI Chat Assistant 

Only implement features that are relevant to the target business after researching the website. 

 

10. Admin Panel 

Create an admin interface inside the application architecture, but it must NOT be visible through the normal customer navigation. 

Admin access must require authentication/authorization. 

The customer should never see: 

Admin navigation 

Admin buttons 

Admin routes 

Admin dashboards 

Admin controls 

unless the authenticated account has the appropriate admin role. 

The admin architecture should be prepared for future backend integration. 

Potential admin functionality: 

Dashboard 

Product/service management 

Categories 

Orders 

Customers 

Promotions 

Content 

Notifications 

Analytics 

Settings 

Do not implement unnecessary admin features simply for the sake of completeness. Determine the required scope from the business. 

 

11. UI/UX Requirements 

The UI must be: 

Brand-specific 

Modern 

Professional 

Android-friendly 

Mobile-first 

Accessible 

Consistent 

Responsive 

Fast 

Intuitive 

Do not use generic templates unless they are substantially adapted to the brand. 

Create a reusable design system containing: 

Colors 

Typography 

Spacing 

Border radius 

Shadows/elevation 

Buttons 

Inputs 

Cards 

Product/service components 

Navigation 

Modals 

Bottom sheets 

Loading indicators 

Empty states 

Error states 

Create: 

docs/design-system.md 

 

12. UI/UX Audit 

Continuously audit the application for: 

Visual Quality 

Alignment 

Spacing 

Typography 

Color consistency 

Component consistency 

Visual hierarchy 

Image quality 

Icon consistency 

UX 

Navigation clarity 

Number of taps 

Form usability 

Error recovery 

Loading experience 

Empty states 

Accessibility 

Touch target size 

Back navigation 

Keyboard behavior 

Android 

Check: 

Android navigation behavior 

Safe areas 

Status bar 

Keyboard handling 

Permissions 

Back button 

Screen sizes 

Performance 

Android conventions 

Document findings in: 

docs/ui-ux-audit.md 

 

13. Feature Audit 

After the initial implementation, compare: 

Website → Feature Inventory → Mobile App 

Identify: 

Missing features 

Partially implemented features 

Broken features 

Features that should not exist on mobile 

Features requiring backend integration 

Features requiring third-party services 

Future opportunities 

Maintain: 

docs/feature-gap-analysis.md 

 

14. Performance Audit 

Continuously inspect: 

Unnecessary renders 

Large images 

Image optimization 

Bundle size 

Navigation performance 

Memory usage 

API request duplication 

Caching 

List rendering 

FlatList/FlashList usage where appropriate 

Startup time 

Loading states 

Fix issues rather than merely documenting them. 

 

15. Security Audit 

Review: 

Authentication 

Authorization 

Token handling 

Secure storage 

Sensitive data exposure 

Environment variables 

API keys 

Admin access 

Client-side permissions 

Deep links 

Input validation 

Never place secrets directly in source code. 

Create: 

docs/security-audit.md 

 

16. Backend Integration Readiness 

The application must be designed so that the prototype can later connect to an actual backend. 

Do NOT assume the backend will be WordPress. 

Create an abstraction that can accommodate: 

REST API 
GraphQL 
WordPress 
WooCommerce 
Laravel 
Node.js 
Custom backend 
 

Document the expected API contracts. 

Example: 

Authentication 
GET    /products 
GET    /products/:id 
GET    /categories 
POST   /cart 
POST   /orders 
GET    /orders 
GET    /profile 
PUT    /profile 
 

These are examples only. 

Derive the actual API requirements from the application's features. 

Create: 

docs/backend-integration-plan.md 

 

17. Mock Data Strategy 

Until the real backend is available: 

Use realistic mock data. 

Keep mock data separate from UI components. 

Build services/interfaces around the mock data. 

Ensure replacing mock services with real API services is straightforward. 

Do not spread hard-coded mock data throughout the application. 

 

18. Testing 

Implement and run appropriate tests. 

At minimum, test: 

Functional 

App launch 

Navigation 

Authentication flows 

Product/service browsing 

Search 

Filtering 

Cart/order flow where applicable 

Profile 

Logout 

Admin authorization 

UI 

Different screen sizes 

Keyboard 

Loading 

Empty 

Error 

Offline 

Long text 

Missing images 

Code 

TypeScript errors 

Linting 

Build errors 

Runtime errors 

Fix discovered problems. 

Do not simply report them. 

 

19. Agentic Documentation 

Maintain documentation throughout development. 

At minimum: 

docs/ 
├── README.md 
├── brand-analysis.md 
├── website-feature-inventory.md 
├── design-system.md 
├── architecture.md 
├── feature-gap-analysis.md 
├── ui-ux-audit.md 
├── security-audit.md 
├── performance-audit.md 
├── backend-integration-plan.md 
├── testing.md 
├── roadmap.md 
└── development-log.md 
 

Development Log 

For every major iteration document: 

What was investigated 

What was discovered 

What was implemented 

What was changed 

Why the change was made 

What remains 

What should be investigated next 

This documentation should allow another developer or AI agent to continue the project without losing context. 

 

20. Day-by-Day Improvement Loop 

For each development cycle: 

Step 1 — Inspect 

Inspect the current codebase and application state. 

Step 2 — Research 

Research the website, brand, UX and relevant technical requirements. 

Step 3 — Audit 

Identify the highest-impact problems. 

Step 4 — Prioritize 

Prioritize: 

Broken functionality 

Missing core features 

UX problems 

Visual inconsistencies 

Performance 

Security 

Code quality 

Nice-to-have improvements 

Step 5 — Implement 

Implement the highest-priority improvements. 

Step 6 — Test 

Test the changes. 

Step 7 — Review 

Review the entire affected area again. 

Step 8 — Document 

Update the appropriate documentation. 

Step 9 — Repeat 

Continue until the app reaches showcase quality. 

 

21. Code Quality Requirements 

Write code that is: 

Modular 

Reusable 

Readable 

Maintainable 

Typed 

Testable 

Documented where necessary 

Avoid: 

Huge components 

Duplicate code 

Hard-coded business logic 

Hard-coded credentials 

Unnecessary dependencies 

Dead code 

Temporary hacks 

Tight backend coupling 

Over-engineering 

Prefer simple, scalable solutions. 

 

22. Showcase Requirements 

Before declaring the project complete, perform a Showcase Readiness Audit. 

The application should have: 

Polished onboarding/login 

Working navigation 

Realistic content 

Functional primary customer journey 

Professional UI 

Brand-consistent visuals 

Loading states 

Error states 

Empty states 

Authentication demonstration 

Customer account 

Appropriate admin demonstration 

No obvious placeholder content 

No obvious broken screens 

No debug UI 

No unnecessary console errors 

The application should be convincing enough to demonstrate: 

"This is what your business could have as a dedicated Android application." 

 

23. Commercial Development Readiness 

After reaching showcase quality, produce a final assessment covering: 

Already Implemented 

List completed features. 

Backend Required 

List features requiring real backend/API integration. 

Third-Party Services Required 

Examples: 

Google authentication 

Facebook authentication 

OTP provider 

Payment gateway 

Push notifications 

Analytics 

Crash reporting 

Only list services actually required. 

Estimated Future Development 

Break future work into: 

Backend integration 

Authentication integration 

Data synchronization 

Production security 

Testing 

Deployment 

Play Store preparation 

Maintenance 

Recommended Development Roadmap 

Create: 

Phase 1 — Prototype 

Phase 2 — Backend Integration 

Phase 3 — Production Hardening 

Phase 4 — Launch 

Phase 5 — Maintenance & Continuous Improvement 

Document this in: 

docs/roadmap.md 

 

24. Important Agent Rules 

Rule 1 — Do Not Assume 

If something is unclear, inspect the website/codebase/data before making assumptions. 

Rule 2 — Do Not Stop at UI 

A collection of screens is not a finished application. 

Implement functional interactions and realistic application flows. 

Rule 3 — Do Not Overwrite Existing Work Blindly 

Inspect existing architecture before modifying it. 

Preserve good existing work. 

Rule 4 — Fix Problems 

When you identify a problem that is within the current scope, fix it instead of merely documenting it. 

Rule 5 — Keep Context 

Maintain documentation so future agents can understand the project without repeating the entire research process. 

Rule 6 — Backend Agnostic 

Do not design the entire application around an assumed backend technology. 

The backend may ultimately be: 

WordPress, WooCommerce, Laravel, Node.js, or another system. 

Rule 7 — Production Mindset 

Even though this is initially a prototype, write the code so that successful prototype features can evolve into production features. 

Rule 8 — Mobile First 

Optimize the experience for Android mobile users rather than reproducing the desktop website. 

Rule 9 — Brand First 

The application should clearly belong to the target brand. 

Do not make it look like a generic React Native template. 

Rule 10 — Continuous Audit 

Never assume that "implemented" means "finished." 

Continuously inspect: 

Functionality + UX + UI + Performance + Security + Architecture + Maintainability 

 

25. Definition of Done 

Do not declare the project complete until: 

Website has been researched 

Brand has been analyzed 

Feature inventory has been created 

Mobile UX has been designed 

Core application architecture is established 

Core customer journey works 

Authentication architecture exists 

Google Auth flow is prepared 

Facebook Auth flow is prepared 

OTP flow is prepared 

Customer account exists where applicable 

Admin architecture exists 

Admin is hidden from normal customers 

UI/UX audit completed 

Performance audit completed 

Security audit completed 

Feature gap analysis completed 

Backend integration plan completed 

Testing completed 

Major bugs fixed 

Documentation updated 

Showcase readiness audit completed 

Commercial development roadmap completed 

 

Final Objective 

Your ultimate goal is to transform the target website into a high-quality, functional React Native + Expo Android application prototype that demonstrates the business value of having a dedicated mobile application. 

The result should be good enough that the owner can see the application and reasonably say: 

"Yes, we want this built for our business." 

Build toward that standard continuously. 

Start by researching and auditing the target website before making major implementation decisions. 

 
