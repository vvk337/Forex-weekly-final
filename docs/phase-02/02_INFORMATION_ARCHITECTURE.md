# 02 Information Architecture

This document maps the hierarchy, reporting relationships, and data scoping of the Enterprise CMS backend.

---

## 1. System Scoping & Reporting Hierarchy

The diagram below details the organizational topology of the platform:

```mermaid
graph TD
    %% Top Level Identity and Control
    Owner[System Owner] -->|Manages| Admin[Workspace Admins]
    Admin -->|Supervises| Supervisor[Content Supervisors]
    Supervisor -->|Directs| Employee[General Employees / Editors]

    %% Tenant Partitioning
    Admin -->|Scopes Control to| Workspace[Active Workspace Context]
    
    %% Workspace Categories
    Workspace -->|Type A| PubWS[Publication Workspace]
    Workspace -->|Type B| MktWS[Marketing Workspace]
    Workspace -->|Type C| ResWS[Research Workspace]
    
    %% Module Subdivisions
    PubWS -->|Contains| PubMod[Publications & Blog Module]
    MktWS -->|Contains| AdMod[Sponsored Placements Module]
    ResWS -->|Contains| TickMod[Real-time News Ticker Module]
    
    %% Pages Layout
    PubMod -->|Views| ArtList[Articles Grid Page]
    PubMod -->|Actions| ArtCreate[Article Creation Form]
    
    AdMod -->|Views| AdGrid[Sponsorships Table]
    AdMod -->|Actions| AdEdit[Placement Form Editor]
```

---

## 2. Data Partitioning Flow

1. **User Identity Verification**: Users log in, and their JWT claims are verified to resolve their User ID, Role, and authorized Workspaces list.
2. **Context Selection**: The system sets the active Workspace based on the user's choice.
3. **Database Scoping**: Database queries are automatically filtered using the selected workspace parameter (e.g. `prisma.article.findMany({ where: { workspaceId } })`), ensuring complete data isolation between tenants.
