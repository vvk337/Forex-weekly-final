# 05 Workspace Blueprint

This document specifies the design, navigation, and user flow for the Multi-Tenant Workspace system.

---

## 1. Workspace Categories

### Publication Workspace (Default)
- **Purpose**: Managing public-facing editorial content, articles, and author columns.
- **Available Modules**: Publications, Media Manager.
- **Dashboard Widgets**: Draft progress bars, supervisor approval queues, and reader view metrics.

### Marketing Workspace
- **Purpose**: Directing sponsored banners, affiliate links, and monetization campaigns.
- **Available Modules**: Sponsored Placements, Campaign Manager.
- **Dashboard Widgets**: Ad impression charts, click-through-rate (CTR) stats, and campaign schedule calendars.

### Research Workspace
- **Purpose**: Creating private research whitepapers, premium analytics reports, and VIP outlook feeds.
- **Available Modules**: Premium Reports, Ticker Manager, Research Archives.
- **Dashboard Widgets**: Ticker configuration toggles, premium report drafts, and subscriber signup charts.

---

## 2. Workspace Switching & Navigation Flow

The top-left corner of the Admin Dashboard features a **Workspace Selector Dropdown**.

```text
+-----------------------+---------------------------------------+
|  [Select Workspace] v | User Profile | Logout                 |
|  ├─ Publication WS     +---------------------------------------+
|  ├─ Marketing WS      | Dashboard                             |
|  └─ Research WS       | (Content dynamic swap based on select)|
+-----------------------+---------------------------------------+
```

### Switch Event Cycle:
1. User clicks the Workspace Selector and selects a workspace (e.g., *Marketing Workspace*).
2. The client intercepts the click, writes the new active ID to local storage, and sets a custom header (`x-workspace-id`) on subsequent requests.
3. The dashboard UI swaps out the active widgets and navigation tabs in real-time, loading only the modules relevant to the selected workspace.
4. If a user is not authorized to access the selected workspace, the system displays an access denied page.
