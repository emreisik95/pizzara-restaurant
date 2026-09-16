# Pizzara mobile redesign

Goal: deliver a striking food-first opening and a practical restaurant menu using existing menu data and settings.

Design: tomato red #ce352b, butter #ffe8a3, olive #25392d, paper #fff9ed, ink #252820. Retain Antonio display and DM Sans body, with Cormorant for occasional handwritten-feeling editorial contrast. Signature: a large overhead pizza floating over oversized Italian-poster lettering. Mobile is an intentional centered composition, desktop an asymmetric poster. Use CSS perspective and Motion already installed; avoid a WebGL runtime for a photographic object.

1. Replace hero and header, respect existing editable title/image/hours and reservation setting. Keep menu reachable in first viewport. Add responsive and reduced-motion behavior.
2. Refine menu with sticky categories, Turkish-aware search, result count, empty state and photo-free presentation for missing images. Preserve prices, category links, and accessible dish dialog.
3. Bring reservation and footer into the same visual system, preserve form endpoint and improve modal keyboard behavior.
4. Verify production build and browser interactions at 360, 390, 768 and 1440 px; check overflow, category filtering, search, dialog focus/Escape, image failures, and reduced motion. Preview locally. No production deployment in this task.

Asset: GPT Image 2 via user-requested skill; generated imagery is campaign artwork, not a claim about a particular served dish.
