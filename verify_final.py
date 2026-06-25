import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Start a local server
        import subprocess
        server = subprocess.Popen(['python3', '-m', 'http.server', '8080'])
        await asyncio.sleep(2)  # Wait for server to start

        try:
            pages = ['index.html', 'plan.html', 'history.html', 'explore.html']
            for p_name in pages:
                await page.goto(f'http://localhost:8080/{p_name}')
                await asyncio.sleep(1) # Allow JS to run
                await page.screenshot(path=f'final_{p_name.replace(".html", ".png")}')
                print(f"Captured final_{p_name}")

                if p_name == 'explore.html':
                    # Check for price units
                    content = await page.content()
                    if 'for 2 people' in content:
                        print("SUCCESS: 'for 2 people' found in explore.html")
                    else:
                        print("FAILURE: 'for 2 people' NOT found in explore.html")

                if p_name == 'plan.html':
                    # Check for guesthouses
                    content = await page.content()
                    if 'Dhoani Maldives Guesthouse' in content:
                        print("SUCCESS: Guesthouse data found in plan.html")
                    else:
                        print("FAILURE: Guesthouse data NOT found in plan.html")
        finally:
            server.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
