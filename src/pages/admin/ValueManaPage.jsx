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
    title: "Tên giá trị",
    dataIndex: "nameValue",
  },
  {
    title: "Thao tác",
    width: 150,
    dataIndex: "action",
  },
];
function ValueManaPage() {
  const arr = [];
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  const [flag, setFlag] = useState(false);
  const [value, setValue] = useState([]);
  const [attribute, setAttribute] = useState([]);
  const [valueUd, setValueUd] = useState({});
  const [valueAdd, setValueAdd] = useState({
    product_attribute_id: "",
    name_value: "",
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
    saveProductValue();
  };
  const handleCancel = () => {
    setIsModalOpenUpdate(false);
    setIsModalOpenAdd(false);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:6789/product-value`)
      .then((res) => {
        setValue(res.data.data);
      })
      .catch((error) => console.log(error));
    axios
      .get(`http://localhost:6789/product-attribute`)
      .then((res) => {
        setAttribute(res.data.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [flag]);
  useEffect(() => {
    setValueUd(value.find((x) => x.id === id));
    // eslint-disable-next-line
  }, [id]);
  function deleteById(id) {
    axios
      .delete(`http://localhost:6789/product-value/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Xóa giá trị thuộc tính thành công");
        }
      })
      .catch((error) => console.log(error));
  }
  function saveProductValue() {
    axios
      .post(`http://localhost:6789/product-value`, valueAdd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          setValueAdd({});
          messageApi.success("Thêm giá trị thuộc tính thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Thêm giá trị thuộc tính thất bại");
        console.log(error);
      });
  }
  function updateById() {
    axios
      .put(`http://localhost:6789/product-value`, valueUd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Cập nhật giá trị thuộc tính thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Cập nhật không thành công");
        console.log(error);
      });
  }
  value.forEach((x, index) => {
    arr.push({
      key: index,
      nameAttribute: attribute.find((y) => y.id === x.product_attribute_id)
        ?.name_attribute,
      nameValue: x.name_value,
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
    setValueUd({
      ...valueUd,
      product_attribute_id: value,
    });
  }
  function onGenderChangeAdd(value) {
    setValueAdd({
      ...valueAdd,
      product_attribute_id: value,
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
          <MenuLayout name="product-value" />
        </div>
      </div>
      <div className="col-start-2 col-end-6 bg-slate-100">
        <div className="bg-slate-500 text-white p-3 h-20 grid grid-cols-2">
          <div className="flex justify-start items-center">
            <h2>QUẢN LÝ GIÁ TRỊ THUỘC TÍNH SẢN PHẨM</h2>
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
              title="Cập nhật giá trị thuộc tính sản phẩm"
              open={isModalOpenUpdate}
              width={900}
              onOk={handleOkUpdate}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên thuộc tính</label>
                  <Select
                    onChange={onGenderChange}
                    className="w-full"
                    size="large"
                    value={valueUd?.product_attribute_id}
                    allowClear
                  >
                    {attribute?.map((x) => (
                      <Option key={x.id} value={x.id}>
                        {x.name_attribute}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>Giá trị thuộc tính</label>
                  <Input
                    size="large"
                    value={valueUd?.name_value}
                    onChange={(e) =>
                      setValueUd({ ...valueUd, name_value: e.target.value })
                    }
                  />
                </div>
              </div>
            </Modal>
            {/* Modal delete */}
            <Modal
              title="Xác nhận xóa giá trị thuộc tính"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>Đồng ý xóa giá trị thuộc tính này?</p>
            </Modal>
            {/* Modal add */}
            <Modal
              title="Thêm mới giá trị thuộc tính sản phẩm"
              open={isModalOpenAdd}
              width={900}
              onOk={handleOkAdd}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên thuộc tính</label>
                  <Select
                    onChange={onGenderChangeAdd}
                    className="w-full"
                    size="large"
                    value={valueAdd?.product_attribute_id}
                    allowClear
                  >
                    {attribute?.map((x) => (
                      <Option key={x.id} value={x.id}>
                        {x.name_attribute}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>Giá trị thuộc tính</label>
                  <Input
                    size="large"
                    value={valueAdd?.name_value}
                    onChange={(e) =>
                      setValueAdd({ ...valueAdd, name_value: e.target.value })
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

export default ValueManaPage;
