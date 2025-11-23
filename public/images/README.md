# Images Directory Structure

This directory contains all the organized image assets for the Gospel Conference website.

## Directory Organization

```
images/
├── header/
│   ├── logo.png                    # GC logo for header navigation
│   └── tabs-reference.png          # Reference image for navigation tabs design
│
├── home/
│   ├── hero-background.png         # Background image for hero section
│   ├── hero-logo.png               # Large logo displayed above title in hero
│   ├── hero-title.png              # Title reference image
│   ├── hero-register-button.png    # Register button reference
│   ├── intro-section.png           # Introductory text section reference
│   ├── speakers-section.png        # Full speakers section reference
│   └── registration-section.png    # Registration section reference
│
├── gc26/
│   ├── hero-background.png         # Background for GC26 page
│   ├── hero-title.png              # Title for GC26 page
│   ├── section-2.png               # GC26 section 2
│   ├── section-3.png               # GC26 section 3
│   └── section-4.png               # GC26 section 4
│
└── about/
    └── about-page.png              # About page reference
```

## Notes

### Speakers Section
The speakers section currently uses a placeholder image for all three speakers. You'll need to:
1. Extract individual speaker photos from `home/speakers-section.png`, OR
2. Provide separate images for:
   - Carlton Wynne (Main Speaker)
   - Juhan Song (Seminar Speaker)
   - Richard Min (Seminar Speaker)

Update the image paths in `components/speakers-section.tsx` once individual images are available.

### Image Usage
All images are referenced using Next.js Image component with optimized paths:
- `/images/[category]/[filename].png`

### Original Assets
The original assets from `jesslee-20251120iqOPYHsm/` have been organized into this structure with descriptive names for easy maintenance.
