import * as path from 'path'

const iconFileBaseName = {
  on: 'onTrayIcon.png',
  off: 'offTrayIcon.png'
}

export function setupTray(isConnected: boolean | null) {
  const window = nw.Window.get() // 현재 윈도우 인스턴스 가져오기

  const iconPath = path.resolve(process.cwd(), iconFileBaseName[isConnected ? 'on' : 'off'])
  console.log('iconPath: ', iconPath)

  const tray = new nw.Tray({ title: 'My App', icon: iconPath }) // 트레이 아이콘 생성

  const menu = new nw.Menu()
  menu.append(new nw.MenuItem({
    label: 'Open',
    click: () => {
      window.show() // 화살표 함수 사용 및 window 변수 재사용
    }
  }))
  menu.append(new nw.MenuItem({
    label: 'Exit',
    click: () => {
      nw.App.quit() // 애플리케이션 종료
    }
  }))

  tray.menu = menu // 메뉴를 트레이에 할당

  window.on('close', () => {
    window.hide() // 윈도우 숨기기
    window.setShowInTaskbar(false) // 작업 표시줄에서 숨기기
  })

  tray.on('click', () => {
    window.show()
    window.setShowInTaskbar(true)
  })
}
