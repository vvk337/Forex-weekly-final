# 12 Open Decisions

This document lists design decisions and policy questions that must be reviewed and approved by the Product Owner before implementation begins.

---

## 1. Authentication Method
> [!IMPORTANT]
> - Should we keep the lightweight custom cookie-based JWT authentication model, or migrate to an enterprise identity provider framework (such as NextAuth.js/Auth.js)?
> - Do we need to support Single Sign-On (SSO) integrations (such as Okta, Azure AD, or Google Workspace) for corporate editors?

---

## 2. Media Upload Strategy
> [!IMPORTANT]
> - Which cloud storage provider should be used for media uploads (AWS S3, Cloudinary, or Azure Blob)?
> - Should upload size limits and permitted image file formats be configured globally or set individually per workspace?

---

## 3. Workflow & Approvals Policies
> [!IMPORTANT]
> - Do we need to support multi-stage approval pipelines (e.g., Editor -> Supervisor -> Compliance -> Published), or is a single-stage approval (Editor -> Supervisor -> Published) sufficient?
> - Can Workspace Admins edit and publish articles directly, or must all content go through the standard supervisor approval queue?

---

## 4. Notifications & Alerts Delivery
> [!IMPORTANT]
> - Should notifications for pending approvals and support tickets be delivered via email, Slack/Teams integrations, or kept strictly as inbox updates within the admin dashboard?
