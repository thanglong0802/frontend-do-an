import { Button, Checkbox, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    axios
      .post(`http://localhost:6789/user/login`, {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        if (res.status === 200) {
          navigate("/admin/product");
          window.localStorage.setItem("username", values.username);
        }
      })
      .catch((error) => messageApi.error("Sai tên tài khoản hoặc mật khẩu"));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="grid grid-cols-3">
      {contextHolder}
      <div className="col-start-2 col-end-3 border border-slate-300 border-solid rounded-md p-4 mt-28">
        <div className="text-center font-bold text-xl my-6">
          Đăng nhập quản trị
        </div>
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button type="primary" className="w-full" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
