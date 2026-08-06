# Kiến trúc Frontend (Nuxt 4 SSR base)

## Phạm vi

Tài liệu mô tả **cấu trúc ứng dụng Nuxt cơ bản, tái dùng được cho nhiều dự án**. Trọng tâm là cách tổ
chức `app/` và các biên (`app / server / shared`), quy ước và luồng dữ liệu — **không** gắn với
domain hoặc backend cụ thể.

- Domain được quyết định ở từng dự án; khi có, chỉ thêm folder theo domain, không đổi biên.
- Backend/provider được cô lập sau `server/integrations/<provider>/`. Tài liệu này cố ý không đi sâu
  backend — app không phụ thuộc trực tiếp provider nào.
- Khi bật i18n, dùng `@nuxtjs/i18n`; English là locale mặc định và URL dùng
  `prefix_except_default`. Quy ước message nằm duy nhất ở [.ai/rules/i18n.md](./.ai/rules/i18n.md).

## Nguyên tắc nền

- **Biên `app / server / shared`** theo chuẩn Nuxt 4.
- **BFF (Backend for Frontend):** browser không gọi thẳng backend. `app/` gọi Nitro (`server/api/`),
  Nitro mới gọi backend. Nhờ đó FE độc lập với backend và giữ secret/token ở server.
- **Chiều phụ thuộc một chiều:** áp dụng duy nhất theo
  [.ai/rules/architecture.md](./.ai/rules/architecture.md), không định nghĩa lại theo từng feature.
- **Contract là biên giữa server và app:** dữ liệu backend được map sang `shared/contracts` trước khi
  ra tới `app/`. Đổi backend chỉ ảnh hưởng `server/integrations/<provider>/`.
- Chỉ tạo directory khi có code thật dùng nó.

## Cấu trúc thư mục

Tên folder theo domain là **ví dụ** — thay bằng domain thật của từng dự án; biên và vai trò giữ nguyên.

```text
repository root/
├── app/                                 # chỉ code browser-safe; không import server
│   ├── app.vue                          # root: NuxtLayout + NuxtPage
│   ├── error.vue                        # trang lỗi cấp app
│   ├── assets/
│   │   └── style/
│   │       ├── tailwind.css             # entry Tailwind + @theme
│   │       └── tokens.css               # design tokens (màu, spacing, radius) — thêm khi cần
│   ├── components/                      # component tái dùng, auto-import theo tên
│   │   ├── ui/                          # primitive không nghiệp vụ: Button, Input, Badge, Modal...
│   │   ├── layout/                      # Header, Nav, Footer, Drawer
│   │   └── <feature>/                   # component theo domain (ví dụ, tùy dự án)
│   ├── composables/                     # logic có state tái dùng; gọi Nitro qua $fetch/useFetch
│   │   ├── useApi.ts                    # wrapper gọi server/api (tùy chọn)
│   │   └── use<Feature>.ts              # theo domain
│   ├── stores/                          # Pinia: chỉ state dùng chung nhiều view
│   │   └── <feature>.ts
│   ├── layouts/
│   │   └── default.vue                  # thêm layout khác khi cần (public, authenticated...)
│   ├── middleware/                      # route middleware (auth, guest...) — thêm khi cần
│   ├── plugins/                         # app/browser integration — thêm khi cần
│   ├── pages/                           # file-based routing = view + điều phối data + SEO meta
│   │   ├── index.vue
│   │   └── <route>/[param].vue          # route động (ví dụ)
│   └── utils/                           # pure helper browser-safe (format, class merge...)
├── server/                              # Nitro; sở hữu transport tới backend + secret
│   ├── api/                             # HTTP endpoint: parse input, set status, gọi service
│   │   └── <resource>/                  # mỗi endpoint = 1 use case (index.get.ts, [id].get.ts...)
│   ├── exceptions/                      # AppError + normalize lỗi về public contract an toàn
│   ├── logging/                         # structured logger, redaction, rate limit
│   ├── notifications/                   # notify orchestration + adapter theo channel
│   ├── routes/                          # non-API route (sitemap.xml, robots.txt...) — thêm khi cần
│   ├── services/                        # orchestration use case; tách khỏi HTTP để dễ test
│   │   └── <domain>/
│   ├── integrations/
│   │   └── <provider>/                  # nơi DUY NHẤT biết shape/transport backend
│   │       ├── client.ts                # transport: endpoint, auth header, timeout, xử lý lỗi
│   │       ├── dto/                      # kiểu dữ liệu thô đúng theo backend
│   │       └── mappers/                  # DTO thô → shared/contracts (ổn định)
│   └── utils/                            # server-only; auto-import (request context, safe error...)
├── shared/                              # app và server đều import; không import ngược
│   ├── contracts/                       # shape dữ liệu qua biên Nitro (server↔app, serializable)
│   ├── constants/                       # hằng dùng chung
│   ├── logging/                         # contract error report dùng chung app↔server
│   └── types/                           # kiểu thuần dùng chung (enum, union nhỏ) — không phải payload API
├── i18n/
│   └── locales/
│       └── en/                          # source of truth; namespace files + index.ts aggregator
├── tests/                               # tooling adapter; mirror path của app/server/shared
│   ├── unit/
│   ├── integration/                    # chỉ thêm khi có integration test thật
│   └── setup.ts
└── stories/                             # tooling adapter; mirror path của app/components
```

## Quy ước

- **`assets/style/` (số ít)** khớp baseline hiện có (`app/assets/style/tailwind.css` và path trong
  `nuxt.config.ts`).
- **Styling:** Tailwind là chính; custom dùng SCSS scoped cho ngoại lệ, tokens qua `@theme`. Quy ước
  đầy đủ ở [.ai/rules/styling.md](./.ai/rules/styling.md).
- **Phạm vi auto-import:** Nitro chỉ auto-import từ `server/utils/`; Nuxt chỉ auto-import
  `shared/utils/**` và `shared/types/**`. `server/{services,integrations}/`, `shared/contracts/` và
  `shared/constants/` **import tường minh** — có chủ đích.
- **Import:** dùng relative import trong cùng module/directory; dùng `@/` khi đi qua folder trong
  `app/`, và `~~/` khi import từ repo root (`server/`, `shared/`). Không dùng chuỗi `../../` để vượt
  layer.
- **Tooling tách rời:** test ở `tests/<kind>/<source-path>` và story ở `stories/<component-source-path>`.
  `tests/` và `stories/` được import runtime source; runtime source không bao giờ import ngược tooling.
- **`contracts` vs `types`:** `shared/contracts/` = shape dữ liệu đi qua biên Nitro (serializable,
  phiên bản hóa được). `shared/types/` = kiểu thuần dùng chung (enum, union, literal nhỏ), không phải
  payload API.
- **Naming:** `PascalCase` cho component & type; `camelCase` cho biến/hàm/composable; composable prefix
  `use`; boolean dạng predicate (`isLoading`, `hasAccess`). Chi tiết ở `.ai/rules/coding-standards.md`.

## Trách nhiệm từng layer

| Layer | Làm gì | Không làm gì |
|---|---|---|
| `app/pages` | route/query params, chọn layout, điều phối SSR data, metadata, chọn view theo trạng thái | không chứa transport/DTO/credential |
| `app/components` | render UI, phát event; hiểu contract | không hiểu DTO backend; UI primitive không chứa business logic |
| `app/composables` | API ổn định để page/component gọi Nitro; quản lý async-data key, refresh, view state | không thành service layer thứ hai ở client |
| `app/stores` | state dùng chung nhiều view (drawer, session đã lọc nhạy cảm) | không copy toàn bộ SSR data vào Pinia |
| `server/api` | parse/validate input, set HTTP status, gọi service, map lỗi an toàn | không chứa orchestration phức tạp |
| `server/services` | điều phối use case, gộp nhiều lời gọi, chứa business rule | hạn chế phụ thuộc HTTP object |
| `server/integrations/<provider>` | auth, timeout, transport, DTO thô, mapper → contract | không đưa raw provider error ra app |
| `shared/contracts` | shape serializable dùng chung app↔server | không copy toàn bộ backend schema |

## Luồng dữ liệu

### SSR read (render-critical)

```text
page/component
  └─ composable: useFetch('/api/<resource>/:id')      # SSR read
       └─ server/api/<resource>/[id].get.ts           # parse input, status
            └─ server/services/<domain>                 # orchestration
                 └─ integrations/<provider>/client.ts   # transport
                      └─ integrations/<provider>/mappers # DTO thô → contract
       ⇐ shared/contracts → SSR HTML + hydration payload
  ⇐ browser hydrate, không gọi lại request trùng
```

### Event-driven mutation

```text
component (emit)
  └─ useAppRequest action → $api('/api/<resource>', { method: 'POST' })
       └─ server/api → service → integration (mutation) → mapper
       ⇐ contract → cập nhật store → refresh UI liên quan
```

Read render-critical dùng `useAppFetch`; mutation dùng `useAppRequest`. Hai composable cung cấp
application API boundary thống nhất và dùng chung error contract. Feature code không gọi trực tiếp
`$fetch`/`useFetch` cho application API.

## Quy tắc SSR & hydration

- `useFetch` cho read thông thường; `useAsyncData` khi cần orchestration tùy biến.
- Async-data key ổn định; handler không side effect, luôn trả dữ liệu serializable.
- Giới hạn hydration payload về đúng field trang cần.
- Không lưu request-specific mutable state ở module scope (rò rỉ giữa SSR request).
- Browser API chỉ dùng trong client boundary.
- Xử lý rõ 4 trạng thái: pending, empty, error, success.

## SEO (khi cần)

- `useSeoMeta` cho title/description/social; `useHead` cho canonical/alternate.
- Nội dung quan trọng phải nằm trong server-rendered HTML.
- JSON-LD (nếu có) lấy từ cùng contract đang hiển thị; chỉ thêm field khi dữ liệu có thật.
- `sitemap.xml` / `robots.txt` đặt trong `server/routes/`, thêm khi chốt domain + indexing.
- Locale alternate chỉ thêm khi có từ hai locale và nội dung tương ứng đã sẵn sàng.

## Error strategy

Nitro boundary dùng `defineApiHandler` để normalize lỗi về `AppError` và trả `ApiErrorData` ổn định,
an toàn — không rò raw provider error:

```text
400  input không hợp lệ
401  chưa đăng nhập / session hết hạn
403  không được phép
404  không tìm thấy resource
409  xung đột trạng thái
422  backend từ chối business input hợp lệ về cấu trúc
502  backend trả response không hợp lệ
504  backend timeout
```

`ApiErrorData` chứa stable `code`, public `message`, `requestId`, và khi phù hợp có `fields` hoặc
`retryAfter`. App resolve presentation riêng theo context: `inline`, `toast`, `dialog`, `page`, hoặc
`silent`. Server error policy và UI presentation policy là hai trách nhiệm độc lập.

Log đủ context để định vị lỗi, nhưng không log credential, token, session id hay personal data. Chuẩn
xử lý lỗi / log / alert cụ thể ở [.ai/rules/observability.md](./.ai/rules/observability.md).

## Bảo mật (baseline)

- Secret/token chỉ ở private runtime config + cookie HttpOnly phía server; không vào Pinia/localStorage.
- Không mở proxy tổng quát cho browser gọi backend tùy ý — mỗi endpoint = 1 use case server kiểm soát.
- Validate input không tin cậy ở `server/api`; giữ SSR request isolation.
- Không thêm dependency (auth/validation/cache lib...) khi chưa có yêu cầu và chưa được duyệt.

## Ghi chú khi áp dụng

- Tạo `server/integrations/<provider>/` chỉ khi dự án đã chọn provider và có code tích hợp thật.
- Domain, cache policy và request context phải được chốt theo yêu cầu của từng dự án/tính năng.
