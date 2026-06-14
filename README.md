# Loom

**Loom** is a robust, native mobile house management application built specifically for students and roommates sharing co-living spaces. In shared environments, logistical coordination—such as splitting utility bills, managing grocery runs, and maintaining fair chore cycles—is often a primary source of social friction. Loom solves this by transforming household administration into a streamlined, high-trust digital ecosystem.

Unlike traditional web-based utilities, Loom is developed as a **fully native mobile application** to maximize real-time reliability, ensure persistent push notifications for overdue tasks, and provide offline data availability when local networks fail.

---

### Key Value Propositions
* **Automated Accountability:** Moves beyond simple "to-do lists" by implementing dynamic chore wheels and rotation logic.
* **Financial Transparency:** Handles multi-party expense splitting with precision ledger tracking.
* **Low-Friction UI/UX:** Built with a premium, mobile-first interface optimized for rapid, daily micro-interactions.

### Technical Architecture & Highlights
* **Cross-Platform Native UI:** Leveraging **React Native** (Expo SDK 56) to deliver fluid, gesture-driven interfaces and persistent hardware notifications.
* **Real-Time Data Layer:** Powered by **Supabase Realtime** to instantly synchronize chore completions and financial updates across all household devices without requiring manual pull-to-refresh.
* **Granular Data Security:** Implements **Supabase Row Level Security (RLS)** to enforce strict user-role permissions, ensuring financial ledgers and personal assignments are only modifiable by authorized roommates.

---

## Get Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the App**
   ```bash
   npx expo start
   ```

In the terminal output, you will find options to open the app in a simulator, on physical devices via Expo Go, or on the web.

## Directory Structure

This project uses **Expo Router** for file-based routing. The folder tree is organized as follows:
- `/src/app/` - Expo Router screens and layouts.
- `/src/components/` - Reusable UI elements, categorized by feature.
- `/src/constants/` - Color schemes, themes, styles.
- `/src/hooks/` - React Hooks for fetching data, real-time syncing.
- `/src/services/` - Integration layer (Supabase, local storage/mock data).
- `/src/types/` - TypeScript interface definitions.
