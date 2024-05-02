"use client";
import React, { useState } from "react";

import { Button, Grid, Menu, Space, theme } from "antd";

import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import NewStore from "../store/NewStore";

const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function Navbar() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const router = useRouter();

  const menuItems = [
    {
      label: "Projects",
      key: "/",
    },
  ];

  const [current, setCurrent] = useState("");
  const onClick = (e) => {
    console.log("click ", e);
    router.push("/" + e.key);
    setCurrent(e.key);
  };

  const styles = {
    logo: {
      display: "block",
      height: token.sizeLG,
      left: "50%",
      position: screens.md ? "static" : "absolute",
      top: "50%",
      transform: screens.md ? " " : "translate(-50%, -50%)",
    },
    menu: {
      backgroundColor: "transparent",
      borderBottom: "none",
      lineHeight: screens.sm ? "4rem" : "3.5rem",
      marginLeft: screens.md ? "0px" : `-${token.size}px`,
      width: screens.md ? "inherit" : token.sizeXXL,
    },
  };
  const isLoggedIn = NewStore((state) => state.isLoggedIn);
  if (!isLoggedIn) {
    router.push("/login");
  }

  return (
    <div>
      {isLoggedIn ? (
        <nav className="relative border-b-2">
          <div className="flex justify-between items-center mx-auto px-5 md:px-20 lg:px-52">
            <div className="flex items-center gap-4 w-full py-3">
              {/* <a style={styles.logo} href="#">
            <Logo showText={true} />
          </a> */}
              <Menu
                className="bg-transparent custom-border"
                // style={styles.menu}
                mode="horizontal"
                items={menuItems}
                onClick={onClick}
                selectedKeys={screens.md ? [current] : ""}
                overflowedIndicator={
                  <Button type="text" icon={<MenuOutlined />}></Button>
                }
              />
            </div>
            <Space>
              {isLoggedIn ? (
                <Button
                  type="text"
                  onClick={() => {
                    NewStore.setState({ isLoggedIn: false });
                  }}
                >
                  Log out
                </Button>
              ) : (
                <Button
                  type="text"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Log in
                </Button>
              )}
            </Space>
          </div>
        </nav>
      ) : (
        ""
      )}
    </div>
  );
}
