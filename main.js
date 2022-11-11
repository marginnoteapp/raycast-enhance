/**
 * MIT License
 * Copyright © 2022 MarginNote
 * Github: https://github.com/marginnoteapp/raycast-enhance
 * Welcom to contribute to this project!
 */

try {
  ;(() => {
    const Addon = {
      name: "Raycast Enhance",
      key: "raycastenhance"
    }
    const console = {
      log(obj, suffix = "normal") {
        JSB.log(`${Addon.key}-${suffix} %@`, obj)
      }
    }
    const isMac = Application.sharedInstance().osType === 2
    JSB.newAddon = mainPath => {
      function fetchNotebook() {
        try {
          if (!isMac) return
          const notebooks = Database.sharedInstance()
            .allNotebooks()
            .reduce((acc, k) => {
              if (k.flags === 2 || k.flags === 3) {
                acc.push({
                  id: k.topicId,
                  title: k.title,
                  lastVisit: k.lastVisit.getTime(),
                  type: k.flags === 2 ? 1 : 2
                })
              }
              return acc
            }, [])
          NSData.dataWithStringEncoding(
            JSON.stringify(notebooks),
            4
          ).writeToFileAtomically(mainPath + "/notebooks.json", false)
        } catch (err) {
          console.log(err)
        }
      }
      let isInNotebook = false
      return JSB.defineClass(
        Addon.name + ": JSExtension",
        {
          sceneDidDisconnect() {
            fetchNotebook()
          },
          sceneWillResignActive() {
            isInNotebook && fetchNotebook()
          },
          notebookWillOpen() {
            isInNotebook = true
          },
          notebookWillClose() {
            isInNotebook = false
          }
        },
        {}
      )
    }
  })()
} catch (err) {
  JSB.log("raycastenhance-error %@", String(err))
}
