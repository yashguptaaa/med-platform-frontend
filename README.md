## MedLink Frontend (FE)

Next.js App Router UI that powers the MedLink doctors & hospitals discovery experience. This frontend now talks directly to the backend REST API (see `../BE`) for doctors, hospitals, jobs, and contact submissions.

### Environment variables

Copy the sample file and update the backend base URL if needed:

```bash
cp .env.example .env
```

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Ensure the backend (`../BE`) is running so filters and forms can access live data.

### Features wired to the backend

- **Doctors** (`/doctors`): server-side fetch with query params for specialization, city, sort order, pagination meta.
- **Hospitals** (`/hospitals`): filterable list with Redis-backed API responses.
- **Careers** (`/careers`): pulls real job records (admin-manageable via backend).
- **Help / Contact** (`/help`): contact form POSTs to `/api/contact` and shows success/error states.

### Notes

- Forms submit via `GET`, updating the URL so results can be shared/bookmarked.
- `apiFetch` (in `lib/api.ts`) centralizes calls to the backend and disables caching for fresh data.
- Domain types are defined in `types/` and stay aligned with the backend DTOs, making it easy to swap in real data or mock responses.
