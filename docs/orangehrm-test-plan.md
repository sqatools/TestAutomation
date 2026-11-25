# OrangeHRM Public Demo UI Test Plan

## Scope and test safety

Target: `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`  
Demo credentials shown on the login page: `Admin` / `admin123`.

The suite uses the public demo administrator and checks authenticated navigation, listings, read-only profile views, and client-side form validation. It does not submit successful employee, leave, candidate, claim, or Buzz changes, nor delete or modify existing shared demo records.

## Authentication

1. **Valid administrator login** — Log in with the displayed demo credentials. Verify navigation to Dashboard and the active module title.
2. **Required username** — Leave username blank and submit a valid password. Verify the login page stays open and shows `Required`.
3. **Required password** — Enter the public username and leave password blank. Verify the login page stays open and shows `Required`.
4. **Invalid credentials** — Submit an invalid username/password pair. Verify the login page shows an invalid-credentials message.
5. **Password reset navigation** — Select Forgot your password and verify the reset page and username field.
6. **Logout/session guard** — Log out and request a protected Admin URL directly. Verify unauthenticated access returns to login.

## Dashboard and navigation

7. **Dashboard widgets** — Verify Time at Work, My Actions, Quick Launch, Buzz Latest Posts, and Assign Leave shortcut render.
8. **Primary module navigation** — Follow each side-navigation item and verify its route: Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, and Buzz.

## Admin

9. **System users list** — Verify System Users heading, user table, Add, Search, and Reset controls.
10. **System users filtering/reset** — Search the known Admin account; verify its row, then reset the form.

## PIM and My Info

11. **Employee list** — Verify employee information heading, filters, records, and pagination.
12. **Add employee form/cancel** — Verify first/last name inputs and required marker. Cancel and confirm the employee list is shown without saving.
13. **Personal details profile** — Verify Personal Details, Contact Details, Emergency Contacts, Dependents, Immigration, Job, Salary, Report-to, Qualifications, and Memberships tabs available to the demo administrator.
14. **Profile tab navigation** — Open Contact Details and Job and verify the corresponding views.

## Leave and Time

15. **Assign leave form** — Verify required employee, leave type, from-date, and to-date controls are available. Do not submit an assignment.
16. **Leave list** — Verify Leave List search and reset controls.
17. **Leave type configuration** — Verify the leave-type form, entitlement radio options, Save, and Cancel without changing shared configuration.
18. **Employee timesheet** — Open the timesheet workflow and verify its page title and accessible controls without submitting time.

## Recruitment

19. **Candidates list** — Verify candidate search/reset controls and the result table.
20. **Candidate required-field validation** — Submit the empty Add Candidate form. Verify required errors for first name, last name, and email and confirm no candidate is created.
21. **Vacancies list** — Verify vacancy search/reset controls without changing any vacancy.

## Performance, Directory, Maintenance, Claim, Buzz

22. **Performance reviews** — Verify the review search view and filter controls.
23. **Directory search view** — Verify search/reset controls and employee cards.
24. **Maintenance re-authentication** — Verify entry requires the password for the current session.
25. **Claim module** — Verify the module and navigation load; avoid creating or submitting claims.
26. **Buzz composer** — Verify the post editor and Post control without posting to the shared feed.

## Execution

All OrangeHRM cases carry the `@orangehrm` tag and can be run with:

```powershell
npx playwright test --grep "@orangehrm" --project=chromium
```
