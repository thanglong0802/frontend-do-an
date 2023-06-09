import { Breadcrumb, Button, InputNumber, Tabs, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaClipboardCheck,
  FaCog,
  // FaCommentAlt,
  FaDonate,
  FaHome,
  FaMapMarkerAlt,
  FaMedal,
  FaShieldAlt,
  FaShippingFast,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import km from "../assets/images/khuyen-mai.png";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

function DetailPage() {
  let { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setCategory] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [flag, setFlag] = useState(false);
  const [product, setProduct] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [listOrder, setListOrder] = useState(
    JSON.parse(localStorage.getItem("listOrder")) || []
  );
  const [url, setUrl] = useState("");
  useEffect(() => {
    localStorage.setItem("listOrder", JSON.stringify(listOrder));
    // eslint-disable-next-line
  }, [listOrder]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("listOrder"))) {
      setListOrder(JSON.parse(localStorage.getItem("listOrder")));
    }
  }, [flag]);
  useEffect(() => {
    axios
      .get(`http://localhost:6789/category/search`)
      .then((res) => {
        setCategory(res.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:6789/product/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:6789/product-detail/${id}`)
      .then((res) => {
        setProductDetail(res.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(`http://localhost:6789/product-image/${id}`)
      .then((res) => {
        setUrl(res.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [id]);
  const items = [
    {
      key: "1",
      label: (
        <div>
          <FaBook className="mr-2" /> THÔNG TIN SẢN PHẨM
        </div>
      ),
      children: <div>{product.description}</div>,
    },
    {
      key: "2",
      label: (
        <div>
          <FaCog className="mr-2" />
          THÔNG SỐ KỸ THUẬT
        </div>
      ),
      children: (
        <div>
          <div>
            <table>
              <thead>
                <tr>
                  <th className="p-2 text-left border border-slate-300 border-solid">
                    Tên thông số
                  </th>
                  <th className="p-2 text-left border border-slate-300 border-solid">
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody>
                {productDetail.map((x) => (
                  <tr>
                    <td className="p-2 text-left border border-slate-300 border-solid">
                      {x.name_attribute}
                    </td>
                    <td className="p-2 text-left border border-slate-300 border-solid">
                      {x.name_value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div>
          <FaClipboardCheck className="mr-2" />
          HƯỚNG DẪN SỬ DỤNG
        </div>
      ),
      children: <div dangerouslySetInnerHTML={{ __html: product.use }} />,
    },
    {
      key: "4",
      label: (
        <div>
          {/* <FaCommentAlt className="mr-2" />
          ĐÁNH GIÁ SẢN PHẨM */}
        </div>
      ),
      children: "Phần đánh giá sản phẩm",
    },
  ];

  function saveOrder() {
    if (
      listOrder.some((x) => x.cart_create_request.product_id === product.id)
    ) {
      messageApi.info("Sản phẩm đã được thêm vào giỏ hàng");
    } else {
      messageApi.success("Thêm vào giỏ hàng thành công");
      setFlag(!flag);
      setListOrder((pre) => [
        ...pre,
        {
          cart_create_request: {
            product_id: product.id,
            quantity_product: quantity,
            total_price: product.price * quantity,
          },
          name_customer: "",
          address: "",
          phone_number: "",
        },
      ]);
    }
  }

  let tietKiem = Math.ceil((product.promotional_price / 100) * product.price);
  tietKiem = Math.ceil(tietKiem / 1000) * 1000;

  let giaKhuyenMai = Math.floor(
    ((100 - product.promotional_price) / 100) * product.price
  );
  giaKhuyenMai = Math.floor(giaKhuyenMai / 1000) * 1000;

  return (
    <div>
      <Header />
      {contextHolder}
      <div className="h-10 text-white bg-blue-800 grid grid-cols-5 mx-32">
        <div className="bg-blue-900 py-2 text-center">DANH MỤC SẢN PHẨM</div>
        <div className="col-start-2 col-end-6 grid grid-cols-4">
          <div className="flex justify-center items-center">
            <img src={km} alt="khuyen-mai" />
          </div>
          <div className="py-2 px-7">BẢNG TIN SIÊU THỊ Y TÊ</div>
          <div className="py-2 px-7">CHUYÊN MỤC SỨC KHỎE</div>
          <div className="py-2 px-7">
            <Link to={"/check-order"} className="no-underline text-white">
              KIỂM TRA ĐƠN HÀNG
            </Link>
          </div>
        </div>
      </div>
      <div className="h-1 bg-blue-950" style={{ marginTop: "-3px" }}></div>
      <div className="mx-32 py-2">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to={"/"}>Trang chủ</Link>,
            },
            {
              title: (
                <span className="capitalize">
                  {
                    category.find((x) => x.id === product.categories_id)
                      ?.name_category
                  }
                </span>
              ),
            },
            {
              title: <span className="capitalize">{product.name_product}</span>,
            },
          ]}
        />
      </div>
      <div className="mx-32 mt-2 grid grid-cols-4 gap-4">
        <div className="col-start-1 col-end-4 grid grid-cols-2 gap-4">
          <div>
            <img src={url[0]?.image_url} alt="img" className="w-full" />
          </div>
          <div>
            <div className="font-bold text-blue-800 capitalize">
              {product.name_product}
            </div>
            <div className="border border-slate-300 border-solid p-3 mt-3 leading-loose">
              <div>
                Giá khuyến mãi :{" "}
                <span className="font-bold text-red-600 text-xl">
                  {giaKhuyenMai.toLocaleString()}đ
                </span>{" "}
                (Đã có VAT)
              </div>
              <div>
                Giá sản phẩm :{" "}
                <strike>{product.price?.toLocaleString()}đ</strike>
              </div>
              <div>
                Tiết kiệm : {tietKiem.toLocaleString()}đ (
                {product.promotional_price}%)
              </div>
              <div className="flex">
                Số lượng :{" "}
                <InputNumber
                  defaultValue={1}
                  min={1}
                  disabled={product.quantity <= 0}
                  className="mx-2"
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                />
                <span className="ml-3 text-slate-400">
                  {product.quantity} sản phẩm có sẵn
                </span>
              </div>
              <div className="p-3">
                <div>
                  <FaCheckCircle className="mr-2 text-green-600" />
                  <span className="font-bold">Thương hiệu</span> :{" "}
                  {product.brand}
                </div>
                <div>
                  <FaCheckCircle className="mr-2 text-green-600" />
                  <span className="font-bold">Bảo hành</span> :{" "}
                  {product.bao_hanh}
                </div>
                <div>
                  <FaCheckCircle className="mr-2 text-green-600" />
                  <span className="font-bold">Nơi sản xuất</span> :{" "}
                  {product.where_production}
                </div>
                {/* <div>
                  <FaCheckCircle className="mr-2 text-green-600" />
                  <span className="font-bold">Nhà sản xuất</span> :{" "}
                  {product.producer}
                </div> */}
                <div>
                  <FaCheckCircle className="mr-2 text-green-600" />
                  <span className="font-bold">Trạng thái</span> :{" "}
                  <span className="font-bold text-red-600">
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                type="primary"
                size="large"
                className="w-full"
                disabled={product.quantity <= 0}
                onClick={() => saveOrder()}
              >
                THÊM VÀO GIỎ HÀNG
              </Button>
            </div>
          </div>
          <div className="col-start-1 col-end-5">
            <Tabs defaultActiveKey="1" items={items} />
          </div>
        </div>
        <div>
          <div className="p-2 bg-zinc-500 text-white font-bold">
            <FaMapMarkerAlt className="mr-2" />
            Địa chỉ
          </div>
          <div className="bg-slate-50 p-3">
            <div className="text-blue-800">
              <div className="font-bold">
                <FaHome className="mr-2" />
                <span>HÀ NỘI</span>
              </div>
              <div className="mt-1">
                <ul className="text-sm pl-4 text-black">
                  <li>19 Hồ Tùng Mậu - Mai Dịch - Cầu Giấy - Hà Nội</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-3 mt-3 leading-loose text-sm">
            <div className="text-blue-500">
              <FaDonate className="mr-2 text-base" />
              Hoàn tiền 150% nếu phát hiện hàng giả
            </div>
            <div className="text-green-500">
              <FaShieldAlt className="mr-2 text-base" />
              Bảo hành nhanh chóng
            </div>
            <div className="text-red-500">
              <FaMedal className="mr-2 text-base" />
              Cam kết hàng chính hãng 100%
            </div>
            <div className="text-purple-500">
              <FaShippingFast className="mr-2 text-base" />
              Free ship đơn hàng trên 600K
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DetailPage;
