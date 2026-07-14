# 09 UI Component Library

This document outlines the standard UI components, styles, states, and design guidelines for the Enterprise CMS interface.

---

## 1. Design Language Guidelines
* **Colors**: Premium editorial system:
  - Backgrounds: Pure white (`#FFFFFF`) in light mode; charcoal/dark gray (`#121212` and `#1E1E1E`) in dark mode.
  - Accents: Deep editorial red (`#E31E24`).
* **Typography**:
  - Headings: Serif style (`"Times New Roman", Times, serif`).
  - Interface Elements: Clean, highly legible sans-serif font (`system-ui, -apple-system, sans-serif`).

---

## 2. Reusable Interface Components

### Tables & Data Grids
* **Design**: Minimalistic borders, light gray headers, clear row spacing, and text alignment matching column types.
* **Interactive States**: Hover effects on rows, click triggers for edit options, and inline action buttons on the right.

### Forms & Inputs
* **Design**: Outlined border styles, clear labels, and inline validation helper texts.
* **States**: Normal, Focused (border shifts to red accent), Disabled (muted gray background), and Error (red border and red helper text).

### Buttons & Call-to-Actions (CTAs)
* **Primary**: Editorial red background (`#E31E24`) with white text.
* **Secondary**: Outlined border with transparent background.
* **Muted / Danger**: Gray or soft red outline, used for destructive actions (like deletions).

### Modals & Dialogs
* **Design**: Centered overlay cards with a semi-transparent dark backdrop.
* **Controls**: Prominent header, close button (`X` icon in the top-right), body container, and confirmation actions in the footer (Cancel/Confirm).

---

## 3. UI System States

### Loading States
* **Design**: Skeleton screen loaders that match the layout of the loading content (rather than using spinner wheels).

### Empty States
* **Design**: Centered layout containing a muted icon, a friendly placeholder title, and a primary action button (e.g. "+ Add First Article").

### Error States
* **Design**: Banner layouts with soft red backgrounds, bold warning text, and action buttons to retry the failed request.
