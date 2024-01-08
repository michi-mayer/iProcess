# Testing

## Manual tests

### On a tablet device

#### Setup

1. Download the latest version of Android Studio and go through the installation process until it's finished.
2. Open Android Studio and create a dummy / empty project.
3. Go to the 'File' dropdown in Android Studio's top bar, and select 'Power Save mode'
4. Go to the 'Tools' dropdown in Android Studio's top bar, and select 'Device Manager'
5. Click on 'Create (Virtual) Device'; select the 'Tablet' category, and the 'Nexus 9' device definition. Click on 'Next'.
6. Select the 'Q' (API Level 29) system image; if it's not downloaded, click the 'Download' button. Click on 'Next'.
   1. If your laptop uses an Intel CPU, please switch to the `Intel images` tab instead of the default `Recommended` tab, and look for a system image tagged as `x86_64`
7. **Rename it as *Tablet device*** (don't omit this part, it's important), and click 'Finish'
8. Further instructions depend on your operative system of choice (Windows or MacOS)

##### MacOS setup

Open a terminal / shell session and run

```sh
# Make the Emulator app available to the PC user
echo 'export PATH="$HOME/Library/Android/sdk/emulator:$PATH"' >> $HOME/.bashrc
echo 'export PATH="$HOME/Library/Android/sdk/emulator:$PATH"' >> $HOME/.zshrc
source ~/.bashrc

# Create an app shortcut for the Emulator
mkdir -p ~/Applications/TabletEmulator
touch ~/Applications/TabletEmulator/TabletEmulator
echo '#!/bin/bash' >> ~/Applications/TabletEmulator/TabletEmulator
echo 'emulator @Tablet_device &' >> ~/Applications/TabletEmulator/TabletEmulator
chmod +x ~/Applications/TabletEmulator/TabletEmulator
```

Now, you can open the Emulator with the Finder app (`Command + Space`) by looking for `TabletEmulator`. It will open a new Terminal but it's safe to close it.

##### Windows setup

1. Create a `Emulators` folder in your Desktop folder. Then, create a file named `TabletEmulator.bat`.
2. Right-click on `TabletEmulator.bat` and click on `Edit` and copy-paste the following text:

   ```sh
   C:/Users/%USERNAME%/AppData/Local/Android/sdk/emulator/emulator.exe @Tablet_device
   ```

Now, you can open the Emulator by navigating to the `Emulators` folder in your Desktop folder, then right-clicking on the `TabletEmulator.bat` file and selecting `Run as administrator`.

#### Usage

1. Whenever you stop using the emulator, please click on the `Close` (❌) icon at the top of the right bar, instead of the `Power Off` button. This will keep all the configuration changes you did so far; otherwise, you'll need to set it up the next time you open the emulator.
2. You can attach a debugger to the emulator's *Google Chrome* session. To do that, open *Google Chrome* in your desktop PC, and then navigate to `chrome://inspect/#devices`. You should be able to see the Tablet device in the `Remote target` listing. To attach the debugger, click on `Inspect`.
