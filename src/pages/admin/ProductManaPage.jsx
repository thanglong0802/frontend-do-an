import {
  Button,
  Input,
  InputNumber,
  List,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import MenuLayout from "../../layouts/MenuLayout";
import { Link } from "react-router-dom";
const columns = [
  {
    title: "Mã sản phẩm",
    dataIndex: "id",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Đơn giá",
    dataIndex: "price",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Khuyến mãi",
    dataIndex: "promotional",
  },
  {
    title: "Bảo hành",
    dataIndex: "guarantee",
  },
  {
    title: "Thương hiệu",
    dataIndex: "brand",
  },
  {
    title: "Xuất sứ",
    dataIndex: "where",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];
function ProductManaPage() {
  const arr = [];
  const { TextArea } = Input;
  const { Option } = Select;
  const [messageApi, contextHolder] = message.useMessage();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [productValue, setProductValue] = useState([]);
  const [productAttribute, setProductAttribute] = useState([]);
  const [productArrAttribute, setProductArrAttribute] = useState([]);
  const [productUd, setProductUd] = useState({});
  const [productAdd, setProductAdd] = useState({
    categories_id: 0,
    name_product: "",
    status: "Còn hàng",
    price: 0,
    promotional_price: 0,
    bao_hanh: "",
    brand: "",
    quantity: 1,
    description: "",
    use: "",
    producer: "",
    where_production: "",
  });
  const [id, setId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const showModal = (x) => {
    setIsModalOpen(true);
    setId(x);
  };
  const showModalUpdate = (x) => {
    setIsModalOpenUpdate(true);
    setFlag(!flag);
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
    setFlag(!flag);
    updateById(id);
  };
  const handleOkAdd = () => {
    setIsModalOpenAdd(false);
    saveProduct();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
      .get("http://localhost:6789/category/search")
      .then((res) => {
        setCategory(res.data.data.filter((x) => x.parent_id > 0));
      })
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:6789/product-detail/${id}`)
      .then((res) => {
        setProductDetail(res.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:6789/product-value`)
      .then((res) => {
        setProductValue(res.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:6789/product-attribute`)
      .then((res) => {
        setProductAttribute(res.data.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [flag, id]);
  useEffect(() => {
    setProductUd(product.find((x) => x.id === id));
    // eslint-disable-next-line
  }, [flag, id]);
  function deleteById(id) {
    axios
      .delete(`http://localhost:6789/product/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          messageApi.success("Xóa sản phẩm thành công");
        }
      })
      .catch((error) => console.log(error));
  }
  const handleChange = (value) => {
    setProductArrAttribute(value.toString().split(","));
  };

  function addAttributeProduct() {
    productArrAttribute.forEach((x) => {
      axios
        .post(`http://localhost:6789/product-detail`, {
          category_id: productUd.categories_id,
          attribute_value: Number(x),
          attribute_id: productValue.find((y) => y.id === Number(x))
            ?.product_attribute_id,
          product_id: id,
        })
        .then((res) => {
          if (res.status === 200) {
            setFlag(!flag);
            window.location.reload();
            messageApi.success("Thêm thông số sản phẩm thành công");
          }
        })
        .catch((error) => {
          messageApi.error("Thêm thông số sản phẩm không thành công");
          console.log(error);
        });
    });
  }
  function saveProduct() {
    axios
      .post(`http://localhost:6789/product`, productAdd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          setProductAdd({});
          messageApi.success("Thêm sản phẩm thành công");
        }
      })
      .catch((error) => {
        messageApi("Thêm sản phẩm không thành công");
        console.log(error);
      });
  }
  function updateById() {
    axios
      .put(`http://localhost:6789/product`, productUd)
      .then((res) => {
        if (res.status === 200) {
          setFlag(!flag);
          addAttributeProduct();
          messageApi.success("Cập nhật sản phẩm thành công");
        }
      })
      .catch((error) => {
        messageApi.error("Cập nhật sản phẩm không thành công");
        console.log(error);
      });
  }
  product.forEach((x) => {
    arr.push({
      id: x.id,
      key: x.id,
      name: x.name_product,
      price: x.price.toLocaleString(),
      quantity: x.quantity,
      promotional: `${x.promotional_price}%`,
      guarantee: x.bao_hanh,
      brand: x.brand,
      where: x.where_production,
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
    setProductAdd({
      ...productAdd,
      categories_id: value,
    });
  }
  const options = [];
  productValue.forEach((x) => {
    options.push({
      value: x.id,
      label: `${
        productAttribute?.find((y) => y.id === x.product_attribute_id)
          ?.name_attribute
      } : ${x.name_value}`,
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
          <MenuLayout name="product" />
        </div>
      </div>
      <div className="col-start-2 col-end-6 bg-slate-100">
        <div className="bg-slate-500 text-white p-3 h-20 grid grid-cols-2">
          <div className="flex justify-start items-center">
            <h2>QUẢN LÝ SẢN PHẨM</h2>
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
              title="Xác nhận xóa sản phẩm"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <p>Đồng ý xóa sản phẩm này?</p>
            </Modal>
            {/* Modal update */}
            <Modal
              title="Cập nhật sản phẩm"
              open={isModalOpenUpdate}
              width={1300}
              centered
              onOk={handleOkUpdate}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-3 gap-x-5">
                <div className="col-start-1 col-end-4 text-lg font-bold">
                  Thông tin sản phẩm
                </div>
                <div>
                  <label>Tên sản phẩm</label>
                  <Input
                    size="large"
                    value={productUd?.name_product}
                    onChange={(e) =>
                      setProductUd({
                        ...productUd,
                        name_product: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Giá sản phẩm</label>
                  <Input
                    size="large"
                    value={productUd?.price}
                    onChange={(e) =>
                      setProductUd({ ...productUd, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Bảo hành</label>
                  <Input
                    size="large"
                    value={productUd?.bao_hanh}
                    onChange={(e) =>
                      setProductUd({ ...productUd, bao_hanh: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Thương hiệu</label>
                  <Input
                    size="large"
                    value={productUd?.brand}
                    onChange={(e) =>
                      setProductUd({ ...productUd, brand: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Số lượng</label>
                  <InputNumber
                    size="large"
                    className="w-full"
                    value={productUd?.quantity}
                    onChange={(value) =>
                      setProductUd({ ...productUd, quantity: value })
                    }
                  />
                </div>
                <div>
                  <label>Xuất sứ</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={productUd?.where_production}
                    onChange={(e) =>
                      setProductUd({
                        ...productUd,
                        where_production: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Khuyến mãi</label>
                  <InputNumber
                    size="large"
                    className="w-full"
                    value={productUd?.promotional_price}
                    onChange={(value) =>
                      setProductUd({ ...productUd, promotional_price: value })
                    }
                  />
                </div>
                <div>
                  <label>Nhà sản xuất</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={productUd?.producer}
                    onChange={(e) =>
                      setProductUd({
                        ...productUd,
                        producer: e.target.value,
                      })
                    }
                  />
                </div>
                <div></div>
                <div>
                  <label>Miêu tả</label>
                  <TextArea
                    size="large"
                    rows={3}
                    className="w-full"
                    value={productUd?.description}
                    onChange={(e) =>
                      setProductUd({
                        ...productUd,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-start-2 col-end-4">
                  <label>Cách sử dụng</label>
                  <TextArea
                    size="large"
                    rows={3}
                    className="w-full"
                    value={productUd?.use}
                    onChange={(e) =>
                      setProductUd({
                        ...productUd,
                        use: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-start-1 col-end-4 text-lg font-bold">
                  Thông số sản phẩm
                </div>
                <div className="col-start-1 col-end-2">
                  <label>Thêm thuộc tính sản phẩm</label>
                  <div>
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Lựa chọn thuộc tính"
                      onChange={handleChange}
                      allowClear
                      style={{
                        width: "100%",
                      }}
                      options={options}
                    />
                  </div>
                </div>
                <div className="col-start-2 col-end-4">
                  <label>Danh sách thuộc tính sản phẩm</label>
                  <div className="overflow-auto" style={{ maxHeight: 200 }}>
                    <List
                      itemLayout="horizontal"
                      dataSource={productDetail}
                      renderItem={(item, index) => (
                        <div>
                          <span className="font-bold">
                            {item.name_attribute}
                          </span>{" "}
                          : {item.name_value}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Modal>
            {/* Modal add */}
            <Modal
              title="Thêm mới sản phẩm"
              open={isModalOpenAdd}
              width={900}
              centered
              onOk={handleOkAdd}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label>Tên sản phẩm</label>
                  <Input
                    size="large"
                    value={productAdd?.name_product}
                    onChange={(e) =>
                      setProductAdd({
                        ...productAdd,
                        name_product: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Giá sản phẩm</label>
                  <Input
                    size="large"
                    value={productAdd?.price}
                    onChange={(e) =>
                      setProductAdd({ ...productAdd, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Bảo hành</label>
                  <Input
                    size="large"
                    value={productAdd?.bao_hanh}
                    onChange={(e) =>
                      setProductAdd({ ...productAdd, bao_hanh: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Thương hiệu</label>
                  <Input
                    size="large"
                    value={productAdd?.brand}
                    onChange={(e) =>
                      setProductAdd({ ...productAdd, brand: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Số lượng</label>
                  <InputNumber
                    size="large"
                    className="w-full"
                    value={productAdd?.quantity}
                    onChange={(value) =>
                      setProductAdd({ ...productAdd, quantity: value })
                    }
                  />
                </div>
                <div>
                  <label>Xuất sứ</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={productAdd?.where_production}
                    onChange={(e) =>
                      setProductAdd({
                        ...productAdd,
                        where_production: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Khuyến mãi</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={productAdd?.promotional_price}
                    onChange={(e) =>
                      setProductAdd({
                        ...productAdd,
                        promotional_price: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Nhà sản xuất</label>
                  <Input
                    size="large"
                    className="w-full"
                    value={productAdd?.producer}
                    onChange={(e) =>
                      setProductAdd({
                        ...productAdd,
                        producer: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-start-1 col-end-3">
                  <label>Loại sản phẩm</label>
                  <Select
                    onChange={onGenderChange}
                    className="w-full"
                    size="large"
                    allowClear
                  >
                    {category?.map((x) => (
                      <Option key={x.id} value={x.id}>
                        {x.name_category}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>Miêu tả</label>
                  <TextArea
                    size="large"
                    rows={4}
                    className="w-full"
                    value={productAdd?.description}
                    onChange={(e) =>
                      setProductAdd({
                        ...productAdd,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Cách sử dụng</label>
                  <TextArea
                    size="large"
                    rows={4}
                    className="w-full"
                    value={productAdd?.use}
                    onChange={(e) =>
                      setProductAdd({
                        ...productAdd,
                        use: e.target.value,
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
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 8,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductManaPage;
