# ProspectIQ AI - Frontend Architecture & UI Organization

## Reorganized Feature Folders
- `components/layout/`: Holds base frame shell and global navigation layout.
- `components/common/`: Shared general components.
- `components/dashboard/`: Operational cards, command-center boards.
- `components/customer/`: Customer cards, transaction data grids.
- `components/relationship/`: Customer 360 panels, contact touchpoint grids.
- `components/predict/`: Growth indicators, churn probability gauges.
- `components/strategy/`: Simulation control centers, explainability charts.
- `components/workspace/`: RM tasks lists, calendar cards.
- `components/charts/`: Extracted reusable SVG chart containers.
- `components/notifications/`: Critical alert badges, morning briefs, executive drawers.

## Types and Hooks Centralization
- Custom custom hooks like `useCustomer`, `useDashboard`, `useTasks`, `useRelationship`, `usePredictIQ` are defined under `hooks/` to isolate state lifecycle from UI markup.
- Reusable TypeScript types grouped inside `types/`.
- Branding tokens mapped under `constants/`.
