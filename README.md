# Todo List Frontend (Next.js)

Dự án Next.js Frontend cung cấp giao diện người dùng hiện đại, trực quan để quản lý danh sách công việc (Todo List). Dự án được xây dựng bằng **Next.js 14 (App Router)**, **React 18**, **TypeScript**, và **TailwindCSS**.

Giao diện hỗ trợ quản lý nhiều danh sách công việc riêng biệt, hỗ trợ tìm kiếm, lọc theo trạng thái, phân trang động và tạo công việc con lồng nhau không giới hạn cấp độ.

---

##  Tính năng nổi bật

* **Giao diện hiện đại (Modern UI):** Thiết kế tối giản, sạch sẽ, responsive hoàn toàn trên máy tính và thiết bị di động.
* **Cấu trúc dạng cây (Todo Tree):** Cho phép tạo công việc con lồng nhau không giới hạn cấp độ.
* **Quản lý danh sách (List Selector):** Dễ dàng chuyển đổi giữa các danh sách công việc khác nhau hoặc tạo danh sách mới.
* **Bộ lọc và tìm kiếm:** Tìm kiếm theo từ khóa và lọc nhanh theo trạng thái (`Tất cả`, `Chưa hoàn thành`, `Đã hoàn thành`).
* **Phân trang (Pagination):** Phân trang động cùng tùy chọn số lượng hiển thị trên mỗi trang (Page Size).

---

##  Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
* **Node.js** (Phiên bản khuyến nghị: `>= 18.x` hoặc `>= 20.x`)
* **npm** hoặc **yarn** hoặc **pnpm**
* Backend API của ứng dụng (đang chạy tại `http://localhost:8080` hoặc URL production).

---

## Hướng dẫn vào web frontend online
Mở trình duyệt và truy cập vào địa chỉ:  [**https://todoapp-ui.vercel.app/**](https://todoapp-ui.vercel.app/)

---

## Hướng dẫn chạy dự án ở Local

### Bước 1: Cài đặt thư viện (Dependencies)

Mở terminal tại thư mục gốc của dự án frontend và chạy lệnh sau để cài đặt các package cần thiết:

```bash
npm install
# hoặc sử dụng npm ci để cài đặt sạch và chính xác theo package-lock.json
npm ci
```

### Bước 2: Cấu hình biến môi trường (Environment Variables)

Tạo hoặc kiểm tra file `.env.local` tại thư mục gốc của dự án và đảm bảo URL API trỏ đúng đến Backend của bạn:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

> [!NOTE]
> Thay thế `http://localhost:8080/api` thành URL API thực tế của bạn nếu backend được triển khai trên môi trường cloud/production.

### Bước 3: Khởi động môi trường phát triển (Development Mode)

Chạy lệnh sau để khởi động dev server:

```bash
npm run dev
```

Sau khi chạy thành công, mở trình duyệt và truy cập:
 [**http://localhost:3000**](http://localhost:3000)

---

## Xây dựng và Khởi chạy Production

Để xây dựng ứng dụng tối ưu nhất và chạy trên môi trường production, thực hiện các lệnh sau:

1. **Build ứng dụng:**
   ```bash
   npm run build
   ```
2. **Khởi động production server:**
   ```bash
   npm run start
   ```

Ứng dụng sẽ chạy mặc định tại cổng `3000`.

---

## Khởi chạy dự án bằng Docker

Dự án đã được cấu hình sẵn `Dockerfile` với cơ chế **Multi-stage build** để tối ưu hóa dung lượng image đầu ra.

### 1. Build Docker Image

Chạy lệnh sau tại thư mục gốc để build Docker image:

```bash
docker build -t todo-frontend-nextjs .
```

### 2. Khởi chạy Docker Container

Sau khi build xong, khởi chạy container bằng lệnh:

```bash
docker run -d -p 3000:3000 --name todo-frontend-app todo-frontend-nextjs
```

Kiểm tra ứng dụng hoạt động tại địa chỉ: [**http://localhost:3000**](http://localhost:3000).

---

## 📂 Cấu trúc thư mục chính

```text
todo-frontend-nextjs/
├── app/                  # Next.js App Router (Page, Layout, Style)
│   ├── layout.tsx        # Cấu hình Layout chính của dự án
│   └── page.tsx          # Trang chính HomePage chứa logic điều khiển chính
├── components/           # Các component tái sử dụng (Pagination, SearchBar, TodoTree...)
├── lib/                  # Các hàm tiện ích, cấu hình API Axios client
├── types/                # Định nghĩa kiểu dữ liệu TypeScript (Interface, Types)
├── Dockerfile            # Cấu hình Docker build môi trường production
└── tailwind.config.ts    # Cấu hình CSS Tailwind
```
