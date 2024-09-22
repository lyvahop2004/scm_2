import React from 'react';

function Footer(props) {
  return (
    <div>
      <footer className="footer-area section_gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Liên hệ</h4>
              <ul>
                <li><a href="#">SĐt: 0379414056</a></li>
                <li><a href="#">Email: tuangatedien2@gmail.com</a></li>
                <li><a href="#">FB: Hoàng Tuấn</a></li>
                <li><a href="#">FPT Tây Nguyên</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Giới thiệu</h4>
              <ul>
                <li><a href="#">Được làm bởi Bờm</a></li>
                <li><a href="#">Web bán hàng</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6 single-footer-widget">
              <h4>Phiên bản</h4>
              <ul>
                <li><a href="#">V1.0</a></li>
              </ul>
            </div>


          </div>
          <div className="footer-bottom row align-items-center">
            <p className="footer-text m-0 col-lg-8 col-md-12">{/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
              Bản quyền ©2024 Thuộc bản quền của HT <i className="fa fa-heart-o" aria-hidden="true" />  <a href="https://colorlib.com" target="_blank"></a>
              {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}</p>

          </div>
        </div>
      </footer>

    </div>
  );
}

export default Footer;