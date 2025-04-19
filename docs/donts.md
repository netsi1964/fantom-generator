# Negative Constraints & Things to Avoid

This document outlines what should NOT be done in the Fantom Generator project. These constraints are designed to maintain the project's focus, security, and simplicity.

## Technology Constraints

- DO NOT use any JavaScript frameworks (React, Vue, Angular, etc.)
- DO NOT use any CSS frameworks other than Tailwind CSS
- DO NOT add any backend dependencies or server-side code
- DO NOT use any external APIs or services in the MVP
- DO NOT include any third-party tracking or analytics
- DO NOT use WebGL or Canvas for rendering (stick to DOM)
- DO NOT use Web Workers or Service Workers in MVP
- DO NOT use WebAssembly

## Security & Privacy

- DO NOT store any data on external servers
- DO NOT make any network requests (except loading static assets)
- DO NOT use cookies or session storage (localStorage only if needed)
- DO NOT collect any user data or analytics
- DO NOT implement any authentication in MVP
- DO NOT store PII (Personally Identifiable Information)
- DO NOT implement any sharing features in MVP

## UI/UX Constraints

- DO NOT optimize for mobile devices (desktop/tablet first)
- DO NOT use complex animations or transitions
- DO NOT implement drag-and-drop in MVP
- DO NOT use custom fonts beyond system fonts or Google Fonts
- DO NOT use audio or video elements
- DO NOT implement real-time collaboration features
- DO NOT add social media integration
- DO NOT implement print functionality in MVP

## Data Management

- DO NOT implement cloud storage
- DO NOT implement auto-save (explicit save/load only)
- DO NOT implement version control for saved files
- DO NOT implement bulk import/export
- DO NOT implement data migration tools
- DO NOT implement backup features
- DO NOT implement synchronization features

## Feature Scope

- DO NOT implement actual AI functionality (mock only)
- DO NOT add image generation features
- DO NOT add image editing capabilities
- DO NOT implement user accounts
- DO NOT add commenting or annotation features
- DO NOT implement search functionality
- DO NOT add template management in MVP
- DO NOT implement undo/redo in MVP 