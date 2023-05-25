import { Button, Input, Modal, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import MenuLayout from "../../layouts/MenuLayout";
import { Link } from "react-router-dom";
const columns = [
  {
    title: "Họ tên",
    dataIndex: "name",
  },
  {
    title: "Tên đăng nhập",
    dataIndex: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];
function UserManaPage() {
  const arr = [];
  const [messageApi, contextHolder] = message.useMessage();
  const [flag, setFlag] = useState(false);
  const [user, setUser] = useState([]);
  const [userUd, setUserUd] = useState({});
  const [userAdd, setUserAdd] = useState({
    username: "",
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [phone, setPhone] = useState(0);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const showModalUpdate = (x) => {
    setIsModalOpenUpdate(true);
    setPhone(x);
  };
  const showModalAdd = (x) => {
    setIsModalOpenAdd(true);
  };
  const handleOkUpdate = () => {
    setIsModalOpenUpdate(false);
    updateById(phone);
  };
  const handleOkAdd = () => {
    setIsModalOpenAdd(false);
    saveUser();
  };
  const handleCancel = () => {
    setIsModalOpenUpdate(false);
    setIsModalOpenAdd(false);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:6789/user`)
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [flag]);
  useEffect(() => {
    setUserUd(user.find((x) => x.phone_number === phone));
    // eslint-disable-next-line
  }, [phone]);
  function saveUser() {
    axios
      .post(`http://localhost:6789/user`, userAdd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          setUserAdd({});
          messageApi.success("Thêm người dùng thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Thêm người dùng thất bại");
        console.log(error);
      });
  }
  function updateById() {
    axios
      .put(`http://localhost:6789/user`, userUd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Cập nhật thông tin người dùng thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Cập nhật thông tin người dùng thất bại");
        console.log(error);
      });
  }
  user.forEach((x, index) => {
    arr.push({
      key: index,
      name: x.full_name,
      username: x.username,
      email: x.email,
      phone: x.phone_number,
      action: (
        <FaEdit
          color="blue"
          className="cursor-pointer"
          onClick={() => showModalUpdate(x.phone_number)}
        />
      ),
    });
  });
  return (
    <div className="grid grid-cols-5 h-screen">
      {contextHolder}
      <div className="shadow-lg">
        <div className="h-1/6">
          <Link to={"/"}>
            <img src={logo} alt="logo" width={250} height={100} />
          </Link>
        </div>
        <div className="h-5/6">
          <MenuLayout name="user" />
        </div>
      </div>
      <div className="col-start-2 col-end-6 bg-slate-100">
        <div className="bg-slate-500 text-white p-3 h-20 grid grid-cols-2">
          <div className="flex justify-start items-center">
            <h2>QUẢN LÝ NGƯỜI DÙNG</h2>
          </div>
          <div className="flex justify-end items-center">
            <Button
              type="primary"
              className="w-48"
              onClick={() => showModalAdd()}
            >
              Thêm mới
              <FaPlus className="ml-2" />
            </Button>
            {/* Modal update */}
            <Modal
              title="Cập nhật thông tin người dùng"
              open={isModalOpenUpdate}
              width={900}
              onOk={handleOkUpdate}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Họ tên</label>
                  <Input
                    size="large"
                    value={userUd?.full_name}
                    onChange={(e) =>
                      setUserUd({
                        ...userUd,
                        full_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Tên đăng nhập</label>
                  <Input
                    size="large"
                    value={userUd?.username}
                    onChange={(e) =>
                      setUserUd({ ...userUd, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Email</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={userUd?.email}
                    onChange={(e) =>
                      setUserUd({ ...userUd, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Số điện thoại</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={userUd?.phone_number}
                    onChange={(e) =>
                      setUserUd({
                        ...userUd,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </Modal>
            {/* Modal add */}
            <Modal
              title="Thêm mới người dùng"
              open={isModalOpenAdd}
              width={900}
              onOk={handleOkAdd}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Họ tên</label>
                  <Input
                    size="large"
                    value={userAdd?.full_name}
                    onChange={(e) =>
                      setUserAdd({
                        ...userAdd,
                        full_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Tên đăng nhập</label>
                  <Input
                    size="large"
                    value={userAdd?.username}
                    onChange={(e) =>
                      setUserAdd({ ...userAdd, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Mật khẩu</label>
                  <Input.Password
                    size="large"
                    value={userAdd?.password}
                    onChange={(e) =>
                      setUserAdd({ ...userAdd, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Email</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={userAdd?.email}
                    onChange={(e) =>
                      setUserAdd({ ...userAdd, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Số điện thoại</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={userAdd?.phone_number}
                    onChange={(e) =>
                      setUserAdd({
                        ...userAdd,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={arr}
            pagination={{
              pageSize: 8,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UserManaPage;
