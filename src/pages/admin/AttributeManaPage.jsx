import { Button, Input, Modal, Select, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import MenuLayout from "../../layouts/MenuLayout";
import { Link } from "react-router-dom";
const columns = [
  {
    title: "Tên thuộc tính",
    dataIndex: "nameAttribute",
  },
  {
    title: "Ẩn hiện",
    width: 150,
    dataIndex: "show",
  },
  {
    title: "Thao tác",
    width: 150,
    dataIndex: "action",
  },
];
function AttributeManaPage() {
  const arr = [];
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  const [flag, setFlag] = useState(false);
  const [attribute, setAttribute] = useState([]);
  const [attributeUd, setAttributeUd] = useState({});
  const [attributeAdd, setAttributeAdd] = useState({
    name_attribute: "",
    is_show: "",
  });
  const [id, setId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const showModal = (x) => {
    setIsModalOpen(true);
    setId(x);
  };
  const showModalUpdate = (x) => {
    setIsModalOpenUpdate(true);
    setId(x);
  };
  const showModalAdd = (x) => {
    setIsModalOpenAdd(true);
  };
  const handleOkUpdate = () => {
    setIsModalOpenUpdate(false);
    updateById(id);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    deleteById(id);
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
      .get(`http://localhost:6789/product-attribute`)
      .then((res) => {
        setAttribute(res.data.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [flag]);
  useEffect(() => {
    setAttributeUd(attribute.find((x) => x.id === id));
    // eslint-disable-next-line
  }, [id]);
  function deleteById(id) {
    axios
      .delete(`http://localhost:6789/product-attribute/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Xóa thuộc tính thành công");
        }
      })
      .catch((error) => console.log(error));
  }
  function saveUser() {
    axios
      .post(`http://localhost:6789/product-attribute`, attributeAdd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          setAttributeAdd({});
          messageApi.success("Thêm thuộc tính thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Thêm thuộc tính không thành công");
        console.log(error);
      });
  }
  function updateById() {
    axios
      .put(`http://localhost:6789/product-attribute`, attributeUd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Cập nhật giá trị thuộc tính thành công");
        }
      })
      .catch((error) => console.log(error));
  }
  attribute.forEach((x, index) => {
    arr.push({
      key: index,
      nameAttribute: x.name_attribute,
      show: x.is_show === 1 ? "Hiện" : "Ẩn",
      action: (
        <div className="grid grid-cols-2 gap-3">
          <FaTrashAlt
            color="red"
            className="cursor-pointer"
            onClick={() => showModal(x.id)}
          />
          <FaEdit
            color="blue"
            className="cursor-pointer"
            onClick={() => showModalUpdate(x.id)}
          />
        </div>
      ),
    });
  });
  function onGenderChange(value) {
    setAttributeUd({
      ...attributeUd,
      is_show: value,
    });
  }
  function onGenderChangeAdd(value) {
    setAttributeAdd({
      ...attributeAdd,
      is_show: value,
    });
  }
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
          <MenuLayout name="product-attribute" />
        </div>
      </div>
      <div className="col-start-2 col-end-6 bg-slate-100">
        <div className="bg-slate-500 text-white p-3 h-20 grid grid-cols-2">
          <div className="flex justify-start items-center">
            <h2>QUẢN LÝ THUỘC TÍNH SẢN PHẨM</h2>
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
              title="Cập nhật thuộc tính sản phẩm"
              open={isModalOpenUpdate}
              width={900}
              onOk={handleOkUpdate}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên thuộc tính</label>
                  <Input
                    size="large"
                    value={attributeUd?.name_attribute}
                    onChange={(e) =>
                      setAttributeUd({
                        ...attributeUd,
                        name_attribute: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Ẩn hiện</label>
                  <Select
                    onChange={onGenderChange}
                    className="w-full"
                    size="large"
                    value={attributeUd?.is_show}
                    allowClear
                  >
                    <Option value="0">Ẩn</Option>
                    <Option value="1">Hiện</Option>
                  </Select>
                </div>
              </div>
            </Modal>
            {/* Modal delete */}
            <Modal
              title="Xác nhận xóa thuộc tính"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>Đồng ý xóa thuộc tính này?</p>
            </Modal>
            {/* Modal add */}
            <Modal
              title="Thêm mới thuộc tính sản phẩm"
              open={isModalOpenAdd}
              width={900}
              onOk={handleOkAdd}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên thuộc tính</label>
                  <Input
                    size="large"
                    value={attributeAdd?.name_attribute}
                    onChange={(e) =>
                      setAttributeAdd({
                        ...attributeAdd,
                        name_attribute: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Ẩn hiện</label>
                  <Select
                    onChange={onGenderChangeAdd}
                    className="w-full"
                    size="large"
                    value={attributeAdd?.is_show}
                    allowClear
                  >
                    <Option value="0">Ẩn</Option>
                    <Option value="1">Hiện</Option>
                  </Select>
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

export default AttributeManaPage;
