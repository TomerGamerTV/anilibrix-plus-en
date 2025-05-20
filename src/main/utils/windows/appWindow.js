import { BrowserWindow, app, session  } from 'electron'
import windowStateKeeper from 'electron-window-state'
import path from 'path'

export default class Window {
  /**
   * Constructor
   *
   * @return Window
   */
  constructor () {
    this._window = null
  }

  /**
   * Get window configuration
   *
   * @return Object
   */
  getWindowConfiguration () {
    return {}
  }

  /**
   * Get window url
   *
   * @return String|null
   */
  getWindowUrl () {
    return null
  }

  /**
   * Get window
   *
   * @return BrowserWindow|null
   */
  getWindow () {
    return this._window
  }

  /**
   * Create window
   *
   * @return this
   */
  createWindow (configuration) {
    const windowsConfig = this.getWindowConfiguration()
    let opts = { ...windowsConfig, ...configuration }

    // Apply security-conscious webPreferences
    opts.webPreferences = {
      ...(opts.webPreferences || {}),
      webSecurity: true, // Disable to false only if absolutely necessary and risks are understood
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Recommended for security, ensure app logic is compatible
      enableRemoteModule: true, // Required if using @electron/remote, consider alternatives if possible
      // sandbox: true, // Consider enabling sandbox for maximum security, may require IPC refactoring
    };

    const mainWindowState = windowStateKeeper({
      file: 'window-state.json',
      defaultWidth: opts.width,
      defaultHeight: opts.height,
      fullScreen: false
    })

    console.log('Window-state: is Main?', this.isMain ?? false)

    if (this.isMain === true) {
      // Create the window using the state information
      opts = Object.assign(opts, {
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
      })

      this._window = new BrowserWindow(opts)

      // Let us register listeners on the window, so we can update the state
      // automatically (the listeners will be removed when the window is closed)
      // and restore the maximized or full screen state
      mainWindowState.manage(this._window)
    } else {
      this._window = new BrowserWindow(opts)
    }

    // Set Content Security Policy
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src *;"
          ]
        }
      });
    });

    return this
  }

  /**
   * Load window url
   *
   * @return this
   */
  loadUrl () {
    const window = this.getWindow()
    const windowUrl = this.getWindowUrl()

    if (window && windowUrl) {
      window.loadURL(windowUrl)
    }

    // Set Content Security Policy
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src *;"
          ]
        }
      });
    });

    return this
  }

  /**
   * Send to window
   *
   * @param channel
   * @param payload
   */
  sendToWindow (channel, payload) {
    const window = this.getWindow()
    if (window) {
      window.webContents.send(channel, payload)

      if (process.env.NODE_ENV === 'development') {
        console.log({
          channel,
          payload
        })
      }
    }

    // Set Content Security Policy
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src *;"
          ]
        }
      });
    });

    return this
  }

  /**
   * Show devtools
   *
   * @return void
   */
  showDevTools () {
    this.getWindow().openDevTools({ mode: 'detach' })
  }
}
