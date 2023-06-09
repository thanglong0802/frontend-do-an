import { Button, Input, Modal, Select, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import MenuLayout from "../../layouts/MenuLayout";
import { Link } from "react-router-dom";
const columns = [
  {
    title: "Sản phẩm",
    dataIndex: "product",
  },
  {
    title: "Ảnh",
    dataIndex: "image",
  },
  {
    title: "Thao tác",
    width: 150,
    dataIndex: "action",
  },
];
function ImageManaPage() {
  const arr = [];
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  const [flag, setFlag] = useState(false);
  const [product, setProduct] = useState([]);
  const [image, setImage] = useState([]);
  const [imageUd, setImageUd] = useState({});
  const [imageAdd, setImageAdd] = useState({
    product_id: "",
    image_url: "",
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
    saveProductImage();
  };
  const handleCancel = () => {
    setIsModalOpenUpdate(false);
    setIsModalOpenAdd(false);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:6789/product`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((error) => console.log(error));
    axios
      .get(`http://localhost:6789/product-image`)
      .then((res) => {
        setImage(res.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [flag]);
  useEffect(() => {
    setImageUd(image.find((x) => x.id === id));
    // eslint-disable-next-line
  }, [id]);
  function deleteById(id) {
    axios
      .delete(`http://localhost:6789/product-image/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Xóa ảnh sản phẩm thành công");
        }
      })
      .catch((error) => console.log(error));
  }
  function saveProductImage() {
    axios
      .post(`http://localhost:6789/product-image`, imageAdd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          setImageAdd({});
          messageApi.success("Thêm ảnh sản phẩm thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Thêm ảnh sản phẩm thất bại");
        console.log(error);
      });
  }
  function updateById() {
    axios
      .put(`http://localhost:6789/product-image`, imageUd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Cập nhật ảnh sản phẩm thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Cập nhật không thành công");
        console.log(error);
      });
  }
  image.forEach((x, index) => {
    arr.push({
      key: index,
      product: product.find((y) => y.id === x.product_id)?.name_product,
      image: x.image_url,
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

  function onGenderChangeAdd(value) {
    setImageAdd({
      ...imageAdd,
      product_id: value,
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
          <MenuLayout name="product-image" />
        </div>
      </div>
      <div className="col-start-2 col-end-6 bg-slate-100">
        <div className="bg-slate-500 text-white p-3 h-20 grid grid-cols-2">
          <div className="flex justify-start items-center">
            <h2>QUẢN LÝ ẢNH SẢN PHẨM</h2>
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
              title="Cập nhật ảnh sản phẩm"
              open={isModalOpenUpdate}
              width={900}
              onOk={handleOkUpdate}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên sản phẩm</label>
                  <Input
                    size="large"
                    value={
                      product.find((x) => x.id === imageUd?.product_id)
                        ?.name_product
                    }
                    disabled
                    onChange={(e) =>
                      setImageUd({ ...imageUd, product_id: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Ảnh sản phẩm</label>
                  <Input
                    size="large"
                    value={imageUd?.image_url}
                    onChange={(e) =>
                      setImageUd({ ...imageUd, image_url: e.target.value })
                    }
                  />
                </div>
              </div>
            </Modal>
            {/* Modal delete */}
            <Modal
              title="Xác nhận xóa ảnh sản phẩm"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>Đồng ý xóa ảnh sản phẩm này?</p>
            </Modal>
            {/* Modal add */}
            <Modal
              title="Thêm mới ảnh sản phẩm"
              open={isModalOpenAdd}
              width={900}
              onOk={handleOkAdd}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên sản phẩm</label>
                  <Select
                    onChange={onGenderChangeAdd}
                    className="w-full"
                    size="large"
                    value={imageAdd?.product_id}
                    allowClear
                  >
                    {product?.map((x) => (
                      <Option key={x.id} value={x.id}>
                        {x.name_product}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>Ảnh sản phẩm</label>
                  <Input
                    size="large"
                    value={imageAdd?.image_url}
                    onChange={(e) =>
                      setImageAdd({ ...imageAdd, image_url: e.target.value })
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

export default ImageManaPage;
