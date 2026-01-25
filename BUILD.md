# Building for Windows

This guide explains how to build standalone Windows executables for Sekiro Mod Manager.

## Prerequisites

```bash
# Install electron-builder
yarn add electron-builder --dev
# or
npm install electron-builder --save-dev
```

## Build Commands

### Build installer and portable version
```bash
yarn build
# or
npm run build
```

This will create:
- NSIS Installer (.exe) - Full installer with uninstaller
- Portable version (.exe) - Standalone executable that doesn't require installation

### Build Windows only
```bash
yarn build:win
# or
npm run build:win
```

## Output

Built files will be in the `dist/` folder:
- `Sekiro Mod Manager Setup-{version}.exe` - Installer
- `Sekiro Mod Manager-{version}-portable.exe` - Portable version

## Custom Icon

Place your icon file at `assets/icon.ico` (256x256 recommended).

If you don't have an icon, the default Electron icon will be used.

## Configuration

Build configuration is in `package.json` under the `build` section:

- **appId**: Unique application identifier
- **productName**: Display name
- **directories.output**: Output folder for builds
- **win.target**: Build targets (nsis installer, portable exe)
- **nsis**: Installer options
- **portable**: Portable executable options

## Troubleshooting

### Error: Cannot find module 'electron-builder'
Run: `yarn install` or `npm install`

### Build fails on Windows
- Make sure you have Windows SDK installed
- Run as Administrator if needed
- Check antivirus isn't blocking the build process

### App doesn't start after build
- Check console for errors
- Verify all dependencies are in the `files` array in package.json
- Test with `yarn start` before building

## Distribution

After building, you can distribute:
1. Upload to GitHub Releases
2. Share the portable .exe for quick testing
3. Distribute the installer for end users

For more options, see [electron-builder documentation](https://www.electron.build/)
