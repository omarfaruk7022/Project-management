// "use client";
// import { Button, Input, Space } from "antd";
// import React, { useState } from "react";
// import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

// const login = () => {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   return (
//     <div className="flex justify-center ">
//       <div className=" w-96 h-auto  shadow-md p-5">
//         <h1 className="text-3xl text-black font-semibold text-center">Login</h1>
//         <p className="text-sm text-gray-500 text-center">
//           Login to your account to continue
//         </p>
//         <Input placeholder="Email " />
//       </div>
//     </div>
//   );
// };

// export default login;

"use client";
import React, { useState } from "react";

import { Button, Checkbox, Form, Grid, Input, theme, Typography } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import NewStore from "../store/NewStore";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function Page() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const router = useRouter();

  const [info, setInfo] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    toast.success("Login successful");
    router.push("/");
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
    text: {
      color: token.colorTextSecondary,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  const isLoggedIn = NewStore((state) => state.isLoggedIn);

  const handleLogin = () => {
    NewStore.setState({ isLoggedIn: true });
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Title style={styles.title}>Login</Title>
          <Text style={styles.text}>
            Welcome back to project management Please enter your details below
            to sign in.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            autoComplete="off"
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            value={info.email}
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            onChange={(e) => setInfo({ ...info, password: e.target.value })}
            value={info.password}
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button
              block="true"
              type="primary"
              htmlType="submit"
              onClick={handleLogin}
            >
              Log in
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Dont have an account?</Text>{" "}
              <Link href="">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
