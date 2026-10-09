# Future web deployment option — private development source

## Historical optional plan (not enabled)
**Current decision: keep the original repository private and DO NOT deploy a public website.** GitHub-only source/test review is documented in [PRIVATE_GITHUB_WORKFLOW.md](PRIVATE_GITHUB_WORKFLOW.md). The steps below are an optional future deployment plan, not a required task.

Keep `pchjesus/ventilator-simulator` **private**.
Deploy only five runnable code files and `.nojekyll` to a separate public repository.
Do **not** publish the lecture reference image, internal notes, or other assets by default.

## Before deployment
1. Confirm that project is an educational *PB980-inspired UI prototype* and not a clinically validated PB980 emulator.
2. Re-run GitHub Actions tests; require `test` and `browser` jobs to succeed.
3. Download the `pb980-web-only` artifact from Actions and unzip it.
4. Confirm the archive contains only:
   - `index.html`
   - `styles.css`
   - `src/app.js`
   - `src/sim-model.js`
   - `src/waveform-model.js`
   - `.nojekyll`

## One-time manual setup
Create an **empty public repository**, suggested name `ventilator-simulator-web`, under the same GitHub account.
Do not switch the original source repository to public.
Once created and connected to the GitHub app, upload **only** the six site files to its main branch, preserving `src/` paths.

In the public deploy repository:
- Settings → Pages → Build and deployment
- Source: Deploy from a branch
- Branch: `main`, folder `/(root)`; Save

Wait for Pages deployment. Visit the exact URL shown by GitHub Settings → Pages and verify it actually loads. Never assume publication from a successfully completed push alone.

## Acceptance checklist after deployment
- Desktop: header + top measurements + waveforms + setting controls visible
- Increment/decrement + reset work without JS errors
- Help and all CIRCUIT views work
- Mobile view has no page-level horizontal overflow
- Refresh and direct URL visit work
- Public repo contains no classroom image or other unapproved content

## Limitations
- GitHub Free Pages requires a public repository; private repository Pages is plan-dependent.
- The private source's `GITHUB_TOKEN` cannot simply write to another public repo without explicitly scoped cross-repo authorization.
- Initial deployment is manual; cross-repository automation should be considered only after reviewing secrets and permissions.
- No backend, no patient data, no medical device connectivity.
