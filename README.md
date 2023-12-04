# AQ Classic Launcher

A launcher for AdventureQuest Classic including some Quality of Life improvements.

## DISCLAIMER:
I am not Artix Entertainment!  
Now that I got your attention, I am a 3rd party developer unrelated to Artix Entertainment in any way, nor was this project endorsed by them.  
This removes any responsibility for you using this launcher from Artix Entertainment.  
Be sure you're **completely** aware of that before using it.  
  
Thanks,  
Nivp.  

Same goes for me.    
No warranties, guaranties, USE AT YOUR OWN RISK!  

## Version 1.6
In November 2023, I can across this launcher.  
I have spent many hours to try to understand how it works and to update it.  
This version kinda WORKS, but as it does not follow the [electron security guidelines](https://www.electronjs.org/docs/latest/tutorial/security),  
I would consider it UNSAFE.  
  
NOTE that this version is abandoned,  
after I have realised that electron is probably not needed at all.  
  
### How it worked:  
"Electron embeds Chromium and Node.js to enable web developers to create desktop applications."  
This application opened a Chromium browser tab and loaded the flash plugin into it with the right params to load AQ.  
It could also open new tabs or for Multiscreen use one tab and load the flash plugin multiple times.  
One could then package all this for multiple platforms.  
However, you still needed to install Node.js and npm.

###  How it works now:
As flash is now considered dead, it would be a security risk to load a flash plugin.  
More importantly as Chromium has dropped support for it,  
you could only load it into an old Chromium version.    
This of course would be a bigger risk...  
  
BUT there is [Ruffle](https://ruffle.rs/).  
It is a highly supported alternate plugin to play flash content.  
You can just install it into your browser and play flash games again.  
Some game sites load it automatically for you.  
  
So I could have loaded the ruffle extension for Chromium into this project,  
but that would have been harder and thankfully Ruffle can be loaded as like any other JS library.    
(At this point, I thought, why use electron?  
I could just as easily make a HTML file and a JS file that load Ruffle.  
You could just open this in any browser.)  
  
NOTE that drag and drop and isDev modules have been removed from the dependencies,  
because they are old and may be vulnerable.  
Also I have started to reorganize the project, which is only partially done.  
I have mode parts of the JS code to the `modules` directory.  
Popop menu content (like war wins) is no longer working because the AQ website has changed.    
This could be fixed, but of course you can just as well open a normal browser to check them...  
(Popup wasn't a priority to get working again...)  
  
Multiscreen works, but it seems that all game objects only use one CPU core,  
so it becomes a slideshow at 4 screens...  
Using 4 browser windows seems to do a bit better...  
  
NOTE right now with Firefox the Ruffle plugin 'lingers' after closing the game tab.  
This is using CPU unnecessarily.  
NOTE Ruffle is a WIP - work in progress.  
There may be issues with playing flash content.  
I have found that sometimes you can't kill a monster.  
It will have 1 HP, no matter how long you hit it.  
The only solution is to close the tab and start a new one, and then relogin to AQ.  
This project uses the latest Ruffle.  
Hopefully these problems will be fixed soon.  
  
NOTE all this has ONLY been tested on Debian 12 linux.  
  
First install Node.js (and npm).
Install this project with:  
`npm install`  
Start with:  
`npm start`

## ORIGINAL README:  
<img src="https://i.imgur.com/hbVZDap.png" width="300" />  

## Features
Feature List:
- Automatically fetches most recent AQ version.
- Tabbed interface: load up several characters at the same time
- Multiscreen support: Open several AQ instances on the same tab
- Character page loader: Input a character ID and press "Go" to open it in new tab.
- Keyboard Shortcuts:
  - F4 to clear cache
  - F5 to refresh
  - Ctrl+F5 to refresh and clear cache
  - F11 toggle full screen
  - Ctrl+Shift+I to open the Developer Console
- Menu icon for various AQ resources that open in a draggable window.
- Change the current tab's server to play on multiple servers or accounts.


Screenshots:
https://imgur.com/a/QrbBoN2

## Architecture
- [Node.js](https://nodejs.org/en/)
- [Electron](https://www.electronjs.org/)
- [electron-tabs](https://github.com/brrd/electron-tabs/)
- [dragula](https://www.npmjs.com/package/dragula)
- [electron-is-dev](https://www.npmjs.com/package/electron-is-dev)
- [electron-packager](https://github.com/electron/electron-packager)

## Building from source
### Install Requirements
  ```shell
  npm install
  ```

### Include Flash Player plugin
  Do note that per the Adobe Flash Player license agreement I can't distribute it, and you are therefore required to include it yourself in the resources folder.
  The most recent Flash version that doesn't include the Killswitch is 32.0.0.371.
  The plugins should be renamed as follows:

  Linux 32-bit:
  ```libpepflashplayer_32.so```

  Linux 64-bit:
  ```libpepflashplayer_64.so```

  Windows 32-bit:
  ```pepflashplayer_32.dll```

  Windows 64-bit:
  ```pepflashplayer_64.dll```

  OS X:
  ```PepperFlashPlayer.plugin```

  ARM Linux:
  ```libpepflashplayer_armv7l.so```

### Package

  #### Windows:
  
  Windows has a script to automatically build for all available platforms:
  
  ```batch
  ./build.bat [version]
  ```
  
  **For example**:
  ```batch
  ./build.bat 1.4.4
  ```
  
  Otherwise run the same command as Linux for manually building for each platform.
  
  #### Linux:
  ```terminal
  npm run package-[platform]
  ```
  
  **Platforms**: mac, win, win64, linux, linux64, linuxarmv7l
  
  **For example**, building to Windows 64-bit would be:
  ```terminal
  npm run package-win64
  ```
