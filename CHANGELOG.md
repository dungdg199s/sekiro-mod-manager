# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Category system for mods with 8 predefined categories:
  - Audio
  - Skins
  - Items
  - Weapons
  - Gameplay
  - UI
  - Utilities
  - Visuals & Graphics
- Category filter bar to filter mods by category
- Category checkbox grid in upload modal

### Changed
- Replaced free-form tags with fixed category system
- Improved UI for category management with checkboxes
- Enhanced category badge styling

### Technical  
- Implemented modular vanilla JavaScript architecture
- Created comprehensive module system:
  - State management: reactive Proxy-based appState, storageManager
  - Service layer: modService, i18nService, validationService
  - UI components: modCard, modal, categoryUI, dropZone, dragAndDrop, statusBar
  - Utilities: sanitize (XSS prevention), domHelpers, debounce, eventBus
- Replaced 660-line monolithic renderer.js with organized modules
- Implemented app.js as main entry point
- Added ES6 module support to index.html
- Improved code maintainability with clear separation of concerns
- Added comprehensive JSDoc documentation
- Implemented event-driven architecture with pub/sub pattern

## [1.0.0] - 2026-01-25

### Added
- Initial release of Sekiro Mod Manager
- Upload mods from ZIP and RAR archives
- Activate/deactivate mods with toggle switch
- Auto-extract mods to game directory
- Conflict detection between mods
- Drag and drop file upload
- Drag and drop mod reordering
- Edit mod metadata (name and description)
- Auto-detect Sekiro game directory from Steam
- Multilingual support (Vietnamese and English)
- Dark theme UI
- Status bar notifications for actions
- Debounce for rapid toggle actions
- Prevent deletion of active mods

### Technical
- Built with Electron.js 28.0.0
- Modular code structure (main, handlers, helpers)
- IPC communication with context isolation
- Local storage for user preferences
- JSON-based mod metadata storage

## [Unreleased]

### Added
- **Category System**: Implemented predefined mod categories based on Nexus Mods standard
  - 10 fixed categories: Audio, Customisation, Death Screens, Gameplay, Miscellaneous, Saved Games, User Interface, Utilities, Visuals and Graphics, Weapons and Armour
  - Multi-select category assignment via checkbox grid in upload/edit modal
  - Category badges displayed on mod cards with gradient styling
  - Category filter bar with all categories + "All Mods" option
  - Category-based mod filtering functionality

### Changed
- Replaced free-form tag input system with predefined category checkboxes
- Updated UI from text input to 2-column checkbox grid for better UX
- Mod data structure: `tags` field renamed to `categories`
- Filter interface now shows fixed categories instead of dynamic tags

### Technical
- Added `PREDEFINED_CATEGORIES` constant in renderer.js
- Renamed IPC handlers: `add-tag` → `add-category`, `remove-tag` → `remove-category`, `get-all-tags` → `get-all-categories`
- Updated API methods in preload.js to use category terminology
- CSS classes renamed: `.mod-tags` → `.mod-categories`, `.tag-filter` → `.category-filter`, etc.
- Checkbox grid styling with hover and checked states
- Translations updated for Vietnamese and English

### Planned
- Windows installer (.exe)
- Search functionality for mods
- Mod profiles (save/load mod configurations)
- Backup and restore functionality
- More languages support
- Update checker
- Mod compatibility database
- Subcategories or custom tags within categories
