const { app, BrowserWindow, Menu } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
    autoHideMenuBar: true
  })

  // メニューバーを非表示にする
  win.setMenu(null)
  
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  // macOSの場合、アプリケーションがアクティブ化された時にウィンドウを再作成する
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// macOSではウィンドウが閉じてもアプリは終了しないので、
// 他のプラットフォームではウィンドウが閉じたらアプリを終了させる
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()  // macOS以外でウィンドウを閉じたらアプリを終了
  }
})
