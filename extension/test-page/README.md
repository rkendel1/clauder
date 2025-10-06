# Browser Inspector Test Page

This is a simple HTML test page for demonstrating the Browser Inspector feature.

## How to Use

1. Start a local web server in this directory:
   ```bash
   # Using Python 3
   python3 -m http.server 3000
   
   # Or using Python 2
   python -m SimpleHTTPServer 3000
   
   # Or using Node.js http-server (install with: npm install -g http-server)
   http-server -p 3000
   
   # Or using PHP
   php -S localhost:3000
   ```

2. Open VS Code

3. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)

4. Type "Open Browser Inspector" and press Enter

5. The Browser Inspector panel will open with `http://localhost:3000` loaded

6. Click the "Inspect Mode: OFF" button to enable inspect mode

7. Hover over elements to see them highlighted

8. Click on elements to capture their information and send it to Claude

## Features to Test

- **Header Section**: Test clicking on the title and subtitle
- **Card Grid**: Test the three feature cards with data-component attributes
- **Button Group**: Test the three different button styles (primary, secondary, danger)
- **Form Section**: Test various form elements (inputs, textarea, labels)
- **Footer**: Test the footer text

All elements have appropriate `data-component` attributes for testing the component tracking feature.

## Expected Behavior

When you click on an element in Inspect Mode:

1. The element should flash briefly (blue background)
2. The status bar at the bottom should show: "Selected: [CSS selector]"
3. The VS Code Output Console (Kuhmpel channel) should log:
   - Element selected: [TAG] - [SELECTOR]
   - data-component: [VALUE] (if present)
4. If Claude is available, it should receive a message: "Explain this component: [selector]"

## CSS Selector Examples

Here are some example selectors you should see when clicking on elements:

- Header: `#header` or `div#header`
- Card: `div.card:nth-of-type(1)` or similar
- Primary Button: `button.primary`
- Input Field: `input#name` or `input[type="text"]`
- Footer: `div.footer`
