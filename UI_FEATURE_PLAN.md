# UI Redesign and Feature Plan

## Goal

Turn the existing expense tracker into a friendly, Japanese picture-book-style finance app. Keep current expense creation, editing, deletion, filtering, currency settings, profile, and monthly budget behavior working while introducing a dashboard and richer finance tracking.

This document is a plan only. No implementation changes are included here.

## Current project baseline

- Expo / React Native app using React Navigation, Redux Toolkit, NativeWind, and a REST API.
- Main tabs currently show **Recent**, **All**, and **Profile**. A drawer links to settings, expense types, notifications, help, and the monthly budget screen.
- Expense records currently contain `id`, `title`, `price`, `date`, and `type`.
- The app supports adding, editing, deleting, and listing expenses, plus filtering all expenses by month and year.
- A monthly budget can be saved through the API. Per-category budgets and income tracking are not currently represented in the expense model.
- Expense categories can be managed dynamically, so the six categories in the design should be mapped to existing types or introduced as default types without removing user-defined types.

## Visual direction

- Use `#FFFCF6` as the primary washi-paper background and keep screens light.
- Use `#3E3A39` for 3 px outlines, text, and illustration strokes.
- Use flat pastel colors: coral `#F2A497`, yamabuki `#F6D27A`, water blue `#A8D3E6`, and bamboo green `#B9DAA5`.
- Use large rounded corners, clear spacing, and friendly, handwritten-style **Huninn** typography.
- Create custom SVG finance illustrations (coins, wallet, piggy bank, receipt, card, shopping bag) with a consistent outline and restrained detail.
- Use color and iconography to distinguish categories while keeping text and amounts easy to scan.

## Planned navigation and screens

Replace the current three-tab layout with four fixed bottom tabs:

1. **Home** — monthly overview, summary cards, spending breakdown, and quick add action.
2. **Transactions** — date selector and chronological transaction timeline, with access to the existing month/year filter and add/edit flows.
3. **Budget** — overall and per-category budget progress, remaining amounts, and near-limit indicators.
4. **Profile** — retain profile and account/settings entry points.

Move secondary destinations currently exposed through the drawer into Profile or another clear settings entry point, preserving access to expense type management, currency, notifications, and help. Keep expense creation/editing available as a modal or dedicated form.

## New features to add

### Home dashboard

- Welcome message and selected-month label.
- Illustrated monthly spending header.
- Summary cards for **Total Balance**, **Monthly Income**, **Monthly Expenses**, and **Remaining Budget**.
- Category spending breakdown for Food & Drinks, Transportation, Shopping, Bills, Entertainment, and Others.
- Mark the highest-spending category with **Top Spending**.
- Quick action to add a transaction.

### Transactions

- Horizontal date selector for choosing a day.
- Chronological timeline filtered to that date, with transaction title, category, time, and amount.
- Category color tags and a **Recurring** label for scheduled payments.
- Preserve existing month/year filtering and CRUD behavior.

### Budget tracker

- Overall monthly budget and remaining amount.
- Per-category budget, spent amount, remaining amount, and pastel progress bar.
- Show **Almost Reached** when a category approaches its configured limit.
- Continue supporting the existing monthly budget setting and budget-exceeded notification.

### Financial to-do list

- Add a checkable list for tasks such as paying bills, reviewing monthly expenses, setting next month’s budget, and tracking subscriptions.
- Persist task completion and task data so the list remains useful after closing and reopening the app.

## Data and behavior work

Before implementing the new summaries, define the source of truth and API support for:

- **Income:** amount, date, title/source, and optional category.
- **Transaction type:** distinguish income from expense; current records are expenses only.
- **Category budgets:** budget amount keyed by category and month.
- **Recurring transactions:** recurrence schedule and next due date; a display label alone does not create recurring behavior.
- **Transaction time:** current ISO date can contain a time, but the form and display need to preserve and show it consistently.
- **Financial tasks:** task text, completion state, and persistence strategy.
- **Balance:** define whether this is a manually maintained opening balance plus income minus expenses, or a derived total over a defined history. Do not infer it from a single month of expenses.

Confirm which API endpoints support these records. If the backend does not support them, plan the necessary backend and migration work before relying on the features in the UI. Existing user-defined expense types and currency preferences should continue to work.

## Implementation phases

1. **Foundation:** document existing route and API behavior; decide the income, balance, category budget, recurrence, and task data contracts.
2. **Design system:** add shared colors, typography, outlined rounded card primitives, category icon/tag styles, and reusable button styles. Load Huninn using the Expo-compatible font workflow. Add the SVG rendering dependency if needed and approved by the project’s Expo version.
3. **Navigation shell:** establish Home, Transactions, Budget, and Profile tabs, then relocate existing secondary navigation without removing destinations.
4. **Transactions refresh:** restyle expense forms and lists; add daily selection, chronological grouping, category tags, and recurring metadata while retaining add/edit/delete and month/year filters.
5. **Budget tracker:** extend existing monthly budget behavior with per-category budgets, remaining amounts, progress bars, and near-limit labels.
6. **Dashboard:** add income/balance summaries, monthly totals, category breakdown and top category, illustrated header, and quick add action.
7. **To-do list:** add task creation/checkoff and persistence.
8. **Motion and accessibility:** add gentle illustration float, tap bounce, date/category selection feedback, and smooth progress updates. Respect the system Reduce Motion preference by minimizing or disabling nonessential animation. Preserve accessible labels, readable contrast, and usable touch targets.

## Acceptance criteria

- The app uses the specified light palette, dark outlines, rounded cards, Huninn typography, and consistent custom finance illustrations.
- The four tabs are fixed and navigate to Home, Transactions, Budget, and Profile.
- Existing expense CRUD, month/year filtering, currency settings, user-defined types, and monthly budget notification continue to work.
- Dashboard totals and category summaries reflect the selected month and clearly define how income and balance are calculated.
- The date selector filters the transaction timeline; each row shows title, category, time, and amount, with recurring status when applicable.
- Budget amounts and remaining values are correct, and near-limit categories are clearly identified.
- To-do completion persists across app restarts.
- Animations are subtle and respond to the operating system’s Reduce Motion setting.

## Open product decisions

- Should the balance be calculated from a user-entered opening balance, imported account balance, or all recorded income and expenses?
- Should categories be fixed to the six listed categories, or should the app keep supporting custom categories alongside them?
- Should recurring transactions automatically create future entries, or only remind users and display a recurring label?
- Should financial tasks be seeded with the four examples, user-created only, or a combination?
- Which backend/database will own income, per-category budgets, recurring schedules, and to-do data?
