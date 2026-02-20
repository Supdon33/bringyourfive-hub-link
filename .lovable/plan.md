

# Fix "List a Run" to Populate Available Runs

## Problem
The "Available Runs" section currently displays **hardcoded static data**. When a user submits a new run via the "List a Run" dialog, it gets saved to the database but the UI never fetches from the database -- so the new run never appears.

## Solution
Replace the static games array with live data fetched from the `runs` table, and refetch after a new run is added.

## Changes

### 1. Create a custom hook: `src/hooks/useRuns.ts`
- Use `@tanstack/react-query` to fetch runs from the `runs` table
- Support filtering by skill level
- Export a query key so we can invalidate after inserting

### 2. Update `src/pages/Index.tsx`
- Remove the hardcoded `games` array
- Use the new `useRuns` hook to fetch runs from the database
- Show a loading state while fetching
- After `ListRunDialog` completes, invalidate the runs query to trigger a refetch

### 3. Update `src/components/ListRunDialog.tsx`
- Accept a callback or use `useQueryClient` to invalidate the `runs` query on successful insert
- This ensures the Available Runs section immediately reflects the new run

### 4. Seed initial data (optional)
- Insert the 6 sample runs into the database so the section isn't empty for the first users, or keep them as fallback data

## Technical Details

```text
User clicks "List a Run"
  -> Fills form, submits
  -> INSERT into runs table (already works)
  -> onSuccess: invalidateQueries(['runs'])
  -> React Query refetches runs
  -> Available Runs section re-renders with new data
```

The `runs` table already has the correct schema (`title`, `location`, `gym_name`, `time`, `skill_level`, `spots_total`, `spots_filled`) and RLS policies allowing authenticated users to view all runs and insert their own.

