import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  const handleDownload = () => {
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>TechPrice - Project Documentation</title>
        <style>
          body { font-family: 'Calibri', sans-serif; margin: 40px; color: #1a1a2e; line-height: 1.6; }
          h1 { font-size: 28pt; color: #1a1a2e; border-bottom: 3px solid #6366f1; padding-bottom: 10px; text-align: center; }
          h2 { font-size: 20pt; color: #1a1a2e; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 30px; }
          h3 { font-size: 14pt; color: #4338ca; margin-top: 20px; }
          h4 { font-size: 12pt; color: #6366f1; }
          p, li { font-size: 11pt; }
          table { border-collapse: collapse; width: 100%; margin: 15px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 10pt; }
          th { background-color: #6366f1; color: white; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .cover-page { text-align: center; page-break-after: always; padding-top: 200px; }
          .cover-page h1 { font-size: 36pt; border: none; }
          .cover-page p { font-size: 14pt; color: #64748b; }
          .toc { page-break-after: always; }
          .toc a { text-decoration: none; color: #1a1a2e; }
          .toc li { margin: 8px 0; font-size: 12pt; }
          .page-break { page-break-before: always; }
          .diagram-box { border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; background: #f8fafc; font-family: 'Courier New', monospace; font-size: 9pt; white-space: pre; }
          .flow-box { display: inline-block; border: 2px solid #6366f1; border-radius: 8px; padding: 8px 16px; margin: 5px; background: #eef2ff; text-align: center; font-size: 10pt; }
          .arrow { display: inline-block; margin: 0 5px; font-size: 14pt; color: #6366f1; }
          .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
          ul { margin: 5px 0; }
          .section { margin-bottom: 25px; }
        </style>
      </head>
      <body>
        <!-- COVER PAGE -->
        <div class="cover-page">
          <h1>TechPrice</h1>
          <p style="font-size: 18pt; color: #6366f1; font-weight: bold;">Technology Price Comparison Platform</p>
          <br/><br/>
          <p><strong>Project Documentation</strong></p>
          <p>Version 1.0</p>
          <p>Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <br/><br/>
          <p style="font-size: 10pt; color: #94a3b8;">Prepared for Academic / Professional Review</p>
        </div>

        <!-- TABLE OF CONTENTS -->
        <div class="toc">
          <h1>Table of Contents</h1>
          <ol>
            <li>Introduction &amp; Project Overview</li>
            <li>Problem Statement &amp; Objectives</li>
            <li>Methodology</li>
            <li>System Architecture</li>
            <li>Database Design (ERD)</li>
            <li>System Flowcharts</li>
            <li>User Roles &amp; Access Control</li>
            <li>Key Features &amp; Modules</li>
            <li>Technology Stack</li>
            <li>Security Implementation</li>
            <li>Testing Strategy</li>
            <li>Deployment Architecture</li>
            <li>Future Enhancements</li>
            <li>Conclusion</li>
          </ol>
        </div>

        <!-- 1. INTRODUCTION -->
        <div class="page-break">
          <h2>1. Introduction &amp; Project Overview</h2>
          <p><strong>TechPrice</strong> is a full-stack web-based technology price comparison platform that enables customers to compare prices of technology products across multiple vendors in real-time. The platform serves three distinct user roles: <strong>Customers</strong>, <strong>Vendors</strong>, and <strong>Administrators</strong>.</p>
          <p>The platform addresses the growing need for transparent pricing in the technology market by aggregating product listings from various vendors, providing AI-powered recommendations, and enabling customers to set price alerts for products they wish to monitor.</p>
          
          <h3>1.1 Scope</h3>
          <p>The system covers the following functional areas:</p>
          <ul>
            <li>Multi-vendor product listing and management</li>
            <li>Real-time price comparison across vendors</li>
            <li>AI-powered product recommendations</li>
            <li>Customer review and rating system for vendors</li>
            <li>Price alert notifications</li>
            <li>Vendor onboarding and dashboard management</li>
            <li>Administrative oversight and approval workflows</li>
          </ul>
        </div>

        <!-- 2. PROBLEM STATEMENT -->
        <div class="page-break">
          <h2>2. Problem Statement &amp; Objectives</h2>
          
          <h3>2.1 Problem Statement</h3>
          <p>Consumers in the technology market face significant challenges when attempting to find the best prices for products. The fragmentation of vendors across different platforms makes it time-consuming and difficult to compare prices effectively. There is a lack of centralized platforms that provide transparent, real-time price comparisons with vendor credibility metrics.</p>
          
          <h3>2.2 Objectives</h3>
          <table>
            <tr><th>Objective</th><th>Description</th></tr>
            <tr><td>Price Transparency</td><td>Provide a centralized platform for comparing technology product prices across vendors</td></tr>
            <tr><td>Vendor Accountability</td><td>Implement a review and rating system to ensure vendor credibility</td></tr>
            <tr><td>Smart Notifications</td><td>Enable customers to set price alerts and receive notifications on price drops</td></tr>
            <tr><td>AI Integration</td><td>Leverage AI to provide personalized product recommendations</td></tr>
            <tr><td>Vendor Empowerment</td><td>Provide vendors with a dashboard to manage products and track performance</td></tr>
            <tr><td>Administrative Control</td><td>Enable administrators to manage vendors, approve products, and oversee platform operations</td></tr>
          </table>
        </div>

        <!-- 3. METHODOLOGY -->
        <div class="page-break">
          <h2>3. Methodology</h2>
          
          <h3>3.1 Development Methodology: Agile (Iterative)</h3>
          <p>The project follows an <strong>Agile Iterative Development</strong> methodology, which allows for continuous improvement and adaptation based on feedback. The development was broken into sprints, each focusing on specific modules and features.</p>
          
          <h3>3.2 Development Phases</h3>
          <table>
            <tr><th>Phase</th><th>Activities</th><th>Deliverables</th></tr>
            <tr><td>Phase 1: Planning</td><td>Requirements gathering, user story mapping, system design</td><td>SRS Document, User Stories, Wireframes</td></tr>
            <tr><td>Phase 2: Design</td><td>UI/UX design, database schema design, architecture planning</td><td>Design mockups, ERD, System Architecture</td></tr>
            <tr><td>Phase 3: Development</td><td>Frontend development, backend integration, API development</td><td>Working modules, API endpoints</td></tr>
            <tr><td>Phase 4: Testing</td><td>Unit testing, integration testing, UAT</td><td>Test reports, Bug fixes</td></tr>
            <tr><td>Phase 5: Deployment</td><td>Production deployment, monitoring setup</td><td>Live application, Monitoring dashboards</td></tr>
          </table>

          <h3>3.3 Software Development Life Cycle (SDLC)</h3>
          <div class="diagram-box">
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Requirement │────▶│   Analysis  │────▶│   Design    │
│  Gathering   │     │  &amp; Planning │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
       ┌───────────────────────────────────────┘
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Coding    │────▶│   Testing   │────▶│ Deployment  │
│             │     │   &amp; QA     │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
       ┌───────────────────────────────────────┘
       ▼
┌─────────────────┐
│  Maintenance &amp;  │
│  Iteration      │
└─────────────────┘
          </div>
        </div>

        <!-- 4. SYSTEM ARCHITECTURE -->
        <div class="page-break">
          <h2>4. System Architecture</h2>
          
          <h3>4.1 High-Level Architecture</h3>
          <p>The system follows a <strong>three-tier architecture</strong> pattern consisting of the Presentation Layer, Application/Business Logic Layer, and Data Layer.</p>
          
          <div class="diagram-box">
┌──────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  React   │  │ Tailwind │  │ shadcn/ui│  │ React Router DOM │   │
│  │   SPA    │  │   CSS    │  │Components│  │   (Navigation)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTP/WebSocket
┌───────────────────────────▼──────────────────────────────────────────┐
│                    APPLICATION LAYER (Supabase)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Auth Service │  │Edge Functions│  │  Row Level Security (RLS)│  │
│  │  (JWT-based) │  │ (Deno/TS)   │  │     Policy Engine        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Storage     │  │  Realtime    │  │   PostgREST API          │  │
│  │  (Files)     │  │ (WebSocket) │  │   (Auto-generated)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ SQL
┌───────────────────────────▼──────────────────────────────────────────┐
│                       DATA LAYER (PostgreSQL)                        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   │
│  │  profiles  │ │  products  │ │  vendor_   │ │ product_       │   │
│  │            │ │            │ │  profiles  │ │ catalog        │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────┘   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   │
│  │ user_roles │ │ vendor_   │ │  price_    │ │ product_       │   │
│  │            │ │ reviews   │ │  alerts    │ │ images         │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
          </div>

          <h3>4.2 Client-Server Communication</h3>
          <div class="diagram-box">
┌─────────┐         ┌──────────────┐        ┌────────────┐
│  React  │◀───────▶│   Supabase   │◀──────▶│ PostgreSQL │
│  Client │  REST   │   API Layer  │  SQL   │  Database  │
│  (SPA)  │  + WS   │  + Auth      │        │            │
└─────────┘         └──────┬───────┘        └────────────┘
                           │
                    ┌──────▼───────┐
                    │    Edge      │
                    │  Functions   │
                    │ (AI, Alerts) │
                    └──────────────┘
          </div>
        </div>

        <!-- 5. DATABASE DESIGN -->
        <div class="page-break">
          <h2>5. Database Design (Entity Relationship Diagram)</h2>
          
          <h3>5.1 Entity Relationship Diagram</h3>
          <div class="diagram-box">
┌──────────────────┐       ┌──────────────────┐
│     profiles     │       │    user_roles     │
├──────────────────┤       ├──────────────────┤
│ id (PK, FK→auth) │──────▶│ id (PK)          │
│ email            │       │ user_id (FK)     │
│ full_name        │       │ role (enum)      │
│ phone            │       │ created_at       │
│ avatar_url       │       └──────────────────┘
│ role (enum)      │
│ created_at       │       ┌──────────────────┐
│ updated_at       │       │  vendor_profiles  │
└──────────────────┘       ├──────────────────┤
        │                  │ id (PK)          │
        └─────────────────▶│ user_id (FK)     │
                           │ company_name     │
                           │ description      │
                           │ logo_url         │
                           │ website          │
                           │ whatsapp         │
                           │ address          │
                           │ is_approved      │
                           │ created_at       │
                           │ updated_at       │
                           └────────┬─────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
          ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
          │   products   │ │vendor_reviews│ │              │
          ├──────────────┤ ├──────────────┤ │              │
          │ id (PK)      │ │ id (PK)      │ │              │
          │ vendor_id(FK)│ │ vendor_id(FK)│ │              │
          │ catalog_id   │ │ user_id (FK) │ │              │
          │ name         │ │ rating (1-5) │ │              │
          │ price        │ │ title        │ │              │
          │ category     │ │ content      │ │              │
          │ brand        │ │ created_at   │ │              │
          │ model        │ │ updated_at   │ │              │
          │ description  │ └──────────────┘ │              │
          │ image_url    │                  │              │
          │ specs (JSON) │                  │              │
          │ status       │                  │              │
          │ created_at   │                  │              │
          │ updated_at   │                  │              │
          └──────┬───────┘                  │              │
                 │                          │              │
                 ▼                          │              │
        ┌────────────────┐                  │              │
        │ product_images │                  │              │
        ├────────────────┤                  │              │
        │ id (PK)        │                  │              │
        │ product_id(FK) │                  │              │
        │ image_url      │                  │              │
        │ is_primary     │                  │              │
        │ created_at     │                  │              │
        └────────────────┘                  │              │
                                            │              │
┌──────────────────┐     ┌─────────────────┘              │
│ product_catalog  │     │                                 │
├──────────────────┤     │    ┌──────────────┐            │
│ id (PK)          │◀────┘    │ price_alerts │            │
│ name             │◀─────────┤──────────────┤            │
│ category         │          │ id (PK)      │            │
│ brand            │          │ user_id (FK) │            │
│ model            │          │ catalog_id   │            │
│ description      │          │ original_price│           │
│ image_url        │          │ target_price │            │
│ specs (JSON)     │          │ is_active    │            │
│ created_at       │          │ notified_at  │            │
└──────────────────┘          │ created_at   │            │
                              │ updated_at   │            │
                              └──────────────┘            │
          </div>

          <h3>5.2 Table Summary</h3>
          <table>
            <tr><th>Table</th><th>Purpose</th><th>Key Relationships</th></tr>
            <tr><td>profiles</td><td>User profile information</td><td>FK to auth.users</td></tr>
            <tr><td>user_roles</td><td>Role-based access control (RBAC)</td><td>FK to auth.users</td></tr>
            <tr><td>vendor_profiles</td><td>Vendor business information</td><td>FK to auth.users</td></tr>
            <tr><td>products</td><td>Vendor product listings with prices</td><td>FK to vendor_profiles, product_catalog</td></tr>
            <tr><td>product_catalog</td><td>Canonical product definitions</td><td>Referenced by products, price_alerts</td></tr>
            <tr><td>product_images</td><td>Multiple images per product</td><td>FK to products</td></tr>
            <tr><td>vendor_reviews</td><td>Customer reviews of vendors</td><td>FK to vendor_profiles</td></tr>
            <tr><td>price_alerts</td><td>User price drop notifications</td><td>FK to product_catalog</td></tr>
          </table>

          <h3>5.3 Enumerated Types</h3>
          <table>
            <tr><th>Enum</th><th>Values</th></tr>
            <tr><td>app_role</td><td>admin, vendor, customer</td></tr>
            <tr><td>user_role</td><td>customer, vendor, admin</td></tr>
            <tr><td>product_category</td><td>laptops, desktops, monitors, smartphones, tablets, accessories, components, networking, storage, audio, gaming, other</td></tr>
            <tr><td>product_status</td><td>pending, approved, rejected</td></tr>
          </table>
        </div>

        <!-- 6. SYSTEM FLOWCHARTS -->
        <div class="page-break">
          <h2>6. System Flowcharts</h2>
          
          <h3>6.1 User Authentication Flow</h3>
          <div class="diagram-box">
                        ┌─────────┐
                        │  START  │
                        └────┬────┘
                             ▼
                   ┌──────────────────┐
                   │ User visits /auth│
                   └────────┬─────────┘
                            ▼
                  ┌─────────────────────┐
                  │  Sign In or Sign Up?│
                  └──┬───────────────┬──┘
                     ▼               ▼
              ┌────────────┐  ┌─────────────┐
              │  SIGN IN   │  │   SIGN UP   │
              └─────┬──────┘  └──────┬──────┘
                    ▼                ▼
           ┌────────────────┐ ┌──────────────────┐
           │ Enter email &amp; │ │ Select role:     │
           │ password       │ │ Customer/Vendor  │
           └───────┬────────┘ └──────┬───────────┘
                   ▼                 ▼
           ┌────────────────┐ ┌──────────────────┐
           │ Supabase Auth  │ │ Enter details    │
           │ signInWithPwd  │ │ + Supabase signUp│
           └───────┬────────┘ └──────┬───────────┘
                   ▼                 ▼
              ┌─────────┐    ┌─────────────┐
              │Success? │    │ DB Trigger: │
              └──┬───┬──┘    │ Create      │
                 │   │       │ profile +   │
              Y  │   │  N    │ vendor_profile│
                 ▼   ▼       │ + user_role │
          ┌────────┐ ┌───┐   └──────┬──────┘
          │ Check  │ │Err│          ▼
          │ Role   │ │Msg│   ┌─────────────┐
          └───┬────┘ └───┘   │  Redirect   │
              ▼              │  by role    │
     ┌────────────────┐      └─────────────┘
     │ Redirect:      │
     │ vendor→/vendor │
     │ admin→/admin   │
     │ customer→/browse│
     └────────────────┘
          </div>

          <h3>6.2 Product Browsing &amp; Comparison Flow</h3>
          <div class="diagram-box">
┌─────────┐     ┌──────────────┐     ┌───────────────────┐
│  START  │────▶│ Browse Page  │────▶│ Search / Filter   │
└─────────┘     │ /browse      │     │ by category, brand│
                └──────────────┘     └────────┬──────────┘
                                              ▼
                                    ┌───────────────────┐
                                    │ Product Grid View │
                                    │ (ProductCard)     │
                                    └────────┬──────────┘
                                             ▼
                              ┌──────────────────────────────┐
                              │    User Action?              │
                              └──┬──────────┬───────────┬────┘
                                 ▼          ▼           ▼
                          ┌──────────┐ ┌─────────┐ ┌──────────┐
                          │  View    │ │  Add to │ │  Set     │
                          │  Detail  │ │ Compare │ │ Price    │
                          │/product/ │ │  List   │ │ Alert    │
                          │  :id     │ └────┬────┘ └──────────┘
                          └────┬─────┘      ▼
                               │      ┌──────────┐
                               ▼      │ Compare  │
                        ┌────────────┐│  Page    │
                        │ Vendor    ││ /compare  │
                        │ Listings  │└──────────┘
                        │ + Prices  │
                        └─────┬─────┘
                              ▼
                       ┌─────────────┐
                       │ Click vendor│
                       │ → Reviews  │
                       │   Sheet    │
                       └─────────────┘
          </div>

          <h3>6.3 Vendor Product Management Flow</h3>
          <div class="diagram-box">
┌─────────┐     ┌───────────────┐     ┌──────────────────┐
│  START  │────▶│ Vendor Login  │────▶│ Vendor Dashboard │
└─────────┘     └───────────────┘     │    /vendor       │
                                      └────────┬─────────┘
                                               ▼
                                    ┌──────────────────────┐
                                    │    Dashboard View    │
                                    │  - Stats Overview    │
                                    │  - Product List      │
                                    │  - Revenue Charts    │
                                    └──────────┬───────────┘
                                               ▼
                              ┌────────────────────────────┐
                              │       Action?              │
                              └──┬──────────┬──────────┬───┘
                                 ▼          ▼          ▼
                          ┌──────────┐┌──────────┐┌──────────┐
                          │  Add New ││  Edit    ││  Delete  │
                          │  Product ││  Product ││  Product │
                          └────┬─────┘└────┬─────┘└────┬─────┘
                               ▼           ▼           ▼
                        ┌────────────────────────────────────┐
                        │   Product saved with status:      │
                        │   "pending" → Admin review        │
                        └────────────────────────────────────┘
                                       ▼
                              ┌──────────────────┐
                              │  Admin approves  │
                              │  or rejects      │
                              └──────────────────┘
          </div>

          <h3>6.4 Price Alert Flow</h3>
          <div class="diagram-box">
┌──────────────┐     ┌───────────────┐     ┌──────────────────┐
│ Customer sets│────▶│ Alert saved   │────▶│ Edge Function    │
│ price alert  │     │ in DB with    │     │ check-price-     │
│ on product   │     │ target_price  │     │ alerts (cron)    │
└──────────────┘     └───────────────┘     └────────┬─────────┘
                                                    ▼
                                          ┌──────────────────┐
                                          │ Compare current  │
                                          │ price vs target  │
                                          └────────┬─────────┘
                                                   ▼
                                          ┌──────────────────┐
                                     ┌────│ Price dropped?   │────┐
                                     ▼    └──────────────────┘    ▼
                                    YES                          NO
                                     ▼                            ▼
                              ┌─────────────┐            ┌──────────┐
                              │ Send email  │            │  Wait    │
                              │ notification│            │  for     │
                              │ + update    │            │  next    │
                              │ notified_at │            │  check   │
                              └─────────────┘            └──────────┘
          </div>

          <h3>6.5 AI Recommendation Flow</h3>
          <div class="diagram-box">
┌──────────────┐     ┌───────────────┐     ┌──────────────────┐
│ User requests│────▶│ Frontend      │────▶│ Edge Function    │
│ AI recommend │     │ sends context │     │ /ai-recommend    │
└──────────────┘     │ (budget, use  │     └────────┬─────────┘
                     │  case, prefs) │              ▼
                     └───────────────┘     ┌──────────────────┐
                                          │ Query product    │
                                          │ catalog + prices │
                                          └────────┬─────────┘
                                                   ▼
                                          ┌──────────────────┐
                                          │ AI processes     │
                                          │ and ranks        │
                                          │ recommendations  │
                                          └────────┬─────────┘
                                                   ▼
                                          ┌──────────────────┐
                                          │ Return top       │
                                          │ matches to user  │
                                          └──────────────────┘
          </div>
        </div>

        <!-- 7. USER ROLES -->
        <div class="page-break">
          <h2>7. User Roles &amp; Access Control</h2>
          
          <h3>7.1 Role Hierarchy</h3>
          <div class="diagram-box">
                    ┌──────────────┐
                    │    ADMIN     │
                    │ (Full Access)│
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
     ┌──────────────┐         ┌──────────────┐
     │    VENDOR    │         │   CUSTOMER   │
     │(Sell Products│         │(Browse, Buy, │
     │ Manage Store)│         │ Compare,     │
     └──────────────┘         │ Review)      │
                              └──────────────┘
          </div>

          <h3>7.2 Access Control Matrix</h3>
          <table>
            <tr><th>Feature / Page</th><th>Customer</th><th>Vendor</th><th>Admin</th></tr>
            <tr><td>Home Page</td><td>✅</td><td>✅</td><td>✅</td></tr>
            <tr><td>Browse Products</td><td>✅</td><td>✅</td><td>✅</td></tr>
            <tr><td>Product Detail</td><td>✅</td><td>✅</td><td>✅</td></tr>
            <tr><td>Compare Products</td><td>✅</td><td>✅</td><td>✅</td></tr>
            <tr><td>Set Price Alerts</td><td>✅</td><td>❌</td><td>✅</td></tr>
            <tr><td>Submit Vendor Reviews</td><td>✅</td><td>❌</td><td>✅</td></tr>
            <tr><td>Vendor Dashboard</td><td>❌</td><td>✅</td><td>✅</td></tr>
            <tr><td>Add/Edit Products</td><td>❌</td><td>✅</td><td>✅</td></tr>
            <tr><td>Admin Dashboard</td><td>❌</td><td>❌</td><td>✅</td></tr>
            <tr><td>Approve Vendors</td><td>❌</td><td>❌</td><td>✅</td></tr>
            <tr><td>Approve Products</td><td>❌</td><td>❌</td><td>✅</td></tr>
          </table>

          <h3>7.3 Security Implementation (RLS)</h3>
          <p>Access control is enforced at the database level using <strong>Row Level Security (RLS)</strong> policies in PostgreSQL via Supabase. A <code>has_role()</code> security definer function prevents recursive policy evaluation.</p>
        </div>

        <!-- 8. KEY FEATURES -->
        <div class="page-break">
          <h2>8. Key Features &amp; Modules</h2>
          
          <h3>8.1 Module Overview</h3>
          <table>
            <tr><th>Module</th><th>Description</th><th>Key Components</th></tr>
            <tr><td>Authentication</td><td>User registration and login with role selection</td><td>Auth.tsx, ProtectedRoute, VendorProtectedRoute</td></tr>
            <tr><td>Product Browsing</td><td>Search, filter, and browse technology products</td><td>Browse.tsx, ProductCard.tsx</td></tr>
            <tr><td>Product Detail</td><td>View product specifications and vendor prices</td><td>ProductDetail.tsx</td></tr>
            <tr><td>Price Comparison</td><td>Side-by-side comparison of selected products</td><td>Compare.tsx, ComparisonContext.tsx</td></tr>
            <tr><td>Vendor Reviews</td><td>Star ratings and text reviews for vendors</td><td>VendorReviewSheet.tsx, VendorReviews.tsx, HomeReviews.tsx</td></tr>
            <tr><td>Price Alerts</td><td>Set target prices and receive notifications</td><td>PriceAlertButton.tsx, MyAlerts.tsx</td></tr>
            <tr><td>AI Recommendations</td><td>AI-powered product suggestions</td><td>AIRecommendation.tsx, ai-recommend edge function</td></tr>
            <tr><td>Vendor Dashboard</td><td>Product management and analytics</td><td>VendorDashboard.tsx, VendorOnboard.tsx</td></tr>
            <tr><td>Admin Dashboard</td><td>Platform oversight and approval workflows</td><td>AdminDashboard.tsx</td></tr>
            <tr><td>AI Chatbot</td><td>Conversational assistant for user queries</td><td>Chatbot.tsx, chat edge function</td></tr>
          </table>

          <h3>8.2 Feature: Vendor Review System</h3>
          <p>The vendor review system allows authenticated customers to submit ratings (1-5 stars) and text reviews for vendors. Key characteristics:</p>
          <ul>
            <li>One review per user per vendor (unique constraint)</li>
            <li>Reviews visible across platform (product detail, vendor pages, homepage)</li>
            <li>Star rating distribution visualization</li>
            <li>Mock/fallback reviews for vendors without real reviews</li>
            <li>Deterministic randomization ensures different mock reviews per vendor</li>
          </ul>
        </div>

        <!-- 9. TECHNOLOGY STACK -->
        <div class="page-break">
          <h2>9. Technology Stack</h2>
          
          <h3>9.1 Frontend Technologies</h3>
          <table>
            <tr><th>Technology</th><th>Purpose</th><th>Version</th></tr>
            <tr><td>React</td><td>UI Library (Single Page Application)</td><td>18.3</td></tr>
            <tr><td>TypeScript</td><td>Type-safe JavaScript</td><td>5.8</td></tr>
            <tr><td>Vite</td><td>Build tool and dev server</td><td>5.4</td></tr>
            <tr><td>Tailwind CSS</td><td>Utility-first CSS framework</td><td>3.4</td></tr>
            <tr><td>shadcn/ui</td><td>Pre-built accessible UI components</td><td>Latest</td></tr>
            <tr><td>React Router DOM</td><td>Client-side routing</td><td>6.30</td></tr>
            <tr><td>TanStack React Query</td><td>Server state management</td><td>5.83</td></tr>
            <tr><td>Recharts</td><td>Data visualization / Charts</td><td>2.15</td></tr>
            <tr><td>Three.js / R3F</td><td>3D rendering (homepage showcase)</td><td>0.160</td></tr>
            <tr><td>Lucide React</td><td>Icon library</td><td>0.462</td></tr>
            <tr><td>Framer Motion (via R3F)</td><td>Animations</td><td>-</td></tr>
          </table>

          <h3>9.2 Backend Technologies</h3>
          <table>
            <tr><th>Technology</th><th>Purpose</th></tr>
            <tr><td>Supabase</td><td>Backend-as-a-Service (BaaS)</td></tr>
            <tr><td>PostgreSQL</td><td>Relational database</td></tr>
            <tr><td>PostgREST</td><td>Auto-generated RESTful API</td></tr>
            <tr><td>Supabase Auth</td><td>JWT-based authentication</td></tr>
            <tr><td>Supabase Edge Functions</td><td>Serverless functions (Deno/TypeScript)</td></tr>
            <tr><td>Row Level Security</td><td>Database-level access control</td></tr>
          </table>

          <h3>9.3 Architecture Pattern</h3>
          <div class="diagram-box">
┌─────────────────────────────────────────────────────┐
│                  Frontend (SPA)                     │
│                                                     │
│   React + TypeScript + Tailwind + shadcn/ui        │
│   ┌─────────────┐  ┌──────────┐  ┌─────────────┐  │
│   │    Pages    │  │Components│  │   Contexts   │  │
│   │ (Routes)   │  │  (UI)    │  │ (State Mgmt) │  │
│   └─────────────┘  └──────────┘  └─────────────┘  │
│         │               │              │           │
│         └───────────────┼──────────────┘           │
│                         ▼                          │
│              ┌──────────────────┐                  │
│              │ Supabase Client  │                  │
│              │ (@supabase/js)   │                  │
│              └────────┬─────────┘                  │
└───────────────────────┼────────────────────────────┘
                        ▼
              ┌──────────────────┐
              │   Supabase       │
              │   Platform       │
              └──────────────────┘
          </div>
        </div>

        <!-- 10. SECURITY -->
        <div class="page-break">
          <h2>10. Security Implementation</h2>
          
          <h3>10.1 Authentication Security</h3>
          <ul>
            <li><strong>JWT-based authentication</strong> via Supabase Auth</li>
            <li><strong>Password hashing</strong> handled server-side by Supabase (bcrypt)</li>
            <li><strong>Session management</strong> with secure token storage</li>
            <li><strong>Protected routes</strong> on both client and server side</li>
          </ul>

          <h3>10.2 Row Level Security (RLS)</h3>
          <p>Every table has RLS enabled with specific policies:</p>
          <ul>
            <li><strong>profiles</strong>: Users can only view/edit their own profile</li>
            <li><strong>products</strong>: Public can view approved; vendors can manage their own</li>
            <li><strong>vendor_profiles</strong>: Public can view approved; vendors can edit their own</li>
            <li><strong>price_alerts</strong>: Users can only CRUD their own alerts</li>
            <li><strong>user_roles</strong>: Users can view own; can insert vendor role only</li>
            <li><strong>vendor_reviews</strong>: Anyone can read; authenticated users can create; owners can update/delete</li>
          </ul>

          <h3>10.3 Security Definer Function</h3>
          <p>The <code>has_role()</code> function uses SECURITY DEFINER to bypass RLS when checking roles, preventing recursive policy evaluation:</p>
          <div class="diagram-box">
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
          </div>
        </div>

        <!-- 11. TESTING -->
        <div class="page-break">
          <h2>11. Testing Strategy</h2>
          
          <table>
            <tr><th>Test Type</th><th>Scope</th><th>Tools</th></tr>
            <tr><td>Unit Testing</td><td>Individual components and functions</td><td>Vitest, React Testing Library</td></tr>
            <tr><td>Integration Testing</td><td>Component interactions, API calls</td><td>Vitest, MSW (Mock Service Worker)</td></tr>
            <tr><td>End-to-End Testing</td><td>Full user workflows</td><td>Browser automation, Manual testing</td></tr>
            <tr><td>Security Testing</td><td>RLS policies, auth flows</td><td>Supabase Dashboard, Manual pen testing</td></tr>
            <tr><td>Responsive Testing</td><td>Mobile, tablet, desktop layouts</td><td>Browser DevTools, Multiple viewports</td></tr>
          </table>
        </div>

        <!-- 12. DEPLOYMENT -->
        <div class="page-break">
          <h2>12. Deployment Architecture</h2>
          
          <div class="diagram-box">
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Developer      │     │   Lovable        │     │   Production     │
│   (Code Editor)  │────▶│   Platform       │────▶│   CDN / Edge     │
│                  │     │   (Build + CI)   │     │   (Static SPA)   │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Supabase       │
                         │   Cloud          │
                         │  ┌────────────┐  │
                         │  │ PostgreSQL │  │
                         │  │ Auth       │  │
                         │  │ Edge Fns   │  │
                         │  │ Storage    │  │
                         │  └────────────┘  │
                         └──────────────────┘
          </div>

          <h3>12.1 Deployment Process</h3>
          <ol>
            <li>Code changes committed to Git repository</li>
            <li>Lovable platform detects changes and triggers build</li>
            <li>Vite builds optimized production bundle</li>
            <li>Static assets deployed to CDN</li>
            <li>Edge functions deployed to Supabase Edge</li>
            <li>Database migrations applied automatically</li>
          </ol>
        </div>

        <!-- 13. FUTURE ENHANCEMENTS -->
        <div class="page-break">
          <h2>13. Future Enhancements</h2>
          <table>
            <tr><th>Enhancement</th><th>Description</th><th>Priority</th></tr>
            <tr><td>Price History Charts</td><td>Visual price trend analysis over time</td><td>High</td></tr>
            <tr><td>Email Notifications</td><td>Email alerts for price drops and vendor updates</td><td>High</td></tr>
            <tr><td>Mobile App</td><td>React Native mobile application</td><td>Medium</td></tr>
            <tr><td>Vendor Analytics</td><td>Advanced analytics with conversion tracking</td><td>Medium</td></tr>
            <tr><td>Social Sharing</td><td>Share product comparisons on social media</td><td>Low</td></tr>
            <tr><td>Wishlist Feature</td><td>Save products to personal wishlists</td><td>Medium</td></tr>
            <tr><td>Payment Integration</td><td>Direct purchase via platform (Stripe/Paystack)</td><td>High</td></tr>
            <tr><td>Multi-language Support</td><td>Internationalization (i18n)</td><td>Low</td></tr>
          </table>
        </div>

        <!-- 14. CONCLUSION -->
        <div class="page-break">
          <h2>14. Conclusion</h2>
          <p>TechPrice successfully delivers a comprehensive technology price comparison platform that addresses the key challenges of price transparency and vendor accountability in the technology market. The platform leverages modern web technologies including React, TypeScript, and Supabase to provide a scalable, secure, and user-friendly solution.</p>
          <p>Key achievements include:</p>
          <ul>
            <li>A fully functional multi-vendor price comparison system</li>
            <li>Role-based access control with three distinct user types</li>
            <li>AI-powered product recommendations and chatbot assistance</li>
            <li>Real-time price alerts with automated notification system</li>
            <li>Comprehensive vendor review and rating system</li>
            <li>Responsive design supporting desktop, tablet, and mobile devices</li>
            <li>Enterprise-grade security with Row Level Security policies</li>
          </ul>
          <p>The Agile iterative development methodology ensured continuous improvement and adaptation throughout the development process, resulting in a robust and feature-rich platform ready for production deployment.</p>
        </div>

      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TechPrice_Project_Documentation.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download as Word (.doc)
          </Button>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">TechPrice Documentation</h1>
            <p className="text-muted-foreground text-lg">Technology Price Comparison Platform — Full Project Documentation</p>
            <p className="text-sm text-muted-foreground">Version 1.0 · {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">📄 Document Contents</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Introduction & Project Overview</li>
              <li>Problem Statement & Objectives</li>
              <li>Methodology (Agile Iterative + SDLC Diagram)</li>
              <li>System Architecture (3-Tier Architecture Diagrams)</li>
              <li>Database Design (ERD + Table Summary)</li>
              <li>System Flowcharts (Auth, Browse, Vendor, Alerts, AI)</li>
              <li>User Roles & Access Control Matrix</li>
              <li>Key Features & Modules</li>
              <li>Technology Stack</li>
              <li>Security Implementation (RLS)</li>
              <li>Testing Strategy</li>
              <li>Deployment Architecture</li>
              <li>Future Enhancements</li>
              <li>Conclusion</li>
            </ol>
          </div>

          <div className="text-center">
            <Button onClick={handleDownload} size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Download Documentation (.doc)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Opens in Microsoft Word, Google Docs, or LibreOffice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
