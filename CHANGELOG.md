# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Planned
- Windows installer (.exe)
- Mod categories/tags
- Search and filter mods
- Mod profiles (save/load mod configurations)
- Backup and restore functionality
- More languages support
- Update checker
- Mod compatibility database
