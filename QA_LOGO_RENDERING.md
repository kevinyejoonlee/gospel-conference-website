# Logo Rendering QA Guide

## Quick QA Methods

### 1. Browser DevTools (Easiest)
1. Open Chrome/Edge DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
3. Select a mobile device (iPhone 12 Pro, Samsung Galaxy, etc.)
4. Check the device pixel ratio (DPR) - should show 2 or 3 for Retina displays
5. Inspect the logo images and verify:
   - `image-rendering` is set to `auto`
   - No `crisp-edges` value
   - Check computed styles in the Elements panel

### 2. Real Device Testing
- **iOS Safari**: Test on iPhone/iPad (Retina displays)
- **Android Chrome**: Test on high-DPI Android devices
- **Zoom test**: Pinch to zoom in/out - logos should stay crisp

### 3. Online Testing Tools
- **BrowserStack** (browserstack.com) - Free trial, test on real devices
- **LambdaTest** (lambdatest.com) - Cross-browser testing
- **Responsive Design Mode**: Built into Chrome/Firefox DevTools

### 4. Visual Inspection Checklist
- [ ] Logo appears sharp on mobile (not pixelated/blurry)
- [ ] Logo scales smoothly when zooming
- [ ] Logo looks identical across different mobile browsers
- [ ] Logo renders correctly on both portrait and landscape
- [ ] Logo is crisp on high-DPI displays (iPhone, high-end Android)

### 5. Code Inspection
Check that all logos have:
```css
style={{ imageRendering: 'auto' }}
```

And verify in DevTools that the computed style shows:
- `image-rendering: auto` (not `crisp-edges`)

### 6. Test Different Scenarios
- Different zoom levels (100%, 150%, 200%)
- Different screen sizes (small phone, tablet)
- Different orientations (portrait/landscape)
- Different browsers (Safari, Chrome, Firefox on mobile)

## What to Look For

### ✅ Good (Smooth)
- Clean, sharp edges
- No pixelation or blurriness
- Consistent appearance across devices

### ❌ Bad (Pixelated)
- Jagged edges
- Blurry appearance
- Different quality on different devices

## Real Device vs Emulator Differences

**Why it looks different on real devices:**
- Real devices have actual device pixel ratios (2x, 3x) that emulators may not perfectly replicate
- iOS Safari has known SVG rendering quirks
- Hardware acceleration behaves differently
- Touch interactions can trigger different rendering paths

**Current fixes applied:**
- ✅ Mobile-specific CSS with `translate3d(0, 0, 0)` for GPU acceleration
- ✅ iOS Safari-specific fixes using `@supports (-webkit-touch-callout: none)`
- ✅ High-DPI display handling
- ✅ Explicit inline styles on all logo images
- ✅ `loading="eager"` to prevent lazy loading issues

## If Still Pixelated on Real Device

1. **Check the SVG files themselves**:
   - Open SVG files in a text editor (e.g., `/public/logo-navbar.svg`)
   - Ensure they're true vector graphics (not embedded raster images)
   - Look for `<image>` tags inside SVG (these are raster, not vector)
   - Check if SVG has `viewBox` attribute (important for scaling)

2. **Try inline SVG instead of `<img>` tag**:
   - Embed SVG code directly in JSX
   - This often fixes iOS Safari issues
   - Example:
   ```tsx
   <svg className="h-7 w-auto" viewBox="0 0 100 50">
     {/* SVG content here */}
   </svg>
   ```

3. **Check browser console on mobile**:
   - Use remote debugging (Chrome DevTools → More tools → Remote devices)
   - Or use Safari Web Inspector for iOS
   - Look for any rendering errors

4. **Verify device pixel ratio**:
   - Add this to a component temporarily:
   ```js
   console.log('DPR:', window.devicePixelRatio);
   ```
   - High DPR (2-3) means Retina/high-DPI display

5. **Test with different SVG files**:
   - Try a simple test SVG to see if it's file-specific
   - Create a minimal SVG to isolate the issue

