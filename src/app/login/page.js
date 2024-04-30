"use client";
import { Button, Input, Space } from "antd";
import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const login = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex justify-center ">
      <div className=" w-96 h-auto  shadow-md p-5">
        <h1 className="text-3xl text-black font-semibold text-center">Login</h1>
        <p className="text-sm text-gray-500 text-center">
          Login to your account to continue
        </p>
        <Input placeholder="Email " />
      </div>
    </div>
  );
};

export default login;
