const raw = [
  {
    id: 1,
    name: "Data User",
    page: "user",
    submenu: [],
  },
  {
    id: 2,
    name: "Product",
    page: "product",
    submenu: [],
  },
  {
    id: 3,
    name: "Transaction",
    page: "transaction",
    submenu: [],
  },
  {
    id: 4,
    name: "Admin",
    page: "",
    submenu: [
      {
        id: 1,
        name: "Admin",
        page: "admin",
      },
      {
        id: 2,
        name: "Admin Role",
        page: "admin_role",
      },
    ],
  },
  {
    id: 5,
    name: "Settings",
    page: "",
    submenu: [
      {
        id: 3,
        name: "Change Password",
        page: "settings_change_password",
      },
    ],
  },
]

function transform(raw) {
  const temp = []
  raw.forEach((e) => {
    temp.push({
      name: e.name,
      submenu: e.submenu.map((menu) => {
        return menu.id
      }),
    })
  })

  // return {
  //   role: "Role Name",
  //   menu: temp,
  // }

  return temp
}
