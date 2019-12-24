import request from "@/utils/request";
import axios from "axios";

export function login(username, password) {
  return request({
    url: "/user/login",
    method: "post",
    data: {
      username,
      password
    }
  });
}

export function getInfo(token) {
  return request({
    url: "/user/info",
    method: "get",
    params: { token }
  });
}

export function getRouter(roule) {
  if (roule === "admin") {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: {
            router: [
              {
                id: 1,
                name: "Nested",
                code: null,
                description: null,
                url: "/nested",
                generatemenu: 0,
                sort: 0,
                parentId: null,
                permName: null,
                redirect: "/nested/menu1",
                title: "Nested",
                icon: "nested",
                children: [
                  {
                    id: 2,
                    name: "Menu1",
                    code: null,
                    description: null,
                    url: "menu1",
                    generatemenu: 0,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: "",
                    title: "Menu1",
                    icon: "menu1",
                    children: [
                      {
                        id: 4,
                        name: "Menu1-1",
                        code: null,
                        description: null,
                        url: "menu1-1",
                        generatemenu: 0,
                        sort: 0,
                        parentId: 2,
                        permName: null,
                        redirect: "",
                        title: "Menu1-1",
                        icon: "",
                        children: null
                      },
                      {
                        id: 5,
                        name: "Menu1-2",
                        code: null,
                        description: null,
                        url: "menu1-2",
                        generatemenu: 0,
                        sort: 0,
                        parentId: 2,
                        permName: null,
                        redirect: "",
                        title: "Menu1-2",
                        icon: "",
                        children: null
                      }
                    ]
                  },
                  {
                    id: 3,
                    name: "Menu2",
                    code: null,
                    description: null,
                    url: "menu2",
                    generatemenu: 0,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: "",
                    title: "Menu2",
                    icon: "menu2",
                    children: null
                  }
                ]
              }
            ],
            permit: ["add", "delete", "edit", "view"]
          }
        });
      }, 1000);
    });
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: {
            router: [
              {
                id: 1,
                name: "Example",
                code: null,
                description: null,
                url: "/example",
                generatemenu: 0,
                sort: 0,
                parentId: null,
                permName: null,
                redirect: "/example/table",
                title: "Example",
                icon: "example",
                children: [
                  {
                    id: 2,
                    name: "Table",
                    code: null,
                    description: null,
                    url: "table",
                    generatemenu: 0,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: "",
                    title: "Table",
                    icon: "table",
                    children: null
                  },
                  {
                    id: 3,
                    name: "Tree",
                    code: null,
                    description: null,
                    url: "tree",
                    generatemenu: 0,
                    sort: 0,
                    parentId: 1,
                    permName: null,
                    redirect: "",
                    title: "Tree",
                    icon: "tree",
                    children: null
                  }
                ]
              }
            ],
            permit: ["edit", "view"]
          }
        });
      }, 1000);
    });
  }
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post"
  });
}
