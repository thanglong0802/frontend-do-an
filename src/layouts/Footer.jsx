import { Checkbox, Input } from "antd";

function Footer() {
  const CheckboxGroup = Checkbox.Group;
  const { Search } = Input;
  const plainOptions = ["Nữ", "Nam"];

  return (
    <div className="bg-white h-80 mt-10 text-black">
      <div>
        <div className="col-start-1 col-end-6 bg-blue-500 text-white grid grid-cols-5 px-52 p-2">
          <div className="font-bold mb-2 flex justify-start items-center">
            Y TẾ GIA ĐÌNH
          </div>
          <div className="font-bold mb-2 flex justify-start items-center">
            Y TẾ CHUYÊN DỤNG
          </div>
          <div className="font-bold mb-2 flex justify-start items-center">
            CHĂM SÓC SẮC ĐẸP
          </div>
          <div className="font-bold mb-2 flex justify-start items-center">
            CHĂM SÓC SỨC KHỎE
          </div>
          <div className="font-bold mb-2 flex justify-start items-center">
            ĐỒ DÙNG MẸ VÀ BÉ
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 text-sm pt-2 px-52">
        <div>
          <div className="text-sm">Máy đo huyết áp</div>
          <div className="text-sm">Máy đo đường huyết</div>
          <div className="text-sm">Máy xông mũi họng</div>
          <div className="text-sm">Vớ y khoa</div>
        </div>
        <div>
          <div className="text-sm">Máy tạo oxi y tế</div>
          <div className="text-sm">Máy trợ thở</div>
          <div className="text-sm">Máy đo nồng độ oxy - Điện tim</div>
          <div className="text-sm">Ống nghe y tế</div>
        </div>
        <div>
          <div className="text-sm">Chăm sóc da mặt</div>
          <div className="text-sm">Quần áo định hình</div>
          <div className="text-sm">Máy tỉa lông mũi/mày</div>
          <div className="text-sm">Máy massage mắt</div>
        </div>
        <div>
          <div className="text-sm">Máy chống ngáy</div>
          <div className="text-sm">Chăn đệm điện</div>
          <div className="text-sm">Máy massage</div>
          <div className="text-sm">Kem giãn tĩnh mạch</div>
        </div>
        <div>
          <div className="text-sm">Đai đỡ bụng bầu</div>
          <div className="text-sm">Áo Ngực, Áo Lót Cho Con Bú</div>
          <div className="text-sm">Đồ dùng cho bé ăn uống</div>
          <div className="text-sm">Đồ cho bé ngủ</div>
        </div>
      </div>
      <hr className="mt-4" />
      <div className="grid grid-cols-5 text-sm px-52 py-6">
        <div>
          <h4>CHĂM SÓC KHÁCH HÀNG</h4>
          <div className="text-sm">Thông tin liên hệ</div>
          <div className="text-sm">Dịch vụ bảo hành</div>
          <div className="text-sm">Phương thức thanh toán</div>
          <div className="text-sm">Hướng dẫn đăng ký thành viên</div>
          <div className="text-sm">Hướng dẫn mua hàng</div>
          <div className="text-sm font-bold text-orange-600">Xem tất cả</div>
        </div>
        <div>
          <h4>CHÍNH SÁCH</h4>
          <div className="text-sm">Chính sách vận chuyển và giao nhận</div>
          <div className="text-sm">Điều khoản sử dụng dịch vụ</div>
          <div className="text-sm">Chính sách bảo mật</div>
          <div className="text-sm">Chính sách kiểm hàng & đổi trả hàng</div>
          <div className="text-sm">Chính sách chất lượng</div>
          <div className="text-sm font-bold text-orange-600">Xem tất cả</div>
        </div>
        <div>
          <h4>TUYỂN DỤNG</h4>
          <div className="text-sm">
            Tuyển Dụng Nhân Viên Hành Chính - Nhân Sự Tháng 10/2022
          </div>
          <div className="text-sm">
            Tuyển Dụng Nhân Viên Thiết Kế Tháng 04/2022
          </div>
          <div className="text-sm">
            Tuyển Dụng Nhân Viên SEO web Tháng 03/2020
          </div>
          <div className="text-sm">
            Tuyển Dụng Vị Trí Giám sát bàn hàng tháng 06/2018
          </div>
          <div className="text-sm">
            Tyển Dụng Vị Trí Trade Marketing tháng 06/2018
          </div>
          <div className="text-sm">
            Tyển Dụng Vị Trí Thiết kế đồ họa tháng 06/2018
          </div>
          <div className="text-sm font-bold text-orange-600">Xem tất cả</div>
        </div>
        <div className="col-start-4 col-end-6 ml-4 h-36 border border-orange-500 border-solid">
          <div
            className=" py-1 px-2 text-white flex justify-center items-center font-bold"
            style={{ background: "red" }}
          >
            ĐĂNG KÝ NHẬN TIN
          </div>
          <div>
            <p className="text-center" style={{ fontSize: "13px" }}>
              Nhận những thông tin mới nhất & các ưu đãi hấp dẫn của Siêu Thị Y
              Tế
            </p>
            <div className="px-2 flex">
              <CheckboxGroup options={plainOptions} />
              <Search
                size="large"
                placeholder="Nhập tên sản phẩm bạn quan tâm"
                enterButton="Gửi"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
