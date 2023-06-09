import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapse,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaClinicMedical } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import banner from "../assets/images/banner-danh-muc-y-te-chuyen-dung-02122022.jpg";
import km from "../assets/images/khuyen-mai.png";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

function CategoryPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const { Meta } = Card;
  const [category, setCategory] = useState([]);
  const [arrPrice, setArrPrice] = useState(
    JSON.parse(localStorage.getItem("arrPrice")) || []
  );
  const [arrBrand, setArrBrand] = useState(
    JSON.parse(localStorage.getItem("arrBrand")) || []
  );
  const [type, setType] = useState(
    JSON.parse(localStorage.getItem("type")) || ""
  );
  const [url, setUrl] = useState([]);
  const [flag, setFlag] = useState(false);
  const [product, setProduct] = useState([]);
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [listCard, setListCard] = useState([]);

  const params = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  // filter by pice
  useEffect(() => {
    localStorage.setItem("arrPrice", JSON.stringify(arrPrice));
    localStorage.setItem("arrBrand", JSON.stringify(arrBrand));
    localStorage.setItem("type", JSON.stringify(type));
    // eslint-disable-next-line
  }, [arrPrice, arrBrand, type]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("arrPrice"))) {
      setArrPrice(JSON.parse(localStorage.getItem("arrPrice")));
    }
    if (JSON.parse(localStorage.getItem("arrBrand"))) {
      setArrBrand(JSON.parse(localStorage.getItem("arrBrand")));
    }
    if (JSON.parse(localStorage.getItem("type"))) {
      setType(JSON.parse(localStorage.getItem("type")));
    }
  }, []);
  // order
  const [listOrder, setListOrder] = useState(
    JSON.parse(localStorage.getItem("listOrder")) || []
  );
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
    if (arrBrand.length > 0 && arrPrice.length === 0 && type < 0) {
      navigate(`/category?brand=${arrBrand.join(",")}`);
    } else if (arrBrand.length === 0 && arrPrice.length > 0 && type < 0) {
      navigate(`/category?price=${arrPrice.join(",")}`);
    } else if (arrBrand.length > 0 && arrPrice.length > 0 && type < 0) {
      navigate(
        `/category?brand=${arrBrand.join(",")}&price=${arrPrice.join(",")}`
      );
    } else if (arrBrand.length > 0 && arrPrice.length > 0 && type > 0) {
      navigate(
        `/category?brand=${arrBrand.join(",")}&price=${arrPrice.join(
          ","
        )}&type=${type}`
      );
    } else if (arrBrand.length > 0 && arrPrice.length === 0 && type > 0) {
      navigate(`/category?brand=${arrBrand.join(",")}&type=${type}`);
    } else if (arrBrand.length === 0 && arrPrice.length > 0 && type > 0) {
      navigate(`/category?price=${arrPrice.join(",")}&type=${type}`);
    } else if (type > 0 && arrBrand.length === 0 && arrPrice.length === 0) {
      navigate(`/category?type=${type}`);
    } else {
      navigate("/category");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:6789/category")
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:6789/category/search")
      .then((res) => {
        setCategoryChildren(res.data.data.filter((x) => x.parent_id > 0));
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:6789/product-image")
      .then((res) => {
        setUrl(res.data);
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:6789/product")
      .then((res) => {
        setProduct(res.data.data);
        if (arrBrand.length > 0 || arrPrice.length > 0) {
          if (arrBrand.length > 0) {
            // brand
            if (arrPrice.length === 0) {
              setListCard(
                res.data.data.filter((x) => arrBrand.some((y) => y === x.brand))
              );
            } else {
              setListCard(
                res.data.data.filter(
                  (x) =>
                    arrBrand.some((y) => y === x.brand) &&
                    ((arrPrice.indexOf("1999999") >= 0 && x.price < 2000000) ||
                      (arrPrice.indexOf("3999999") >= 0 &&
                        x.price >= 2000000 &&
                        x.price < 4000000) ||
                      (arrPrice.indexOf("5999999") >= 0 &&
                        x.price >= 4000000 &&
                        x.price < 6000000) ||
                      (arrPrice.indexOf("6000000") >= 0 && x.price >= 6000000))
                )
              );
            }
          } else if (arrPrice.length === 4) {
            // all price
            setListCard(res.data.data);
          } else if (arrPrice.length > 0 && arrBrand.length > 0) {
            // price
            setListCard(
              res.data.data.filter((x) =>
                arrPrice.some((y) => Number(y) === x.price)
              )
            );
          } else if (arrBrand.length === 0) {
            // only price
            setListCard(
              res.data.data.filter(
                (x) =>
                  (arrPrice.indexOf("1999999") >= 0 && x.price < 2000000) ||
                  (arrPrice.indexOf("3999999") >= 0 &&
                    x.price >= 2000000 &&
                    x.price < 4000000) ||
                  (arrPrice.indexOf("5999999") >= 0 &&
                    x.price >= 4000000 &&
                    x.price < 6000000) ||
                  (arrPrice.indexOf("6000000") >= 0 && x.price >= 6000000)
              )
            );
          }
        } else {
          setListCard(res.data.data);
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, []);
  function findByParentId(id) {
    return categoryChildren.filter((x) => x.parent_id === id);
  }

  function findByChildrenId(id) {
    return listCard.filter((x) => x.categories_id === id);
  }
  function saveOrder(product) {
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
            quantity_product: 1,
            total_price:
              ((100 - product.promotional_price) / 100) * product.price,
          },
          name_customer: "",
          address: "",
          phone_number: "",
        },
      ]);
    }
  }
  const brands = [
    ...new Map(product.map(({ brand }) => [brand, brand])).values(),
  ];
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
              title: "Y Tế Gia Đình",
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-5 mx-32 mt-2 gap-4">
        <div>
          <div>
            <Card
              title="Y Tế Gia Đình"
              className="bg-blue-900"
              headStyle={{
                minHeight: "0px",
                justifyContent: "start",
                color: "white",
                padding: "3px 10px",
              }}
              bodyStyle={{
                background: "white",
                padding: "2px 5px",
              }}
              bordered={false}
            >
              <Collapse ghost>
                {category.map((x) => (
                  <Collapse.Panel
                    key={x.id}
                    header={
                      <span className="capitalize">{x.name_category}</span>
                    }
                  >
                    <ul className="px-4 list-none">
                      {categoryChildren
                        .filter((y) => y.parent_id === x.id)
                        .map((z, index) => (
                          <li
                            key={z.id}
                            className="cursor-pointer capitalize"
                            onClick={() => navigate(`/category/filter/${z.id}`)}
                          >
                            {index + 1}. {z.name_category}
                          </li>
                        ))}
                    </ul>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </Card>
          </div>
          <div className="mt-6">
            <Card
              title={<div className="text-center font-bold">THƯƠNG HIỆU</div>}
              className="bg-slate-100"
              bodyStyle={{
                background: "white",
                overflow: "auto",
                maxHeight: 400,
              }}
              bordered={false}
            >
              {brands.map((x, index) => (
                <div key={index}>
                  <Checkbox
                    checked={
                      arrBrand.some((brand) => brand === x.replace(/\s/g, ""))
                        ? true
                        : false
                    }
                    className="w-full"
                    onChange={() => {
                      window.location.reload();
                      if (arrBrand.indexOf(x.replace(/\s/g, "")) >= 0) {
                        setArrBrand(
                          arrBrand.filter(
                            (brand) => brand !== x.replace(/\s/g, "")
                          )
                        );
                      } else {
                        setArrBrand((brand) => [
                          ...brand,
                          x.replace(/\s/g, ""),
                        ]);
                      }
                    }}
                    key={x}
                  >
                    {x}
                  </Checkbox>
                </div>
              ))}
            </Card>
          </div>
          <div className="mt-6">
            <Card
              title={<div className="text-center font-bold">KHOẢNG GIÁ</div>}
              className="bg-slate-100"
              bodyStyle={{
                background: "white",
                overflow: "auto",
                maxHeight: "200px",
              }}
              bordered={false}
            >
              <div>
                <Checkbox
                  checked={arrPrice.some((pri) => pri === "1999999")}
                  onChange={() => {
                    window.location.reload();
                    if (arrPrice.indexOf("1999999") >= 0) {
                      setArrPrice(arrPrice.filter((pre) => pre !== "1999999"));
                    } else {
                      setArrPrice((pre) => [...pre, "1999999"]);
                    }
                  }}
                >
                  Dưới 2 triệu
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={arrPrice.some((pri) => pri === "3999999")}
                  onChange={() => {
                    window.location.reload();
                    if (arrPrice.indexOf("3999999") >= 0) {
                      setArrPrice(arrPrice.filter((pre) => pre !== "3999999"));
                    } else {
                      setArrPrice((pre) => [...pre, "3999999"]);
                    }
                  }}
                >
                  2 triệu - Dưới 4 triệu
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={arrPrice.some((pri) => pri === "5999999")}
                  onChange={() => {
                    window.location.reload();
                    if (arrPrice.indexOf("5999999") >= 0) {
                      setArrPrice(arrPrice.filter((pre) => pre !== "5999999"));
                    } else {
                      setArrPrice((pre) => [...pre, "5999999"]);
                    }
                  }}
                >
                  4 triệu - Dưới 6 triệu
                </Checkbox>
              </div>
              <div>
                <Checkbox
                  checked={arrPrice.some((pri) => pri === "6000000")}
                  onChange={() => {
                    window.location.reload();
                    if (arrPrice.indexOf("6000000") >= 0) {
                      setArrPrice(arrPrice.filter((pre) => pre !== "6000000"));
                    } else {
                      setArrPrice((pre) => [...pre, "6000000"]);
                    }
                  }}
                >
                  6 triệu trở lên
                </Checkbox>
              </div>
            </Card>
          </div>
        </div>
        <div className="col-start-2 col-end-6">
          <div>
            <img src={banner} alt="banner" className="w-full" />
          </div>
          {(type > 0 ? category.filter((x) => x.id === type) : category).map(
            (x) => (
              <div key={x.id} className="mt-5">
                <h2 className="text-green-400 pb-5">
                  <span className="mr-2 text-teal-400">
                    <FaClinicMedical />
                  </span>
                  <span className="capitalize">{x.name_category}</span>
                  <div className="text-sm font-bold float-right">
                    <Link className="text-orange-600 no-underline" to="/">
                      Xem thêm
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 mt-5 gap-3">
                    {findByParentId(x.id).map((y) => (
                      <React.Fragment key={y.id}>
                        {findByChildrenId(y.id).map((z) => (
                          <div key={z.id}>
                            <Badge.Ribbon
                              text={`${z.promotional_price}%`}
                              color="red"
                            >
                              <Card
                                hoverable
                                style={{ height: 368 }}
                                bodyStyle={{
                                  padding: "8px",
                                }}
                                cover={
                                  <Link
                                    to={`/details/${z.id}`}
                                    className="no-underline px-6 pt-2"
                                  >
                                    <img
                                      alt={z.name_product}
                                      style={{ height: 250 }}
                                      width={190}
                                      src={
                                        url.find((y) => y.product_id === z.id)
                                          ?.image_url
                                      }
                                    />
                                  </Link>
                                }
                              >
                                <Link
                                  to={`/details/${z.id}`}
                                  className="no-underline"
                                >
                                  <Meta
                                    title={z.name_product}
                                    className="capitalize"
                                  />
                                  <div className="flex mt-4">
                                    <strike>
                                      {(
                                        (Math.floor(z.price) / 1000) *
                                        1000
                                      ).toLocaleString()}
                                      đ
                                    </strike>{" "}
                                    <span className="text-orange-600 font-bold ml-3">
                                      {(
                                        Math.floor(
                                          (((100 - z.promotional_price) / 100) *
                                            z.price) /
                                            1000
                                        ) * 1000
                                      ).toLocaleString()}
                                      đ
                                    </span>
                                  </div>
                                </Link>
                                <div className="text-sm m-2">
                                  <Button
                                    type="primary"
                                    className="w-full"
                                    onClick={() => saveOrder(x)}
                                  >
                                    THÊM VÀO GIỎ HÀNG
                                  </Button>
                                </div>
                              </Card>
                            </Badge.Ribbon>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </h2>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CategoryPage;
