import { Button, Input, Modal, Select, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import MenuLayout from "../../layouts/MenuLayout";
import { Link } from "react-router-dom";
const columns = [
  {
    title: "Mã danh mục sản phẩm",
    dataIndex: "id",
  },
  {
    title: "Tên danh mục sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Mã danh mục cha",
    dataIndex: "category",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];
function CategoryManaPage() {
  const arr = [];
  const [messageApi, contextHolder] = message.useMessage();
  const [flag, setFlag] = useState(false);
  const { Option } = Select;
  const [category, setCategory] = useState([]);
  const [cateParent, setCateParent] = useState(-1);
  const [categoryParent, setCategoryParent] = useState([]);
  const [categoryUd, setCategoryUd] = useState({});
  const [categoryAdd, setCategoryAdd] = useState({
    name_category: "",
  });
  const [id, setId] = useState(0);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const handleOk = () => {
    setIsModalOpen(false);
    deleteById(id);
  };
  const handleOkUpdate = () => {
    setIsModalOpenUpdate(false);
    updateById(id);
  };
  const handleOkAdd = () => {
    setIsModalOpenAdd(false);
    saveUser();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
    setIsModalOpenAdd(false);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:6789/category/search`)
      .then((res) => {
        if (cateParent > 0) {
          setCategory(
            res.data.data.filter(
              (x) => x.parent_id > 0 && x.parent_id === cateParent
            )
          );
        } else {
          setCategory(res.data.data.filter((x) => x.parent_id > 0));
        }
      })
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:6789/category`)
      .then((res) => {
        setCategoryParent(res.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [cateParent, flag]);
  useEffect(() => {
    setCategoryUd(category.find((x) => x.id === id));
    // eslint-disable-next-line
  }, [id]);
  function deleteById(id) {
    axios
      .delete(`http://localhost:6789/category/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Xóa danh mục sản phẩm thành công");
        }
      })
      .catch((error) => console.log(error));
  }
  function saveUser() {
    axios
      .post(`http://localhost:6789/category`, categoryAdd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          setCategoryAdd({});
          messageApi.success("Thêm danh mục sản phẩm thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Thêm danh mục sản phẩm không thành công");
        console.log(error);
      });
  }
  function updateById() {
    axios
      .put(`http://localhost:6789/category`, categoryUd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Cập nhật danh mục sản phẩm thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Cập nhật danh mục sản phẩm không thành công");
        console.log(error);
      });
  }
  category.forEach((x, index) => {
    arr.push({
      key: index,
      id: x.id,
      name: <span className="capitalize">{x.name_category}</span>,
      category: x.parent_id,
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
          <MenuLayout name="category" />
        </div>
      </div>
      <div className="col-start-2 col-end-6 bg-slate-100">
        <div className="bg-slate-500 text-white p-3 h-20 grid grid-cols-2">
          <div className="flex justify-start items-center">
            <h2>QUẢN LÝ DANH MỤC SẢN PHẨM</h2>
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
            {/* Modal delete */}
            <Modal
              title="Xác nhận xóa danh mục sản phẩm"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>Đồng ý xóa danh mục sản phẩm này?</p>
            </Modal>
            {/* Modal update */}
            <Modal
              title="Cập nhật thông danh mục sản phẩm"
              open={isModalOpenUpdate}
              width={900}
              onOk={handleOkUpdate}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên danh mục sản phẩm</label>
                  <Input
                    size="large"
                    value={categoryUd?.name_category}
                    onChange={(e) =>
                      setCategoryUd({
                        ...categoryUd,
                        name_category: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-start-1 col-end-3">
                  <label>Danh mục</label>
                  <Select
                    onChange={(value) =>
                      setCategoryUd({
                        ...categoryUd,
                        parent_id: value,
                      })
                    }
                    className="w-full"
                    value={categoryUd?.parent_id}
                    size="large"
                    allowClear
                  >
                    {categoryParent?.map((x) => (
                      <Option key={x.id} value={x.id}>
                        <span className="capitalize"> {x.name_category}</span>
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </Modal>
            {/* Modal add */}
            <Modal
              title="Thêm mới danh mục sản phẩm"
              open={isModalOpenAdd}
              width={900}
              onOk={handleOkAdd}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên danh mục sản phẩm</label>
                  <Input
                    size="large"
                    value={categoryAdd?.name_category}
                    onChange={(e) =>
                      setCategoryAdd({
                        ...categoryAdd,
                        name_category: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-start-1 col-end-3">
                  <label>Danh mục</label>
                  <Select
                    onChange={(value) =>
                      setCategoryAdd({ ...categoryAdd, parent_id: value })
                    }
                    className="w-full"
                    size="large"
                    allowClear
                  >
                    {categoryParent?.map((x) => (
                      <Option key={x.id} value={x.id}>
                        <span className="capitalize">{x.name_category}</span>
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <div className="p-4">
          <div className="font-bold">Lọc theo danh mục</div>
          <div>
            <Select
              onChange={(value) => setCateParent(value)}
              className="w-1/2 my-2"
              allowClear
              size="large"
            >
              {categoryParent?.map((x) => (
                <Option key={x.id} value={x.id}>
                  <span className="capitalize">{x.name_category}</span>
                </Option>
              ))}
            </Select>
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

export default CategoryManaPage;
