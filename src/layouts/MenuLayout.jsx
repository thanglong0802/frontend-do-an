import { Avatar, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    <div className="font-bold text-xl">Danh mục quản lý</div>,
    "grp",
    null,
    [
      getItem("Quản lý sản phẩm", "product"),
      getItem("Quản lý danh mục sản phẩm", "category"),
      getItem("Quản lý thuộc tính sản phẩm", "product-attribute"),
      getItem("Quản lý  giá trị thuộc tính sản phẩm", "product-value"),
      getItem("Quản lý  ảnh sản phẩm", "product-image"),
      getItem("Quản lý người dùng", "user"),
      getItem("Quản lý thống kê", "statistic"),
    ],
    "group"
  ),
];

function MenuLayout(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [current, setCurrent] = useState("product");
  useEffect(() => {
    setCurrent(props.name);
    // eslint-disable-next-line
  }, []);
  const onClick = (e) => {
    if (e.key === "login") {
      window.localStorage.removeItem("username");
    }
    navigate(`/admin/${e.key}`);
  };
  useEffect(() => {
    setUsername(window.localStorage.getItem("username") || "");
    if (!window.localStorage.getItem("username")) {
      navigate("/admin/login");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <div className="text-center font-bold bg-slate-600 text-white p-3">
        Xin chào {username}
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "1",
                label: (
                  <Link
                    to={"/admin/login"}
                    onClick={() => window.localStorage.removeItem("username")}
                  >
                    Đăng xuất
                  </Link>
                ),
              },
            ],
          }}
          placement="bottomLeft"
        >
          <Avatar
            size="large"
            icon={<FaUserAlt />}
            className="ml-4 cursor-pointer"
          />
        </Dropdown>
      </div>
      <div>
        <Menu
          onClick={onClick}
          className="w-full"
          selectedKeys={[current]}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  );
}

export default MenuLayout;
