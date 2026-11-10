// Seed data for Mosari Resort & Spa chain (Multi-branch and Bilingual VI/EN)

export const SEED_HOTELS = [
  {
    id: "h_danang",
    code: "MSR-DN",
    name_vi: "Mosari Luxury Resort & Spa Đà Nẵng",
    name_en: "Mosari Luxury Resort & Spa Da Nang",
    city_vi: "Đà Nẵng",
    city_en: "Da Nang",
    address_vi: "Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng",
    address_en: "Vo Nguyen Giap St, Ngu Hanh Son, Da Nang",
    phone: "0236 3999 888",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "h_phuquoc",
    code: "MSR-PQ",
    name_vi: "Mosari Pearl Island Resort & Spa Phú Quốc",
    name_en: "Mosari Pearl Island Resort & Spa Phu Quoc",
    city_vi: "Phú Quốc",
    city_en: "Phu Quoc",
    address_vi: "Bãi Khem, An Thới, TP. Phú Quốc, Kiên Giang",
    address_en: "Khem Beach, An Thoi, Phu Quoc Island",
    phone: "0297 3888 999",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "h_nhatrang",
    code: "MSR-NT",
    name_vi: "Mosari Oceanfront Suites Nha Trang",
    name_en: "Mosari Oceanfront Suites Nha Trang",
    city_vi: "Nha Trang",
    city_en: "Nha Trang",
    address_vi: "Trần Phú, Lộc Thọ, TP. Nha Trang, Khánh Hòa",
    address_en: "Tran Phu St, Loc Tho, Nha Trang City",
    phone: "0258 3777 666",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
  }
];

export const SEED_ROOM_TYPES = [
  {
    id: "1",
    hotel_id: "h_danang",
    name: "Phòng Deluxe Hướng Biển",
    name_vi: "Phòng Deluxe Hướng Biển",
    name_en: "Deluxe Ocean View Room",
    description: "Tận hưởng bình minh trên biển ngay từ ban công riêng. Trang bị giường đôi cỡ lớn và bồn tắm đứng.",
    description_vi: "Tận hưởng bình minh trên biển ngay từ ban công riêng. Trang bị giường đôi cỡ lớn và bồn tắm đứng.",
    description_en: "Witness sunrise over the ocean directly from your private balcony. Furnished with King-size bed and walk-in rain shower.",
    long_description: "Thức giấc cùng tiếng sóng vỗ và đón ánh bình minh tuyệt đẹp ngay từ ban công riêng tư của bạn. Phòng Deluxe Hướng Biển được thiết kế với tông màu đại dương mát mẻ, trang bị giường King-size êm ái, bồn tắm đứng vách kính sang trọng và khu vực ghế sofa đọc sách. Một trải nghiệm đánh thức mọi giác quan.",
    long_description_vi: "Thức giấc cùng tiếng sóng vỗ và đón ánh bình minh tuyệt đẹp ngay từ ban công riêng tư của bạn. Phòng Deluxe Hướng Biển được thiết kế với tông màu đại dương mát mẻ, trang bị giường King-size êm ái, bồn tắm đứng vách kính sang trọng và khu vực ghế sofa đọc sách. Một trải nghiệm đánh thức mọi giác quan.",
    long_description_en: "Awaken to the soothing melody of ocean waves and catch the golden morning light from your private balcony. The Deluxe Ocean View Room is appointed with calming coastal tones, plush King bedding, an Italian glass shower, and a cozy reading alcove.",
    area: 45,
    capacity: 2,
    base_price: 2800000,
    amenities: ["Free Wifi", "Ban công view biển", "Bồn tắm đứng", "Smart TV 55 inch", "Minibar cao cấp", "Máy pha cà phê"],
    amenities_vi: ["Free Wifi", "Ban công view biển", "Bồn tắm đứng", "Smart TV 55 inch", "Minibar cao cấp", "Máy pha cà phê"],
    amenities_en: ["Free High-speed Wifi", "Ocean Balcony", "Walk-in Rain Shower", "55-inch 4K Smart TV", "Premium Minibar", "Espresso Machine"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true
  },
  {
    id: "2",
    hotel_id: "h_danang",
    name: "Phòng Suite Cao Cấp",
    name_vi: "Phòng Suite Cao Cấp",
    name_en: "Executive Luxury Suite",
    description: "Không gian rộng rãi với khu vực tiếp khách riêng biệt. Phòng tắm cẩm thạch trang bị bồn tắm jacuzzi thư giãn.",
    description_vi: "Không gian rộng rãi với khu vực tiếp khách riêng biệt. Phòng tắm cẩm thạch trang bị bồn tắm jacuzzi thư giãn.",
    description_en: "Spacious living sanctuary with dedicated lounge area. Italian marble bathroom featuring rejuvenating jacuzzi.",
    long_description: "Biểu tượng của sự xa hoa và tinh tế. Suite Cao Cấp sở hữu không gian mở rộng lớn, phân chia rõ rệt giữa phòng khách tiếp tân sang trọng và phòng ngủ riêng tư. Điểm nhấn là phòng tắm ốp đá cẩm thạch Ý với bồn tắm Jacuzzi sục massage, cùng các đặc quyền VIP bao gồm bữa sáng tại phòng và quyền sử dụng Club Lounge.",
    long_description_vi: "Biểu tượng của sự xa hoa và tinh tế. Suite Cao Cấp sở hữu không gian mở rộng lớn, phân chia rõ rệt giữa phòng khách tiếp tân sang trọng và phòng ngủ riêng tư. Điểm nhấn là phòng tắm ốp đá cẩm thạch Ý với bồn tắm Jacuzzi sục massage, cùng các đặc quyền VIP bao gồm bữa sáng tại phòng và quyền sử dụng Club Lounge.",
    long_description_en: "The pinnacle of contemporary luxury and refined indulgence. The Executive Suite boasts a generous open-plan layout distinguishing a lavish greeting parlor from a secluded master bedroom. The marble ensuite features a heated jacuzzi spa along with Club Lounge VIP privileges.",
    area: 70,
    capacity: 2,
    base_price: 5500000,
    amenities: ["Ăn sáng tại phòng", "Bồn tắm Jacuzzi", "Phòng khách riêng", "Minibar miễn phí", "Club Lounge Access", "Hoa tươi & Rượu vang"],
    amenities_vi: ["Ăn sáng tại phòng", "Bồn tắm Jacuzzi", "Phòng khách riêng", "Minibar miễn phí", "Club Lounge Access", "Hoa tươi & Rượu vang"],
    amenities_en: ["Complimentary In-room Breakfast", "Jacuzzi Spa Bath", "Private Parlor", "Complimentary Minibar", "Club Lounge Access", "Fresh Floral & Wine Welcome"],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true
  },
  {
    id: "3",
    hotel_id: "h_danang",
    name: "Phòng Family Suite",
    name_vi: "Phòng Family Suite",
    name_en: "Grand Family Residence",
    description: "Lựa chọn hoàn hảo cho gia đình. Hai phòng ngủ thông nhau, đảm bảo không gian chung ấm cúng và sự riêng tư tuyệt đối.",
    description_vi: "Lựa chọn hoàn hảo cho gia đình. Hai phòng ngủ thông nhau, đảm bảo không gian chung ấm cúng và sự riêng tư tuyệt đối.",
    description_en: "Ideal harmony for traveling families. Two interconnected master suites blending cozy togetherness and privacy.",
    long_description: "Không gian gắn kết hoàn hảo cho những kỳ nghỉ gia đình. Family Suite là sự kết hợp thông minh của hai phòng ngủ riêng biệt nhưng được kết nối qua một không gian sinh hoạt chung rộng rãi. Trẻ em sẽ yêu thích góc giải trí với Smart TV và máy chơi game, trong khi bố mẹ có thể tận hưởng sự thư giãn tuyệt đối tại quầy bar mini cao cấp trong phòng.",
    long_description_vi: "Không gian gắn kết hoàn hảo cho những kỳ nghỉ gia đình. Family Suite là sự kết hợp thông minh của hai phòng ngủ riêng biệt nhưng được kết nối qua một không gian sinh hoạt chung rộng rãi. Trẻ em sẽ yêu thích góc giải trí với Smart TV và máy chơi game, trong khi bố mẹ có thể tận hưởng sự thư giãn tuyệt đối tại quầy bar mini cao cấp trong phòng.",
    long_description_en: "A blissful haven for multi-generational family getaways. The Grand Family Suite links two generous bedrooms across a shared entertainment hub with video games, kitchenette amenities, and deluxe bath tubs.",
    area: 90,
    capacity: 4,
    base_price: 7200000,
    amenities: ["2 Smart TV 65 inch", "Phòng ngủ thông nhau", "Khu vui chơi trẻ em", "Bếp nhỏ tiện ích", "Bồn tắm đôi", "Bữa sáng gia đình"],
    amenities_vi: ["2 Smart TV 65 inch", "Phòng ngủ thông nhau", "Khu vui chơi trẻ em", "Bếp nhỏ tiện ích", "Bồn tắm đôi", "Bữa sáng gia đình"],
    amenities_en: ["Dual 65-inch 4K Smart TVs", "Interconnected Bedrooms", "Kids Game Corner", "Pantry Kitchenette", "Dual Soaking Tubs", "Daily Family Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true
  },
  {
    id: "4",
    hotel_id: "h_danang",
    name: "Phòng Standard Hướng Phố",
    name_vi: "Phòng Standard Hướng Phố",
    name_en: "Urban Comfort Room",
    description: "Thiết kế tối giản, gọn gàng và đầy đủ tiện nghi. Sự lựa chọn tiết kiệm và hoàn hảo cho các chuyến công tác ngắn ngày.",
    description_vi: "Thiết kế tối giản, gọn gàng và đầy đủ tiện nghi. Sự lựa chọn tiết kiệm và hoàn hảo cho các chuyến công tác ngắn ngày.",
    description_en: "Minimalist elegance tailored for smart travelers and business stays. Fully appointed with panoramic city views.",
    long_description: "Khám phá sự cân bằng hoàn hảo giữa phong cách thiết kế đương đại và sự tiện nghi tối ưu. Phòng Standard Hướng Phố mang đến không gian nghỉ ngơi thư thái với cửa sổ lớn đón ánh sáng tự nhiên, góc làm việc công thái học và phòng tắm hiện đại. Lựa chọn lý tưởng để nạp lại năng lượng sau một ngày dài khám phá thành phố.",
    long_description_vi: "Khám phá sự cân bằng hoàn hảo giữa phong cách thiết kế đương đại và sự tiện nghi tối ưu. Phòng Standard Hướng Phố mang đến không gian nghỉ ngơi thư thái với cửa sổ lớn đón ánh sáng tự nhiên, góc làm việc công thái học và phòng tắm hiện đại. Lựa chọn lý tưởng để nạp lại năng lượng sau một ngày dài khám phá thành phố.",
    long_description_en: "Embrace ergonomic comfort and thoughtful minimalism. The Urban Comfort Room provides natural light, a high-productivity desk, walk-in shower, and high-speed fiber internet.",
    area: 30,
    capacity: 2,
    base_price: 1500000,
    amenities: ["Điều hòa nhiệt độ", "Bàn làm việc cao cấp", "Nước suối miễn phí", "Wifi tốc độ cao", "Két sắt an toàn"],
    amenities_vi: ["Điều hòa nhiệt độ", "Bàn làm việc cao cấp", "Nước suối miễn phí", "Wifi tốc độ cao", "Két sắt an toàn"],
    amenities_en: ["Smart Climate Control", "Ergonomic Desk", "Artisan Mineral Water", "High-speed Fiber Wifi", "Digital Safe"],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false
  },
  {
    id: "5",
    hotel_id: "h_danang",
    name: "Phòng Tổng Thống (Presidential Suite)",
    name_vi: "Phòng Tổng Thống (Presidential Suite)",
    name_en: "Royal Presidential Penthouse",
    description: "Đỉnh cao của sự xa hoa với 2 phòng ngủ siêu lớn, phòng khách có đại dương cầm, hồ bơi riêng và dịch vụ quản gia 24/7.",
    description_vi: "Đỉnh cao của sự xa hoa với 2 phòng ngủ siêu lớn, phòng khách có đại dương cầm, hồ bơi riêng và dịch vụ quản gia 24/7.",
    description_en: "The pinnacle of majesty featuring grand piano, private infinity dip pool, and dedicated 24/7 royal butler service.",
    long_description: "Trải nghiệm nghỉ dưỡng hoàng gia độc bản. Presidential Suite mang đến không gian hơn 150m2 với tầm nhìn panorama ôm trọn đại dương. Phòng được trang bị nội thất đặt làm thủ công, bao gồm phòng khách xa hoa có đại dương cầm, phòng ăn dành cho 8 người, quầy bar riêng tư và hồ bơi vô cực mini ngoài ban công. Khách lưu trú tận hưởng đặc quyền tối thượng với dịch vụ quản gia riêng 24/7, đầu bếp phục vụ tại phòng và xe đưa đón sân bay bằng Limousine.",
    long_description_vi: "Trải nghiệm nghỉ dưỡng hoàng gia độc bản. Presidential Suite mang đến không gian hơn 150m2 với tầm nhìn panorama ôm trọn đại dương. Phòng được trang bị nội thất đặt làm thủ công, bao gồm phòng khách xa hoa có đại dương cầm, phòng ăn dành cho 8 người, quầy bar riêng tư và hồ bơi vô cực mini ngoài ban công. Khách lưu trú tận hưởng đặc quyền tối thượng với dịch vụ quản gia riêng 24/7, đầu bếp phục vụ tại phòng và xe đưa đón sân bay bằng Limousine.",
    long_description_en: "Unsurpassed beachfront grandeur. Spanning over 150 sqm with sweeping ocean panoramas, a Steinway grand piano, personal infinity plunge pool, and dedicated round-the-clock butler service including VIP limousine airport transfers.",
    area: 150,
    capacity: 4,
    base_price: 25000000,
    amenities: ["Quản gia riêng 24/7", "Hồ bơi vô cực mini", "Limousine đưa đón sân bay", "Quầy bar rượu vang hảo hạng", "Đại dương cầm Steinway", "Bếp trưởng phục vụ riêng"],
    amenities_vi: ["Quản gia riêng 24/7", "Hồ bơi vô cực mini", "Limousine đưa đón sân bay", "Quầy bar rượu vang hảo hạng", "Đại dương cầm Steinway", "Bếp trưởng phục vụ riêng"],
    amenities_en: ["24/7 Dedicated Butler", "Private Infinity Plunge Pool", "VIP Limousine Chauffeur", "Curated Wine Cellar", "Steinway Grand Piano", "Private Executive Chef"],
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true
  }
];

export const SEED_ROOMS = [
  { id: "r1", hotel_id: "h_danang", room_type_id: "1", room_number: "101", status: "Available" },
  { id: "r2", hotel_id: "h_danang", room_type_id: "1", room_number: "102", status: "Available" },
  { id: "r3", hotel_id: "h_danang", room_type_id: "1", room_number: "103", status: "Available" },
  { id: "r4", hotel_id: "h_danang", room_type_id: "2", room_number: "201", status: "Available" },
  { id: "r5", hotel_id: "h_danang", room_type_id: "2", room_number: "202", status: "Maintenance" },
  { id: "r6", hotel_id: "h_danang", room_type_id: "3", room_number: "301", status: "Available" },
  { id: "r7", hotel_id: "h_danang", room_type_id: "4", room_number: "401", status: "Available" },
  { id: "r8", hotel_id: "h_danang", room_type_id: "4", room_number: "402", status: "Occupied" },
  { id: "r9", hotel_id: "h_danang", room_type_id: "5", room_number: "501", status: "Available" }
];

export const SEED_USERS = [
  {
    id: "u1",
    email: "admin.mosari@gmail.com",
    full_name: "admin",
    phone: "0999999999",
    role: "admin"
  },
  {
    id: "u2",
    email: "receptionist.mosari@gmail.com",
    full_name: "Receptionist",
    phone: "0901111111",
    role: "employee"
  },
  {
    id: "u3",
    email: "khachhang@gmail.com",
    full_name: "Khách hàng Demo",
    phone: "0903333333",
    role: "customer"
  }
];

export const SEED_BOOKINGS = [
  {
    id: "b1",
    booking_code: "MSR-784291",
    hotel_id: "h_danang",
    user_id: "u3",
    customer_name: "Khách hàng Demo",
    customer_phone: "0903333333",
    customer_email: "khachhang@gmail.com",
    room_type_id: "2",
    room_type_name: "Phòng Suite Cao Cấp",
    room_id: "r4",
    room_number: "201",
    check_in_date: "2026-10-20",
    check_out_date: "2026-10-23",
    nights: 3,
    guests: 2,
    total_price: 16500000,
    payment_method: "Bank Transfer",
    payment_status: "Success",
    status: "Confirmed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "b2",
    booking_code: "MSR-915234",
    hotel_id: "h_danang",
    user_id: "guest-02",
    customer_name: "Trần Anh Tuấn",
    customer_phone: "0912456789",
    customer_email: "anhtuan@example.com",
    room_type_id: "1",
    room_type_name: "Phòng Deluxe Hướng Biển",
    room_id: "r1",
    room_number: "101",
    check_in_date: "2026-11-05",
    check_out_date: "2026-11-07",
    nights: 2,
    guests: 2,
    total_price: 5600000,
    payment_method: "MoMo",
    payment_status: "Pending",
    status: "Pending",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const SEED_PAYMENTS = [
  {
    id: "p1",
    transaction_code: "TXN-F73771",
    booking_id: "b1",
    booking_code: "MSR-784291",
    hotel_id: "h_danang",
    user_id: "guest-01",
    customer_name: "Khách hàng Demo",
    amount: 16500000,
    currency: "VND",
    payment_method: "Bank Transfer",
    provider: "VietQR - MBBank Napas247",
    status: "Completed",
    notes: "Initial payment record for booking MSR-784291",
    paid_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "p2",
    transaction_code: "TXN-E0217B",
    booking_id: "b2",
    booking_code: "MSR-915234",
    hotel_id: "h_danang",
    user_id: "guest-02",
    customer_name: "Trần Anh Tuấn",
    amount: 5600000,
    currency: "VND",
    payment_method: "MoMo",
    provider: "MoMo E-Wallet",
    status: "Pending",
    notes: "Initial payment record for booking MSR-915234",
    paid_at: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const RESORT_SERVICES = [
  {
    id: "s1",
    title_vi: "Ẩm Thực Tinh Hoa",
    title_en: "Fine Dining & Michelin-Inspired",
    subtitle_vi: "Nhà Hàng Ven Biển",
    subtitle_en: "Oceanfront Gastronomy",
    description_vi: "Thưởng thức thực đơn thượng hạng với nguyên liệu hải sản tươi ngon nhất vịnh Đà Nẵng, được chế biến bởi các đầu bếp đẳng cấp quốc tế.",
    description_en: "Savor exquisite dishes made with the freshest local seafood and premium imported ingredients, crafted by award-winning master chefs.",
    hours: "06:00 - 22:30",
    image: "https://images.unsplash.com/photo-1712746785126-e9f28b5b3cc0?q=80&w=1200&auto=format&fit=crop",
    features_vi: ["Bữa sáng Buffet Quốc tế", "Nhà hàng Hải sản bên bờ biển", "Private Dining tại ban công phòng", "Bộ sưu tập vang thế giới"],
    features_en: ["International Breakfast Buffet", "Beachfront Seafood Restaurant", "Private In-suite Balcony Dining", "Grand Sommelier Wine Cellar"]
  },
  {
    id: "s2",
    title_vi: "Hồ Bơi Vô Cực",
    title_en: "Oceanview Infinity Pool",
    subtitle_vi: "Tầm Nhìn 180 Độ Biển",
    subtitle_en: "180° Panoramic Horizon",
    description_vi: "Thả mình vào làn nước mát lạnh trong hồ bơi tràn viền tầm nhìn panorama 180 độ hướng đại dương, nhâm nhi cocktail tươi tại Pool Bar.",
    description_en: "Unwind in the pristine waters of our infinity pool overlooking the endless ocean horizon while sipping artisanal tropical cocktails.",
    hours: "06:00 - 20:00",
    image: "https://images.unsplash.com/photo-1598095511385-216a40c514fc?q=80&w=1200&auto=format&fit=crop",
    features_vi: ["Hồ bơi nước ấm 4 mùa", "Poolside Bar & Canapé", "Ghế tắm nắng riêng tư", "Khu bơi an toàn cho trẻ em"],
    features_en: ["Four-Season Heated Pool", "Poolside Bar & Canapés", "Private Sun Loungers", "Dedicated Children Splash Area"]
  },
  {
    id: "s3",
    title_vi: "Spa & Trị Liệu Sen Thảo Dược",
    title_en: "Holistic Wellness & Lotus Spa",
    subtitle_vi: "Tái Tạo Năng Lượng Thân Tâm",
    subtitle_en: "Rejuvenate Mind, Body & Soul",
    description_vi: "Tái tạo năng lượng và cân bằng tâm trí với các liệu trình massage thảo mộc cung đình, bồn sục Jacuzzi nóng và phòng xông hơi đá muối Himalaya.",
    description_en: "Restore vitality and inner harmony with ancient royal herbal therapies, therapeutic hot jacuzzis, and authentic Himalayan salt saunas.",
    hours: "09:00 - 22:00",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop",
    features_vi: ["Liệu trình thảo mộc Đông y", "Bồn ngâm cánh hoa sen", "Phòng xông hơi đá muối", "Chuyên viên trị liệu giàu kinh nghiệm"],
    features_en: ["Traditional Herbal Therapy", "Lotus Petal Soaking Tubs", "Himalayan Pink Salt Sauna", "Internationally Certified Therapists"]
  },
  {
    id: "s4",
    title_vi: "Đưa Đón Limousine VIP",
    title_en: "VIP Chauffeur & Limousine",
    subtitle_vi: "Hành Trình Sang Trọng 24/7",
    subtitle_en: "Seamless 24/7 Luxury Travel",
    description_vi: "Dịch vụ đưa đón sân bay quốc tế Đà Nẵng và các danh thắng (Bà Nà Hills, Phố cổ Hội An) bằng dòng xe cao cấp với tài xế chuyên nghiệp.",
    description_en: "Private airport transfers and curated day journeys to UNESCO heritage sites in executive luxury vehicles with professional private chauffeurs.",
    hours: "24/7 theo yêu cầu / On demand",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    features_vi: ["Xe đưa đón riêng tư", "Nước suối và khăn lạnh miễn phí", "Wifi trên xe", "Hỗ trợ hành lý tận nơi"],
    features_en: ["Private Luxury Fleet", "Chilled Refreshments & Towels", "On-board High-speed Wifi", "Dedicated Luggage Assistance"]
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2000&auto=format&fit=crop",
    slogan_vi: "Chào mừng đến với sự hoàn mỹ",
    slogan_en: "Welcome to Ocean Perfection",
    titleLine1_vi: "Kỳ Nghỉ Dưỡng",
    titleLine1_en: "Ultimate Luxury",
    titleLine2_vi: "Thượng Lưu Đẳng Cấp",
    titleLine2_en: "Coastal Sanctuary",
    ctaText_vi: "Khám Phá Ngay",
    ctaText_en: "Explore Sanctuary",
    ctaLink: "#explore"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
    slogan_vi: "Tầm nhìn hướng biển tuyệt đẹp",
    slogan_en: "Breathtaking Ocean Panoramas",
    titleLine1_vi: "Trải Nghiệm",
    titleLine1_en: "Experience",
    titleLine2_vi: "Không Gian Vô Tận",
    titleLine2_en: "Timeless Serenity",
    ctaText_vi: "Xem Phòng & Giá",
    ctaText_en: "Rooms & Rates",
    ctaLink: "/rooms"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2000&q=80",
    slogan_vi: "Ẩm thực tinh hoa & thư giãn",
    slogan_en: "Fine Dining & Wellness",
    titleLine1_vi: "Đánh Thức",
    titleLine1_en: "Awaken Every",
    titleLine2_vi: "Mọi Giác Quan",
    titleLine2_en: "Single Sense",
    ctaText_vi: "Khám Phá Dịch Vụ",
    ctaText_en: "View Services",
    ctaLink: "/services"
  }
];
