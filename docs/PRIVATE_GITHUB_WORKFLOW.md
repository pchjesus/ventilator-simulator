# Private GitHub review / execution workflow (v0.3.0)

## Scope
Keep `pchjesus/ventilator-simulator` **private**. Public Pages deployment is explicitly deferred.
The GitHub **Code** tab shows source files, not a running app.

## Review without publishing
1. Open [repository Code](https://github.com/pchjesus/ventilator-simulator) and inspect `index.html`, `src/app.js`, `src/sim-model.js`, `src/waveform-model.js`, `README.md` and `DEVLOG.md`.
2. Open [Actions](https://github.com/pchjesus/ventilator-simulator/actions) → **Ventilator simulator checks**.
3. To run tests again without editing code, select **Run workflow**, branch `main`.
4. Open the completed workflow run. Verify three jobs: `test`, `browser`, `package`.
5. In **Artifacts**, download `browser-screenshots` for PC/360px/320px screenshots or `pb980-web-only` for a runnable browser bundle.

## Run the interactive prototype locally
Option A: select **Code → Download ZIP** in the private repository, extract the whole project.
Option B: download the `pb980-web-only` artifact from Actions and extract it.
In either case, serve the extracted folder via a static server (for example Python 3):

```sh
python -m http.server 8077
```

Open http://127.0.0.1:8077/ in the same computer's browser. Keep `index.html`, `styles.css`, `src/app.js`, `src/sim-model.js`, `src/waveform-model.js` in their respective paths. Opening `index.html` as `file://` may fail due to browser ES module rules.

## When a hosted link is desired
Private GitHub repository does **not** imply a private Pages website.
GitHub Free offers Pages on public repositories; eligible paid plans support Pages from private source repositories, but access-restricted Pages requires a supported Enterprise Cloud organization.
Do not change repository visibility or publish a site without a deliberate release decision.

## Verification boundaries
Automated Chromium checks provide evidence for browser logic and screen layout at tested widths. They do **not** validate clinical accuracy, exact PB980 behavior, or actual physical mobile hardware.
