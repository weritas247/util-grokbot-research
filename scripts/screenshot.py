import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:18791')
parser.add_argument('--item', default='update-01')
args = parser.parse_args()
out = Path('docs/screenshots')
out.mkdir(parents=True, exist_ok=True)

scenarios = [
    ('desktop', 1280, 800, 1, 'light'),
    ('mobile', 390, 844, 2, 'light'),
    ('desktop-dark', 1280, 800, 1, 'dark'),
    ('desktop-expanded', 1280, 800, 1, 'light'),
    ('mobile-expanded', 390, 844, 2, 'light'),
    ('desktop-expanded-dark', 1280, 800, 1, 'dark'),
]
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for name, width, height, scale, scheme in scenarios:
        context = browser.new_context(
            viewport={'width': width, 'height': height},
            device_scale_factor=scale,
            color_scheme=scheme,
        )
        page = context.new_page()
        page.on('pageerror', lambda error, n=name: errors.append(f'{n} pageerror: {error}'))
        page.on('console', lambda msg, n=name: errors.append(f'{n} console error: {msg.text}') if msg.type == 'error' else None)
        page.on('requestfailed', lambda request, n=name: errors.append(f'{n} requestfailed: {request.url} ({request.failure})'))
        target_url = f"{args.url.rstrip('/')}/#{args.item}" if 'expanded' in name else args.url
        page.goto(target_url, wait_until='networkidle')
        if 'expanded' in name:
            page.wait_for_function("document.querySelector(location.hash + ' .item-details[open]') !== null")
        page.screenshot(path=str(out / f'{name}.png'), full_page=True)
        page.screenshot(path=str(out / f'{name}-top.png'))
        context.close()
    browser.close()

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print('Screenshots saved; no page, console, or request errors.')
