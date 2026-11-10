# MOSARI RESORT & SPA - PLANTUML SYSTEM DIAGRAMS (OPTIMIZED LAYOUT)
## BTEC HND Unit 7: Software Development Life Cycle (SDLC) - Professional Design Specification

Tài liệu này cung cấp toàn bộ mã nguồn **PlantUML đã được tái cấu trúc bố cục (Optimized Layout)** cho 4 sơ đồ quan trọng nhất.
Toàn bộ mã đã được căn chỉnh luồng mũi tên đối xứng 2 bên, loại bỏ hiện tượng mũi tên bị quấn vòng cung, lồng khung hoặc chồng chéo.

---

## 1. USE CASE DIAGRAM (SƠ ĐỒ CA SỬ DỤNG - BỐ CỤC ĐỐI XỨNG CÂN BẰNG)

> **Cải tiến bố cục**:
> - **Khách hàng (Customer)** nằm ở cột bên **TRÁI**.
> - **Lễ tân (Staff)**, **Quản trị viên (Admin)** và **Cổng ngân hàng (Bank Gateway)** nằm ở cột bên **PHẢI**.
> - Bên trong hệ thống chia thành 2 cột chức năng tự nhiên: Nhánh Khách Hàng (trái) và Nhánh Vận Hành & Thanh Toán (phải).
> - Mũi tên đi thẳng từ 2 phía vào trong, không bị lượn vòng cung dưới đáy.

### Mã nguồn PlantUML:
```plantuml
@startuml
left to right direction
skinparam monochrome false
skinparam shadowing false
skinparam roundcorner 10
skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 12
skinparam ArrowColor #2c3e50
skinparam ArrowThickness 1.2

' Custom Styling
skinparam actor {
  BackgroundColor #e8f4fd
  BorderColor #2980b9
  FontColor #1a5276
  FontStyle bold
}

skinparam usecase {
  BackgroundColor #ffffff
  BorderColor #c0a038
  FontColor #2c3e50
  ArrowColor #2c3e50
}

skinparam rectangle {
  BorderColor #7f8c8d
  BackgroundColor #fafbfc
  FontColor #11171d
  FontStyle bold
}

title MOSARI RESORT & SPA - USE CASE DIAGRAM (BALANCED LAYOUT)

' Actors on the Left
actor "Guest / Customer\n(Khách Hàng)" as Customer

' Actors on the Right
actor "Receptionist / Staff\n(Nhân Viên Lễ Tân)" as Staff
actor "Resort Admin / Manager\n(Quản Trị Viên)" as Admin
actor "Payment Gateway\n(Cổng VietQR Napas247)" as BankGateway

rectangle "Mosari Resort Room Booking & Payment System (BaaS)" {

  ' LEFT COLUMN: Customer-Facing Features
  package "Customer Services & Booking Flow" {
    usecase "UC1: Browse Destinations\n& Luxury Suites" as UC1
    usecase "UC2: Switch Language\n(VN / EN Bilingual)" as UC2
    usecase "UC3: Search & Check Availability\n(Real-time Inventory)" as UC3
    usecase "UC4: Create Room Reservation" as UC4
    usecase "UC5: Enforce Anti-Conflict\n(GIST 409 Conflict Check)" as UC5
    usecase "UC6: Track / Lookup\nReservation by Code" as UC6
    usecase "UC7: Cancel Pending Booking" as UC7
    usecase "UC8: Sign In / Sign Up\n(Supabase Auth)" as UC8
  }

  ' RIGHT COLUMN: Operations, Admin & Payment
  package "Operations, Finance & Management" {
    usecase "UC9: Select Receiving Bank\n& Generate Dynamic VietQR" as UC9
    usecase "UC10: Process Payment & Webhook\n(Auto Confirm Booking)" as UC10
    usecase "UC11: Audit & Manage\nPayments Ledger (TXN Code)" as UC11
    usecase "UC12: Manage Physical Rooms\n(Available/Maintenance/Occupied)" as UC12
    usecase "UC13: Approve / Reject\nBookings" as UC13
    usecase "UC14: 1-Click Admin Sign-In\n(Evaluator Demo)" as UC14
    usecase "UC15: 1-Click Seed Data\n& Supabase Cloud Sync" as UC15
  }

  ' Internal dependencies (Short & Direct)
  UC4 ..> UC3 : <<include>>
  UC4 ..> UC5 : <<include>>
  UC4 ..> UC9 : <<include>>
  UC10 ..> UC13 : <<include>>\n(auto confirms)

  ' Alignment helpers
  UC1 -[hidden]down- UC2
  UC2 -[hidden]down- UC3
  UC3 -[hidden]down- UC4
  UC4 -[hidden]down- UC6
  UC6 -[hidden]down- UC7
  UC7 -[hidden]down- UC8

  UC9 -[hidden]down- UC10
  UC10 -[hidden]down- UC11
  UC11 -[hidden]down- UC12
  UC12 -[hidden]down- UC13
  UC13 -[hidden]down- UC14
  UC14 -[hidden]down- UC15
}

' Connections for Customer (Left Side)
Customer --> UC1
Customer --> UC2
Customer --> UC3
Customer --> UC4
Customer --> UC6
Customer --> UC7
Customer --> UC8

' Connections for Staff (Right Side)
Staff --> UC3
Staff --> UC6
Staff --> UC12
Staff --> UC13
Staff --> UC8

' Connections for Admin (Right Side)
Admin --> UC11
Admin --> UC12
Admin --> UC13
Admin --> UC14
Admin --> UC15

' Connections for Payment Gateway (Right Side)
BankGateway --> UC10 : "Sends Webhook IPN"
UC9 ..> BankGateway : "Queries VietQR API"

@enduml
```

---

## 2. ENTITY RELATIONSHIP DIAGRAM (ERD - ĐƯỜNG NỐI VUÔNG GÓC ORTHO CHUẨN MỰC)

> **Cải tiến bố cục**:
> - Sử dụng `skinparam linetype ortho` tạo đường nối góc vuông 90 độ dứt khoát, không chồng chéo.
> - Bố trí dạng lưới 2 tầng đối xứng (Tầng 1: Khách sạn & Phòng; Tầng 2: Người dùng, Đơn phòng & Thanh toán).

### Mã nguồn PlantUML:
```plantuml
@startuml
skinparam linetype ortho
skinparam monochrome false
skinparam shadowing false
skinparam roundcorner 8
skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam classFontSize 11
skinparam classAttributeFontSize 10
skinparam classBackgroundColor #ffffff
skinparam classBorderColor #2c3e50
skinparam ArrowColor #2c3e50
skinparam ArrowThickness 1.2

title MOSARI RESORT & SPA - ENTITY RELATIONSHIP DIAGRAM (ORTHO GRID LAYOUT)

' LEVEL 1: RESORT & INVENTORY ENTITIES
package "Resort Master & Room Inventory" {
  entity "HOTELS" as hotels {
    * id : TEXT <<PK>>
    --
    * code : TEXT <<UK>>
    * name_vi : TEXT
    * name_en : TEXT
    * city_vi : TEXT
    * city_en : TEXT
    * address_vi : TEXT
    * address_en : TEXT
    * phone : TEXT
    image : TEXT
    * created_at : TIMESTAMPTZ
  }

  entity "ROOM_TYPES" as room_types {
    * id : TEXT <<PK>>
    --
    * hotel_id : TEXT <<FK>>
    * name_vi : TEXT
    * name_en : TEXT
    description_vi : TEXT
    description_en : TEXT
    * area : INT
    * capacity : INT
    * base_price : NUMERIC(14,2)
    amenities_vi : JSONB
    amenities_en : JSONB
    images : JSONB
    featured : BOOLEAN
    * created_at : TIMESTAMPTZ
  }

  entity "ROOMS" as rooms {
    * id : TEXT <<PK>>
    --
    * hotel_id : TEXT <<FK>>
    * room_type_id : TEXT <<FK>>
    * room_number : TEXT
    * status : TEXT <<Available | Occupied | Maintenance>>
    * created_at : TIMESTAMPTZ
  }
}

' LEVEL 2: RESERVATIONS, PAYMENTS & USERS
package "Transactions & Customer Accounts" {
  entity "PROFILES" as profiles {
    * id : UUID <<PK, FK -> auth.users>>
    --
    full_name : TEXT
    phone : TEXT
    * role : TEXT <<customer | employee | admin>>
    * created_at : TIMESTAMPTZ
    * updated_at : TIMESTAMPTZ
  }

  entity "BOOKINGS" as bookings {
    * id : UUID <<PK>>
    --
    * booking_code : TEXT <<UK>>
    * hotel_id : TEXT <<FK>>
    * room_type_id : TEXT <<FK>>
    room_id : TEXT <<FK>>
    room_number : TEXT
    * room_type_name : TEXT
    user_id : TEXT
    * customer_name : TEXT
    * customer_phone : TEXT
    * customer_email : TEXT
    * check_in_date : DATE
    * check_out_date : DATE
    * nights : INT
    * guests : INT
    * total_price : NUMERIC(14,2)
    * payment_method : TEXT
    * payment_status : TEXT <<Pending | Success | Failed>>
    * status : TEXT <<Pending | Confirmed | Completed | Cancelled>>
    special_requests : TEXT
    * created_at : TIMESTAMPTZ
  }

  entity "PAYMENTS" as payments {
    * id : UUID <<PK>>
    --
    * transaction_code : TEXT <<UK>>
    * booking_id : UUID <<FK>>
    * booking_code : TEXT <<Index>>
    * hotel_id : TEXT <<FK>>
    user_id : TEXT
    * customer_name : TEXT
    * amount : NUMERIC(14,2)
    * currency : TEXT <<VND>>
    * payment_method : TEXT
    * provider : TEXT
    * status : TEXT <<Pending | Completed | Failed | Refunded>>
    notes : TEXT
    paid_at : TIMESTAMPTZ
    * created_at : TIMESTAMPTZ
  }
}

' Horizontal Relationships
hotels ||-right-o{ room_types : "categorizes"
room_types ||-right-o{ rooms : "allocates"
profiles ||-right-o{ bookings : "creates"
bookings ||-right-|| payments : "generates ledger"

' Vertical Relationships
hotels ||-down-o{ rooms : "contains"
hotels ||-down-o{ bookings : "hosts"
hotels ||-down-o{ payments : "tracks revenue"
room_types ||-down-o{ bookings : "reserved as"
rooms ||-down-o{ bookings : "assigned to"

@enduml
```

---

## 3. CONTEXT DIAGRAM (DFD LEVEL 0 - BỐ CỤC HOA THỊ ĐỐI XỨNG TÂM)

> **Cải tiến bố cục**:
> - Hệ thống trung tâm `(0)` nằm ở chính giữa màn hình.
> - 4 thực thể ngoại vi bố trí xung quanh 4 hướng: **Trái** (Customer), **Phải** (Bank Gateway), **Trên** (Staff), **Dưới** (Admin).
> - Tất cả các mũi tên đều hướng thẳng vào tâm, hoàn toàn không có đường uốn cong.

### Mã nguồn PlantUML:
```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false
skinparam roundcorner 12
skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 11
skinparam ArrowColor #1a5276
skinparam ArrowThickness 1.2

title MOSARI RESORT & SPA - CONTEXT DIAGRAM (DFD LEVEL 0 - HUB & SPOKE LAYOUT)

' Top Entity
actor "Resort Staff / Receptionist\n(Nhân Viên Lễ Tân)" as Staff #eafaf1

' Left Entity
actor "Guest / Customer\n(Khách Hàng)" as Customer #e8f4fd

' Center System (Core Process)
rectangle "System Boundary" #f4f6f7 {
  circle "(0)\nMosari Resort\nOnline Booking\n& Payment System" as System #d4efdf
}

' Right Entity
actor "VietQR Banking Network\n(Cổng Thanh Toán Napas247)" as BankGateway #fef9e7

' Bottom Entity
actor "Resort Administrator\n(Ban Quản Trị Hệ Thống)" as Admin #fdf2e9

' --- Direct Straight Data Flows ---

' Customer (Left <-> Center)
Customer -right-> System : [In 1] Tiêu chí tìm kiếm & Ngày lưu trú\n[In 2] Thông tin đặt phòng & Liên hệ\n[In 3] Lựa chọn ngân hàng thụ hưởng\n[In 4] Mã tra cứu đơn (MSR-XXXXXX)
System -left-> Customer : [Out 1] Danh sách phòng trống & Đơn giá\n[Out 2] Trạng thái phòng (hoặc 409 Conflict)\n[Out 3] Mã QR thanh toán VietQR động\n[Out 4] Chi tiết xác nhận & Lịch sử đơn

' Staff (Top <-> Center)
Staff -down-> System : [In 5] Cập nhật trạng thái phòng vật lý\n[In 6] Duyệt đơn thanh toán tại quầy
System -up-> Staff : [Out 5] Danh sách khách nhận/trả phòng hôm nay\n[Out 6] Sơ đồ phòng sẵn sàng thời gian thực

' Bank Gateway (Right <-> Center)
System -right-> BankGateway : [Out 7] Yêu cầu tạo mã QR (STK, Số tiền, Mã MSR)
BankGateway -left-> System : [In 7] Tín hiệu Webhook / IPN thanh toán thành công

' Admin (Bottom <-> Center)
Admin -up-> System : [In 8] Cấu hình chi nhánh khách sạn & Loại phòng\n[In 9] Đối soát sổ cái thanh toán (TXN Code)\n[In 10] Lệnh đồng bộ 1-Click Supabase Seed
System -down-> Admin : [Out 8] Báo cáo doanh thu & Thống kê lấp đầy\n[Out 9] Sổ cái giao dịch thanh toán chi tiết

@enduml
```

---

## 4. DATA FLOW DIAGRAM LEVEL 1 (DFD LEVEL 1 - PHÂN RÃ THEO MA TRẬN 3 CỘT)

> **Cải tiến bố cục**:
> - Cột 1 (Trái): Các Thực thể Ngoại vi (**Entities**).
> - Cột 2 (Giữa): 5 Tiến trình xử lý theo thứ tự từ trên xuống dưới (**Processes 1.0 đến 5.0**).
> - Cột 3 (Phải): 5 Kho dữ liệu tương ứng (**Data Stores D1 đến D5**).
> - Luồng dữ liệu chạy ngang và dọc mạch lạc, rõ ràng.

### Mã nguồn PlantUML:
```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false
skinparam roundcorner 8
skinparam defaultFontName "Segoe UI", Arial, sans-serif
skinparam defaultFontSize 11
skinparam ArrowColor #2c3e50
skinparam ArrowThickness 1.2

title MOSARI RESORT & SPA - DFD LEVEL 1 (STRUCTURED 3-TIER ARCHITECTURE)

' LEFT COLUMN: External Entities
package "External Entities" {
  actor "Customer / Guest" as Customer #e8f4fd
  actor "Resort Admin / Staff" as Admin #fdf2e9
  actor "VietQR / Bank Gateway" as BankGateway #fef9e7
}

' MIDDLE COLUMN: Sequenced Processes
package "Core Processes" {
  rectangle "1.0\nAuthentication\n& RBAC Control" as P1 #d6eaf8
  rectangle "2.0\nSuite Search &\nConflict Detection" as P2 #d5f5e3
  rectangle "3.0\nReservation &\nPhysical Allocation" as P3 #fcf3cf
  rectangle "4.0\nMulti-Bank VietQR\n& Payment Ledger" as P4 #fdebd0
  rectangle "5.0\nAdministration &\nRevenue Reporting" as P5 #fadbd8
}

' RIGHT COLUMN: Database Stores (PostgreSQL BaaS)
package "Data Stores (PostgreSQL BaaS)" {
  database "D1: Hotels & Room Types" as D1 #ebf5fb
  database "D2: Physical Rooms" as D2 #e8f8f5
  database "D3: Bookings Store" as D3 #fefde8
  database "D4: Payments Ledger" as D4 #fef5e7
  database "D5: User Profiles" as D5 #f5eef8
}

' Vertical Alignment of Processes
P1 -[hidden]down- P2
P2 -[hidden]down- P3
P3 -[hidden]down- P4
P4 -[hidden]down- P5

' Vertical Alignment of Stores
D5 -[hidden]down- D1
D1 -[hidden]down- D2
D2 -[hidden]down- D3
D3 -[hidden]down- D4

' --- FLOWS FOR PROCESS 1.0 (Auth) ---
Customer --> P1 : Thông tin đăng nhập / đăng ký
P1 <--> D5 : Đọc / ghi hồ sơ người dùng & quyền (RBAC)
P1 --> Customer : JWT Session Token & Phân quyền

' --- FLOWS FOR PROCESS 2.0 (Search & Conflict Check) ---
Customer --> P2 : Lọc chi nhánh, ngày lưu trú, số khách
P2 <-- D1 : Đọc giá và quy cách hạng phòng
P2 <-- D2 : Đọc số phòng vật lý sẵn sàng
P2 <-- D3 : Đọc các khoảng ngày đã đặt
P2 --> Customer : Danh sách phòng trống thời gian thực

' --- FLOWS FOR PROCESS 3.0 (Reservation & Allocation) ---
Customer --> P3 : Gửi yêu cầu đặt phòng
P3 <--> D2 : Tìm và giữ phòng trống (Phòng 101, 201...)
P3 --> D3 : INSERT đơn đặt phòng [GIST Exclusion check]
note right of P3
  Nếu trùng ngày: ném lỗi HTTP 409 Conflict
  Nếu hợp lệ: cấp mã MSR-XXXXXX
end note
P3 --> Customer : Xác nhận mã đặt phòng & thông tin đơn

' --- FLOWS FOR PROCESS 4.0 (Payment & Ledger) ---
P3 --> P4 : Kích hoạt tạo giao dịch thanh toán
P4 --> D4 : INSERT bản ghi thanh toán (TXN-XXXXXX, Pending)
Customer --> P4 : Chọn ngân hàng (MBBank / Vietcombank)
P4 --> Customer : Sinh mã QR Napas247 tương ứng
Customer --> P4 : Bấm "Xác nhận đã chuyển khoản" (Demo Webhook)
BankGateway --> P4 : Tín hiệu Webhook IPN tiền về
P4 --> D4 : UPDATE payments (Status: Completed, Paid_at)
P4 --> D3 : DB Trigger: UPDATE bookings (Status: Confirmed)

' --- FLOWS FOR PROCESS 5.0 (Admin & Audit) ---
Admin --> P5 : Cập nhật trạng thái phòng (Bảo trì/Sẵn sàng)
P5 --> D2 : Cập nhật bảng rooms
Admin --> P5 : Truy vấn báo cáo tài chính & Sổ cái
P5 <-- D4 : Đọc toàn bộ giao dịch thanh toán (TXN)
P5 <-- D3 : Đọc thống kê đơn phòng
P5 --> Admin : Hiển thị bảng điều khiển & Thống kê doanh thu

@enduml
```

---

## 5. HƯỚNG DẪN XUẤT ẢNH CHẤT LƯỢNG CAO CHO BÁO CÁO BTEC

1. Truy cập **[PlantText.com](https://www.planttext.com/)** hoặc **[PlantUML Online Server](https://www.plantuml.com/plantuml/uml/)**.
2. Sao chép toàn bộ mã khối từ `@startuml` đến `@enduml` của sơ đồ bạn chọn và dán vào.
3. Chọn xuất ảnh định dạng:
   - **PNG**: Chọn độ phân giải cao để chèn trực tiếp vào tài liệu Word báo cáo.
   - **SVG**: Định dạng đồ họa vector không bị vỡ nét ở mọi kích thước in ấn.
