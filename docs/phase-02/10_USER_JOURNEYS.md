# 10 User Journeys

This document details the step-by-step user journeys and workflows for key administrative operations in the Enterprise CMS.

---

## 1. Editorial Workflow: Writing & Publishing

This diagram shows the path of a publication draft from creation to release:

```mermaid
sequenceDiagram
    autonumber
    actor Employee as Content Editor
    actor Supervisor as Content Supervisor
    participant DB as Prisma/DB
    participant Public as Live Website

    Employee->>DB: Creates and saves draft
    Employee->>Supervisor: Submits article for review
    Note over Supervisor: Receives notification
    alt Needs Revisions
        Supervisor->>Employee: Rejects and requests edits
        Employee->>DB: Updates article and resubmits
    else Approved
        Supervisor->>DB: Approves and publishes article
        DB->>Public: Article goes live on home page feed
    end
```

---

## 2. Admin Onboarding Workflow

The diagram below details the hierarchy setup path during system setup:

```mermaid
stateDiagram-v2
    OwnerSession : Owner login session active
    OwnerSession --> InviteAdmin : Click "Add Workspace Admin"
    InviteAdmin --> DatabaseAdmin : Save Admin details
    DatabaseAdmin --> SendInviteEmail : System sends invite
    
    state AdminOnboarding {
        [*] --> AcceptInvite : Admin accepts invite
        AcceptInvite --> SetCredentials : Sets password
        SetCredentials --> DashboardAccess : Enters Admin Dashboard
    }
    
    SendInviteEmail --> AdminOnboarding
    
    DashboardAccess --> InviteSupervisor : Admin invites Supervisor
    InviteSupervisor --> InviteEmployee : Supervisor invites Editor
    InviteEmployee --> WorkspaceSetup : Team joins Workspace
```
