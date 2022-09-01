;(function () {
  const Addon = {
    name: "Raycast Enhance",
    key: "raycastenhance"
  }
  const console = {
    log(obj) {
      JSB.log(`${Addon.key} %@`, obj)
    }
  }
  const isMac = Application.sharedInstance().osType === 2
  function dateFormat(date, fmt = "YYYY-mm-dd HH:MM") {
    let ret
    const opt = {
      "Y+": date.getFullYear().toString(),
      "m+": (date.getMonth() + 1).toString(),
      "d+": date.getDate().toString(),
      "H+": date.getHours().toString(),
      "M+": date.getMinutes().toString(),
      "S+": date.getSeconds().toString() // second
    }
    Object.entries(opt).forEach(([k, v]) => {
      ret = new RegExp("(" + k + ")").exec(fmt)
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1 ? v : v.padStart(ret[1].length, "0")
        )
      }
    })
    return fmt
  }
  JSB.newAddon = (mainPath) => {
    function fetchNotebook() {
      try {
        if (!isMac) return
        const notebooks = Database.sharedInstance().allNotebooks().reduce((acc, k) => {
          if (
            k.flags === 2 ||
            k.flags === 3
          ) {
            acc.push({
              id: k.topicId,
              title: k.title,
              lastVisit: dateFormat(k.lastVisit, "YYYY-mm-dd HH:MM"),
              type: k.flags === 2 ? 1 : 2
            })
          }
          return acc
        }, [])
        NSData.dataWithStringEncoding(
          JSON.stringify(notebooks),
          4
        ).writeToFileAtomically(mainPath + "/notebook.json", false)
      } catch (err) {
        console.log(err)
      }
    }
    return JSB.defineClass(
      Addon.name + ": JSExtension",
      {
        sceneDidDisconnect() {
          fetchNotebook()
        },
        sceneWillResignActive() {
          fetchNotebook()
        }
      },
      {}
    )
  }
})()