Local testing and phone access

Quick summary
- To test locally (no GitHub push), run the included PowerShell server `serve_local.ps1`.
- The server binds to your machine's primary IPv4 address and serves files from this folder.
- Access from your PC: http://127.0.0.1:<port>/?id=akazawa
- Access from your phone on the same Wi‑Fi: http://<YOUR_LAN_IP>:<port>/?id=akazawa

Run (PowerShell)

1) Open PowerShell in this folder (or `cd` to this folder) and run:

```powershell
# choose a port (e.g. 12345)
powershell -NoProfile -ExecutionPolicy Bypass -File .\serve_local.ps1 -port 12345
```

2) If the script prints `Serving C:\... on http://<LAN_IP>:<port>/` then open that URL from your phone's browser.

Notes on finding your LAN IP
- In PowerShell run: `ipconfig` and look for `IPv4 Address` under your Wi‑Fi / Ethernet adapter. Use that value as `<YOUR_LAN_IP>`.

Firewall
- If you cannot reach the URL from your phone, allow `powershell.exe` or open the chosen port in Windows Firewall.
- Example (PowerShell as Admin):

```powershell
New-NetFirewallRule -DisplayName "Allow Local HTTP" -Direction Inbound -Protocol TCP -LocalPort 12345 -Action Allow
```

GitHub Pages alternative
- If you prefer not to run locally, use the already published URL:
  https://kakimittu.github.io/ar-test/?id=akazawa
- Pushing updated files to that repo (GitHub) will make changes visible online.

Troubleshooting
- If the script fails to start because the port is in use, choose another port (e.g. 8080, 12345).
- If you see an error `Failed to start listener`, check that the printed prefix is valid and not already bound.

If you want, I can:
- Attempt to start the server here and report the printed URL (if environment allows).
- Or prepare a small GitHub push patch (if you provide repo access) to update the live site.

Next step: tell me whether you want local testing (phone on same Wi‑Fi) or push to GitHub Pages. I can run the local server now and show the exact URL. If you want GitHub Pages, I can prepare files to push (you will need to push them or provide repo access).