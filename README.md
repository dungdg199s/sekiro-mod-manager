# 🎮 Sekiro Mod Manager

<p align="center">
  <img src="https://img.shields.io/badge/electron-28.0.0-blue.svg" alt="Electron">
  <img src="https://img.shields.io/badge/node-%3E%3D16-green.svg" alt="Node">
  <img src="https://img.shields.io/badge/license-MIT-orange.svg" alt="License">
</p>

A desktop mod manager for **Sekiro: Shadows Die Twice** built with Electron.js, featuring a user-friendly interface and easy-to-use functionality.

## ✨ Features

- 📦 **Upload & Manage Mods**: Support for ZIP and RAR files
- 🔄 **Quick Activation**: Enable/disable mods with one click, auto-extract to game directory
- ⚠️ **Conflict Detection**: Warning when mods have overlapping files
- 🎯 **Auto-detect Game**: Automatically find Sekiro installation directory
- 🌍 **Multilingual**: Support for Vietnamese and English
- 🖱️ **Drag & Drop**: Drag files to upload or reorder mods
- ✏️ **Edit Mods**: Update mod name and description
- 💾 **Order Management**: Arrange mods to handle file conflicts
- 🎨 **Beautiful UI**: Dark theme with smooth user experience

## 📋 System Requirements

- Windows 10/11
- Node.js 16 or higher
- Sekiro: Shadows Die Twice (Steam version)

## 🚀 Installation

### Download (Recommended)

*Coming soon: Download .exe file from [Releases](../../releases)*

### Build from source

```bash
# Clone repository
git clone https://github.com/your-username/sekiro-mod-manager.git
cd sekiro-mod-manager

# Install dependencies
yarn install
# or
npm install

# Run application
yarn start
# or
npm start
```

## 📖 User Guide

### 1. Setup Game Directory

- Open Settings (⚙️)
- Select Sekiro installation folder (app will auto-detect if possible)
- Folder must contain `sekiro.exe`

### 2. Upload Mod

**Method 1: Upload Button**
- Click "➕ Upload Mod"
- Select ZIP or RAR file
- Enter name and description
- Click "Save Mod"

**Method 2: Drag & Drop**
- Drag ZIP/RAR file into drop zone
- Fill in information and save

### 3. Activate Mod

- Toggle switch next to mod name
- Mod will be extracted to `[Game Directory]/mods`
- If there are file conflicts, the app will warn you

### 4. Manage Mods

- **Reorder**: Drag mod cards to change order (later mods overwrite earlier ones)
- **Edit**: Click "✏️ Edit" to change name/description
- **Delete**: Click "🗑️ Delete" (must deactivate mod first)

## 🗂️ Project Structure

```
sekiro-mod-manager/
├── src/
│   ├── main/
│   │   ├── main.js      # Electron main process
│   │   ├── handlers.js  # IPC handlers
│   │   └── helpers.js   # Utility functions
│   ├── preload/
│   │   └── preload.js   # Preload script
│   └── renderer/
│       ├── index.html   # UI
│       ├── renderer.js  # Client logic
│       ├── styles.css   # Styling
│       └── translations.js # i18n
├── package.json
└── README.md
```

## 💾 Where is data stored?

- **Mod files**: `%LOCALAPPDATA%\Sekiro\mods\`
- **Metadata**: `%LOCALAPPDATA%\Sekiro\mods\mods.json`
- **Settings**: Browser localStorage

## 🛠️ Development

```bash
# Run in development mode with DevTools
yarn dev

# Format code
yarn format
```

## ⚠️ Important Notes

- ⚠️ **Backup your game data** before using mods
- ⚠️ Some mods may not be compatible with each other
- ⚠️ Mod order is important - mods activated later will overwrite earlier ones
- ⚠️ Disable all mods before updating the game

## 🐛 Bug Reports

If you encounter issues, please create an [Issue](../../issues) with:
- Application version
- Operating system
- Detailed error description
- Screenshots (if applicable)

## 🤝 Contributing

All contributions are welcome! Please:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📝 License

This project is released under the [MIT License](LICENSE).

## 🙏 Credits

- Built with [Electron](https://www.electronjs.org/)
- Archive extraction: [adm-zip](https://github.com/cthackers/adm-zip), [node-unrar-js](https://github.com/YuJianrong/node-unrar-js)
- Game: [Sekiro: Shadows Die Twice](https://www.sekirothegame.com/) by FromSoftware

## ⭐ Support

If you find this project useful, give it a ⭐ on GitHub!

---

<p align="center">Made with ❤️ for Sekiro modding community</p>
