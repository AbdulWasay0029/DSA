# Design Feedback & Style Guide for SmartInterviews

**Visual Identity: "Dark Glass & Neon"**
The current design direction is **NOT** "Vibrant Flat" or "Teal/Light". We are building a premium, developer-focused workspace.

## 1. Core Aesthetic Principles
*   **Theme:** Deep Dark Mode (Backgrounds: `#0a0a0f`, `#151520`).
*   **Surface Material:** Glassmorphism. High transparency, background blur (`backdrop-filter: blur(12px)`), and subtle white borders (`rgba(255,255,255,0.1)`).
*   **Accent Colors:**
    *   **Primary:** Neon Purple / Violet (`#8a3ffc`) - Used for active states, glows, and key buttons.
    *   **Secondary:** Electric Blue or Emerald Green (for success states).
    *   **Avoid:** Flat, opaque colors. Avoid "Corporate Blue".
*   **Typography:** Clean Sans-serif (Inter/Geist) but with increased letter-spacing for headers.
*   **Motion:** Everything enters with a subtle fade-up. Hover states should "lift" and "glow".

## 2. Updated Component Guidelines
*   **Cards:** Do NOT use solid white or gray backgrounds. Use `rgba(255, 255, 255, 0.03)` with a 1px slightly lighter border.
*   **Buttons:**
    *   *Primary:* Gradient backgrounds or solid Neon Purple with a glow effect (`box-shadow: 0 0 15px rgba(138, 63, 252, 0.5)`).
    *   *Secondary:* Transparent with a white border.
    *   *Icons:* Minimal line icons, slightly thicker stroke.

## 3. Revised User Flow (Correction)
*   **No "Admin Dashboard" vs "User Dashboard" Split:** The interface should be unified.
    *   Admins see "Edit" buttons on the normal page.
    *   Users see "Suggest" buttons in the same place.
    *   **Do not** design separate portals. Use "Mode Switching" or conditional rendering within the same layout.
*   **Editing Experience:** Inline, WYSIWYG editing is preferred over modal popups. The user should edit content *in context*.

**Directive for AI:**
"Discard the previous 'Light/Teal' design system. Adopt this Dark/Glass aesthetic immediately. When proposing screens, assume the background is nearly black and every surface is semi-transparent glass."
