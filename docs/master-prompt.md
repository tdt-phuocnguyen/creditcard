# MASTER PROMPT: BUILD A CINEMATIC SLIDE-BASED CREDIT CARD PRESENTATION WEBSITE

## 1. Role and objective

Act as a senior product designer, creative director, motion designer, and senior frontend engineer.

Build a complete, production-quality, slide-based web presentation in Vietnamese about **“Thẻ tín dụng: Hiểu luật chơi”**. The output must feel like a premium keynote presentation, not a conventional website, not a long scrolling landing page, and not a static collection of cards.

The presentation is for a 30-minute live talk. It contains exactly 19 slides. The presenter should control the pace and reveal information deliberately.

**Primary objective:** deliver a visually memorable, coherent, highly polished presentation that explains credit-card mechanics, costs and risks, cashback/MCC, card-combo optimization, and safe usage.

**Do not invent financial, legal, regulatory, or bank-specific facts.** Use the slide content below as the source of truth. Preserve all caveats and illustrative labels. If a detail is uncertain or depends on bank policy, explicitly present it as conditional rather than universal.

## 2. Required output

Create a working web application, not a design description.

- A slide-based presentation with one active slide at a time.
- Exactly 19 slides, in the exact order specified below.
- A 16:9 presentation canvas that scales responsively while preserving its aspect ratio.
- Presentation Mode and Overview Mode.
- Keyboard and mouse navigation.
- Carefully choreographed animations and selective 3D scenes.
- Responsive layout for desktop and tablet; provide a usable mobile fallback.
- Working interactions for flip cards, charts, navigation, and relevant visual controls.
- Clean, maintainable components and data-driven slide content.
- No speaker notes and no presenter script. Only visible slide content.

Do not stop after creating a landing page or a few representative slides. Implement all 19 slides.

## 3. Art direction

### Visual identity

Use a refined combination:
- 60% Apple Keynote: cinematic typography, disciplined spacing, elegant transitions, clear hierarchy.
- 25% Stripe fintech: precise diagrams, sophisticated data visualization, clean product-interface details.
- 15% premium 3D motion design: selective hero objects and meaningful dimensional scenes.

### Mood

- Premium, intelligent, modern, calm, confident, and technically credible.
- Avoid generic “crypto” visuals, casino aesthetics, excessive gradients, random glassmorphism, and childish illustrations.
- Avoid the look of a bank advertisement. This is an educational presentation.

### Color system

Use a dark-first visual system:
- Background: near-black / deep navy.
- Primary text: off-white.
- Secondary text: cool muted gray.
- Accent: electric blue and cyan.
- Secondary accent: restrained violet.
- Use green only for positive financial outcomes and red/orange only for risk or warnings.
- Maintain accessible contrast. Do not use accent colors for every element.

Suggested palette:
- `#070B14` deep background
- `#0D1424` elevated surface
- `#F4F7FB` primary text
- `#A6B2C5` secondary text
- `#4EA1FF` electric blue
- `#55D6E8` cyan
- `#8B7CFF` violet
- `#3DD6A5` positive
- `#FF6B6B` risk

Use subtle gradients, soft radial lighting, fine borders, and controlled shadows. Avoid heavy outlines and excessive blur.

### Typography

Use a modern sans-serif family such as Geist, Inter, or a high-quality Vietnamese-compatible equivalent.
- Large, assertive headlines.
- Short supporting statements.
- Strong numerical hierarchy.
- Use tabular numerals for money, dates, percentages, and metrics.
- Ensure Vietnamese diacritics render correctly.
- Never shrink all content to fit. Re-layout or simplify visual density while preserving meaning.

### Layout principles

- 16:9 canvas, centered.
- Safe margins around all edges.
- One dominant message per slide.
- Keep supporting text concise and scannable.
- Use diagrams and visual metaphors instead of paragraphs wherever possible.
- Do not make every slide a grid of identical cards.
- Alternate visual compositions to create rhythm: full-bleed hero, split-screen, timeline, flow diagram, data visualization, comparison, interactive cards, closing statement.
- Do not add decorative elements that compete with the message.

## 4. Technology stack

Use the following stack unless the execution environment makes a specific library unavailable. If a dependency is unavailable, implement an equivalent without reducing functionality.

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- GSAP for orchestrated slide timelines and complex reveal sequences
- Framer Motion for component transitions and micro-interactions
- Three.js with React Three Fiber and Drei for selective 3D scenes
- Recharts or custom SVG for charts
- Lucide React for icons

Use a component-based architecture. Keep slide content in structured data/configuration where practical, while allowing custom compositions for visually distinctive slides.

Suggested structure:
- `app/page.tsx`: presentation shell
- `components/Presentation.tsx`: navigation and mode management
- `components/SlideFrame.tsx`: fixed 16:9 frame
- `components/SlideNavigation.tsx`: progress and controls
- `components/OverviewGrid.tsx`: slide overview
- `components/AnimatedText.tsx`: text reveal primitives
- `components/Scene3D/`: isolated 3D scenes
- `slides/`: slide-specific components or data
- `lib/slideContent.ts`: structured slide content
- `lib/animationPresets.ts`: reusable motion presets

Avoid a monolithic component. Use semantic HTML and accessible controls.

## 5. Presentation interaction model

### Presentation Mode

- Show exactly one slide at a time.
- Fit the presentation into the available viewport.
- Maintain 16:9 ratio.
- Do not allow page scrolling during presentation.
- Show a subtle progress bar and slide index, for example `06 / 19`.
- Navigation controls should be discreet and visually integrated.
- Support:
  - `ArrowRight`: next slide or next reveal step.
  - `ArrowLeft`: previous reveal step or previous slide.
  - `Space`: next reveal step or next slide.
  - `Home`: first slide.
  - `End`: last slide.
  - `F`: enter fullscreen.
  - `Esc`: exit fullscreen or close Overview Mode.
- Clicking the right side of the canvas may advance; clicking the left side may go back, but do not interfere with interactive elements.
- Add a small help/control hint that can be dismissed.
- Respect browser fullscreen restrictions and show a graceful fallback if fullscreen is unavailable.

### Overview Mode

- Open via a clearly discoverable button or keyboard shortcut of your choice.
- Display all 19 slides as a thumbnail grid.
- Each thumbnail includes slide number and title.
- Selecting a thumbnail navigates directly to that slide and returns to Presentation Mode.
- The overview must remain usable at common desktop and tablet widths.

### Reveal steps

Some slides should reveal content in controlled steps:
- Roadmap: reveal five chapters sequentially.
- Transaction flow: reveal participants and then the transaction route.
- Billing cycle: reveal purchase, statement, then due date.
- Minimum payment: reveal full-payment path and minimum-payment path separately.
- 10 fee cards: allow presenter to flip cards manually.
- MCC: reveal classification and eligibility outcomes.
- Cashback formula: reveal each filter and then the calculation.
- Spending analysis: reveal categories and then total.
- Card combo: reveal individual card economics and then net result.
- Utilization: animate gauge to each example level.
- Security: reveal rules in groups.

Keyboard navigation must not skip important reveal steps. Once all reveal steps on a slide are complete, the next navigation advances to the next slide.

## 6. Motion design system

Motion should feel deliberate, premium, and restrained. It must reinforce comprehension.

### Global transitions

- Use smooth slide transitions, generally 450–750 ms.
- Prefer opacity + subtle translation + controlled scale.
- Avoid aggressive spinning, bouncing, elastic overshoot, or long cinematic transitions that slow the talk.
- Use directional continuity: forward navigation moves content subtly left/up; backward navigation reverses the direction.
- Keep the background stable where possible to create continuity.

### Text animation

- Headlines: opacity + vertical reveal, 500–700 ms.
- Supporting lines: staggered reveal, 60–100 ms between items.
- Numbers: count-up only when the number is a key data point and the animation is not misleading.
- Avoid animating every word independently.
- Use clip-path or mask reveals sparingly and only when they improve the visual hierarchy.

### Charts and diagrams

- Animate bars from zero to final value.
- Animate donut charts clockwise.
- Draw SVG connectors and arrows progressively.
- Reveal flow nodes in causal order.
- Keep labels visible long enough to read.
- Use animation only on first entry or when the presenter explicitly triggers a reveal. Do not continuously animate charts.

### Micro-interactions

- Buttons: subtle hover, focus, and pressed states.
- Cards: gentle elevation and border/accent response.
- Flip cards: 3D flip with readable front/back states.
- Navigation: smooth active-state movement.
- Tooltips: short fade/scale transitions.
- Ensure interactions work with keyboard and touch, not hover only.

### Performance and accessibility

- Honor `prefers-reduced-motion`.
- Under reduced motion, replace movement with simple opacity changes or immediate state changes.
- Avoid unnecessary continuous animation loops.
- Pause or reduce animation when a slide is not active.
- Use GSAP context cleanup and kill timelines on unmount.
- Avoid layout shifts.
- Ensure 60fps target on modern desktop hardware where feasible, without making it a hard correctness claim.

## 7. Selective 3D direction

Use 3D only when it adds explanatory or emotional value. Do not place 3D objects on every slide.

### 3D Scene A: Opening credit card

**Slide 1**
- One premium metal credit card floating in a dark environment.
- Slight perspective tilt, beveled edges, realistic but restrained material.
- Subtle cyan/blue rim light.
- Slow, low-amplitude idle movement.
- On slide entry, card moves into position and rotates slightly to reveal its surface.
- Keep text readable and separate from the object.
- Do not reproduce a real bank card, real card number, or actual security data.

### 3D Scene B: Payment ecosystem

**Slide 4**
- Use dimensional nodes or a restrained 2.5D network.
- Cardholder, Merchant, Acquirer, Network, Issuer represented as distinct nodes.
- Animated transaction pulse travels through the nodes.
- Prefer 3D depth with 2D labels, rather than complex 3D typography.

### 3D Scene C: Billing cycle

**Slide 6**
- A circular or orbital timeline with three key points: purchase, statement, due date.
- A small card/token travels along the timeline.
- Dates remain readable and anchored.
- Clearly communicate that the displayed dates are illustrative.

### 3D Scene D: Cashback

**Slide 13 or 15**
- Use a small number of premium metallic tokens/coins flowing through a filter or cap.
- Coins stop at the cashback cap to illustrate the difference between theoretical and actual cashback.
- Avoid casino-like coin showers.

### 3D Scene E: Utilization gauge

**Slide 17**
- A clean dimensional ring or gauge with a moving indicator.
- Use restrained lighting.
- Clearly label 10%, 30%, 70%.
- Label 30% as a reference heuristic, not an official CIC rule.

### 3D Scene F: Security

**Slide 18**
- A premium card protected by a transparent shield.
- Small threat indicators are blocked or dimmed.
- Do not depict hacking screens, hooded figures, or sensational cybercrime imagery.

### 3D implementation requirements

- Use React Three Fiber and Drei where available.
- Isolate each scene in a dedicated component.
- Use lazy loading and dynamic imports for 3D scenes.
- Render only the active scene.
- Use a static image/SVG/CSS fallback if WebGL is unavailable.
- Avoid large textures and excessive polygon counts.
- Disable continuous rendering when the scene is idle where possible.
- Do not let a 3D scene block navigation or slide readability.

## 8. Slide-by-slide creative direction and exact content

Implement all 19 slides. The following content is authoritative. Preserve the meaning, numerical values, and caveats. You may shorten visible copy for layout, but do not remove material qualifications or alter the calculations.

### Slide 1 — Opening

**Headline:** THẺ TÍN DỤNG  
**Subheadline:** Hiểu luật chơi. Tối ưu lợi ích. Kiểm soát rủi ro.

Tags:
- Hoàn tiền (Cashback)
- MCC và phân loại giao dịch
- Tối ưu combo thẻ
- Chi phí, CIC và an toàn

Key message: Biết cách vận hành trước khi tìm cách tận dụng lợi ích.

Visual: premium floating credit card, dark cinematic hero, subtle particles and rim lighting.

### Slide 2 — Roadmap

**Headline:** Từ hiểu thẻ đến sử dụng thẻ có chiến lược

Five chapters:
1. Hiểu về thẻ
2. Chi phí và rủi ro
3. Cashback và MCC
4. Tối ưu combo thẻ
5. Sử dụng an toàn

Key message: Hiểu cơ chế → hiểu chi phí → tối ưu lợi ích.

Visual: five-stage journey/timeline. Reveal each chapter sequentially.

### Slide 3 — Debit vs Credit

**Headline:** Cùng là thẻ thanh toán, nhưng nguồn tiền khác nhau

Debit:
- Chi tiêu từ số dư tài khoản của chủ thẻ.
- Giao dịch thường làm giảm số dư khả dụng ngay.
- Không phải khoản vay tín dụng quay vòng theo cơ chế thẻ tín dụng.

Credit:
- Chi tiêu trong hạn mức tín dụng được tổ chức phát hành cấp.
- Phát sinh nghĩa vụ thanh toán với tổ chức phát hành.
- Là hình thức cấp tín dụng, có kỳ sao kê và hạn thanh toán.

Examples:
- Debit: Tài khoản có 10 triệu, thanh toán 2 triệu, số dư giảm tương ứng.
- Credit: Hạn mức 50 triệu, thanh toán 2 triệu, chủ thẻ cần hoàn trả theo sao kê và điều khoản thẻ.

Key message: Credit card không phải tiền miễn phí. Đó là hạn mức tín dụng phải hoàn trả.

Visual: split-screen with animated balance reduction vs credit liability.

### Slide 4 — Transaction parties

**Headline:** Một lần quẹt thẻ có nhiều bên cùng tham gia

Five components:
1. Cardholder: Chủ thẻ, người khởi tạo giao dịch.
2. Merchant: Đơn vị bán hàng hoặc cung cấp dịch vụ.
3. Acquirer: Ngân hàng/tổ chức thanh toán phục vụ đơn vị chấp nhận thẻ.
4. Card Network: Mạng lưới thanh toán như Visa, Mastercard, JCB, Napas.
5. Issuer: Ngân hàng/tổ chức phát hành thẻ cho chủ thẻ.

Simplified flow:
- Chủ thẻ thanh toán tại Merchant.
- Merchant gửi dữ liệu giao dịch qua Acquirer.
- Giao dịch được định tuyến qua Card Network đến Issuer để xác thực/phê duyệt.
- Kết quả phản hồi về Merchant.
- Clearing và settlement diễn ra theo quy trình của các bên.

Important details:
- Một ngân hàng có thể đồng thời là Issuer và Acquirer.
- MCC thường được gắn trong hệ thống chấp nhận thanh toán theo hoạt động kinh doanh và quy tắc mạng lưới.
- Cashback của thẻ do đơn vị cung cấp chương trình quyền lợi quy định, thường là Issuer trong chương trình cashback của thẻ.

Visual: animated 5-node payment ecosystem, with request/response paths. Keep authorization distinct from clearing/settlement.

### Slide 5 — Card networks

**Headline:** Logo trên thẻ cho biết mạng lưới thanh toán, không nhất thiết là bên cho vay

Networks:
- Visa
- Mastercard
- JCB
- American Express
- UnionPay
- Napas

Roles:
- Thiết lập tiêu chuẩn và quy tắc mạng lưới.
- Hỗ trợ định tuyến và xử lý giao dịch giữa các thành viên.
- Xây dựng hệ sinh thái chấp nhận thanh toán và dịch vụ đi kèm.

Distinctions:
- Issuer là bên phát hành thẻ và quản lý quan hệ tín dụng với chủ thẻ trong mô hình phổ biến.
- Card Network không đồng nghĩa với ngân hàng cấp hạn mức.
- American Express có những mô hình tích hợp mạng lưới và phát hành/thanh toán riêng, không đánh đồng hoàn toàn với Visa/Mastercard.

Key message: Chọn thẻ cần nhìn cả ngân hàng phát hành, mạng lưới, quyền lợi và điều kiện thực tế.

Visual: network tiles around a central routing layer. Use brand names accurately; do not create fake logos.

### Slide 6 — Billing cycle

**Headline:** Ngày mua hàng quyết định bạn còn bao nhiêu thời gian để trả

Illustrative example:
- Ngày giao dịch: 05/03
- Ngày sao kê: 25/03
- Hạn thanh toán: 10/04
- Nếu thanh toán đầy đủ dư nợ sao kê đúng hạn và đáp ứng điều kiện miễn lãi: không phát sinh lãi cho giao dịch mua hàng đủ điều kiện theo điều khoản thẻ.

Definitions:
- Statement Date: Ngày chốt các giao dịch vào kỳ sao kê.
- Payment Due Date: Hạn cuối thanh toán số tiền phải trả.
- Interest-free period: Khoảng thời gian tối đa có thể được miễn lãi cho giao dịch mua hàng đủ điều kiện.

Caveats:
- 05/03 đến 10/04 là 36 ngày theo ví dụ này, không phải 45–55 ngày.
- Thời gian miễn lãi tối đa phụ thuộc lịch sao kê, hạn thanh toán và chính sách từng ngân hàng.
- Giao dịch càng gần ngày chốt sao kê thường có thời gian đến hạn thanh toán ngắn hơn giao dịch ngay sau ngày chốt.

Key message: Không chỉ nhớ ngày thanh toán. Hãy hiểu ngày chốt sao kê và điều kiện miễn lãi.

Visual: orbital timeline or dimensional timeline. Make the 36-day interval legible.

### Slide 7 — Benefits

**Headline:** Giá trị của thẻ không chỉ nằm ở cashback

Benefits:
1. Dòng tiền: Mua trước, thanh toán sau trong thời gian miễn lãi nếu đáp ứng điều kiện.
2. Rewards: Cashback, điểm thưởng hoặc dặm bay.
3. Ưu đãi đối tác: Giảm giá tại nhà hàng, mua sắm, du lịch.
4. Travel benefits: Phòng chờ sân bay, bảo hiểm du lịch theo điều kiện.
5. Installment: Trả góp 0% hoặc ưu đãi chuyển đổi trả góp tùy chương trình.
6. Credit profile: Lịch sử thanh toán tốt có thể đóng góp tích cực vào hồ sơ tín dụng.
7. Welcome gifts: Quà hoặc ưu đãi mở thẻ, thường mang tính thời điểm.

Caveats:
- Không phải thẻ nào cũng có đầy đủ quyền lợi.
- Quyền lợi phụ thuộc hạng thẻ, ngân hàng, đối tác, mức chi tiêu và điều khoản tại thời điểm sử dụng.
- Sử dụng thẻ không tự động làm tăng điểm CIC.

Key message: Đánh giá quyền lợi theo giá trị thực nhận và điều kiện đi kèm.

Visual: editorial benefit constellation, not a generic bank marketing grid.

### Slide 8 — Minimum payment trap

**Headline:** Trả tối thiểu không có nghĩa là đã trả đủ

Full statement payment:
- Có thể duy trì điều kiện miễn lãi cho giao dịch mua hàng đủ điều kiện.

Minimum payment:
- Phần dư nợ còn lại tiếp tục chịu lãi và có thể làm mất thời gian miễn lãi theo điều khoản ngân hàng.

Illustrative calculation:
- Dư nợ giả định: 10.000.000 VND
- Lãi suất giả định: 30%/năm
- Thời gian giả định: 36 ngày
- 10.000.000 × 30% × 36 / 365 ≈ 295.890 VND

Caveat:
- Đây chỉ là phép tính minh họa theo dư nợ cố định và cách tính đơn giản.
- Lãi thực tế phụ thuộc ngày hạch toán từng giao dịch, số dư thực tế, cách tính lãi và điều khoản từng ngân hàng.
- Thanh toán tối thiểu giúp tránh bị xem là không thanh toán theo yêu cầu tối thiểu, nhưng không phải chiến lược tối ưu chi phí.

Key message: Mục tiêu nên là thanh toán 100% dư nợ sao kê đúng hạn.

Visual: split path, Full payment vs Minimum payment. Show the estimated interest as an illustrative number, not a bank quote.

### Slide 9 — 10 cost categories

**Headline:** Đừng chỉ nhìn cashback. Hãy đọc biểu phí

Common/typical fee categories:
1. Phí thường niên.
2. Lãi suất thẻ tín dụng.
3. Phí thanh toán chậm.
4. Phí rút tiền mặt.
5. Phí giao dịch ngoại tệ.

Conditional/optional fee categories:
6. Phí đóng thẻ sớm hoặc phí chấm dứt trong thời gian cam kết (nếu có).
7. Phí chuyển đổi trả góp hoặc phí quản lý trả góp.
8. Phí bảo hiểm thẻ/khoản vay liên quan (nếu đăng ký hoặc áp dụng).
9. Phí SMS/thông báo dịch vụ (tùy ngân hàng và gói).
10. Phí vượt hạn mức (nếu sản phẩm và chính sách có áp dụng).

Checklist:
- Đọc biểu phí và điều khoản sản phẩm.
- Kiểm tra điều kiện miễn/hoàn phí thường niên.
- Kiểm tra lãi suất, phí trả góp và phí ngoại tệ.
- Hỏi rõ dịch vụ nào là tự nguyện.
- Không mặc định mọi ngân hàng đều thu cả 10 loại phí.

Key message: Phí phải được kiểm tra theo đúng sản phẩm và biểu phí.

Visual: ten interactive flip cards. Group into “phổ biến/thường gặp” and “tùy điều kiện/dịch vụ”. Flip on click/tap and keyboard activation.

### Slide 10 — CIC

**Headline:** Lịch sử trả nợ là một phần quan trọng của hồ sơ tín dụng

CIC:
- Trung tâm Thông tin tín dụng Quốc gia Việt Nam thu thập và cung cấp thông tin tín dụng theo phạm vi, quy định áp dụng.
- Tổ chức tín dụng có thể sử dụng dữ liệu tín dụng khi đánh giá hồ sơ vay hoặc cấp tín dụng.

Principles:
- Trả nợ đúng hạn giúp duy trì lịch sử thanh toán tốt.
- Quá hạn có thể ảnh hưởng đến phân loại nợ và đánh giá tín dụng.
- Mức độ ảnh hưởng phụ thuộc số ngày quá hạn, tình trạng khoản nợ, quy định phân loại và dữ liệu được cập nhật.

Do not oversimplify:
- Không khẳng định “dưới 10 ngày luôn an toàn”.
- Không khẳng định mọi trường hợp quá hạn 10 ngày đều tự động có cùng kết quả CIC.
- Việc phân loại nhóm nợ cần đối chiếu quy định hiện hành và tình trạng khoản vay cụ thể.

Actions:
- Theo dõi ngày đến hạn.
- Bật nhắc thanh toán hoặc trích nợ tự động.
- Kiểm tra báo cáo tín dụng định kỳ qua kênh chính thức.

Key message: Đừng để một khoản thanh toán nhỏ trở thành vấn đề trong lịch sử tín dụng.

Visual: credit history timeline. Do not show unverified day thresholds or fabricated group classifications.

### Slide 11 — Cashback types

**Headline:** Hoàn tiền thường được kích hoạt theo ba cách

1. Theo MCC/ngành hàng:
   - Ví dụ: siêu thị, ăn uống, xăng dầu, giáo dục.
   - Điều kiện dựa trên mã phân loại giao dịch và quy tắc ngân hàng.

2. Theo kênh giao dịch:
   - Ví dụ: giao dịch online, thanh toán qua ứng dụng hoặc website.
   - Không phải mọi giao dịch qua app đều được tính giống nhau; phải đọc định nghĩa “online” trong thể lệ.

3. Theo merchant/đối tác cụ thể:
   - Ví dụ: Shopee, Grab hoặc chuỗi bán lẻ cụ thể.
   - Có thể yêu cầu đúng merchant, kênh thanh toán, thời gian hoặc mã ưu đãi.

Key message: Cần hiểu điều kiện kích hoạt cashback, không chỉ nhìn phần trăm quảng cáo.

Visual: three distinct visual mechanisms: category tag, digital channel, merchant-specific token.

### Slide 12 — MCC

**Headline:** Cùng một số tiền, mã MCC khác nhau có thể tạo ra quyền lợi khác nhau

Definition:
- MCC (Merchant Category Code) là mã gồm 4 chữ số dùng để phân loại nhóm ngành nghề/hoạt động của đơn vị chấp nhận thẻ trong hệ thống thanh toán.

Impact:
- Ngân hàng có thể dùng MCC để xác định giao dịch có thuộc nhóm được cashback hay không.
- MCC thường được gắn trong quy trình chấp nhận thanh toán bởi Acquirer/payment processor theo hoạt động kinh doanh và quy tắc mạng lưới.
- Nếu MCC thực tế không thuộc nhóm được ưu đãi, giao dịch có thể không được hoàn tiền dù người dùng cảm nhận đó là ngành hàng được quảng cáo.

Examples:
- Cửa hàng bán thực phẩm có thể được phân loại theo nhóm siêu thị/cửa hàng tạp hóa tùy mô hình và cách đăng ký.
- Giao dịch trên nền tảng trung gian có thể được ghi nhận theo merchant hoặc đơn vị xử lý thanh toán, không nhất thiết theo sản phẩm cuối cùng.

Caveats:
- Không có danh sách MCC “chắc chắn được cashback” áp dụng cho mọi ngân hàng.
- Điều kiện cuối cùng phụ thuộc thể lệ Issuer và cách giao dịch được ghi nhận.

Key message: Cashback phụ thuộc dữ liệu giao dịch thực tế, không chỉ phụ thuộc thứ bạn mua.

Visual: transaction → MCC classification → eligible/not eligible. Do not invent exact MCC codes.

### Slide 13 — Cashback terms

**Headline:** “Hoàn tiền đến X%” không đồng nghĩa mọi giao dịch đều được hoàn X%

Three filters:
1. Minimum spend: Có yêu cầu chi tiêu tối thiểu theo giao dịch hoặc theo kỳ không?
2. Monthly cap: Số tiền hoàn tối đa mỗi tháng/kỳ là bao nhiêu?
3. Excluded MCC/transaction types: Nhóm giao dịch nào bị loại trừ?

Examples of exclusions to check:
- Nạp ví điện tử hoặc nạp tiền.
- Chuyển tiền và giao dịch tương đương tiền mặt.
- Thuế, phí, bảo hiểm, học phí.
- Rút tiền mặt.
- Giao dịch bị hủy, hoàn hoặc đảo ngược.

Illustrative example:
- Chi tiêu đủ điều kiện: 5.000.000 VND
- Tỷ lệ quảng cáo: 5%
- Cashback tối đa: 200.000 VND
- Cashback thực nhận: min(5.000.000 × 5%, 200.000) = 200.000 VND
- Tỷ lệ hoàn tiền hiệu dụng: 4%

Key message: Đánh giá cashback bằng số tiền thực nhận sau khi áp dụng tất cả điều kiện.

Visual: 3-stage filter funnel and a compact cashback calculator. Show the cap clipping the theoretical 250,000 VND down to 200,000 VND.

### Slide 14 — Spending analysis

**Headline:** Chọn thẻ từ dữ liệu chi tiêu, không chọn từ quảng cáo

Illustrative monthly spending:
- Siêu thị: 4.000.000 VND
- Ăn uống: 3.000.000 VND
- Online: 2.000.000 VND
- Di chuyển: 1.000.000 VND
- Khác: 2.000.000 VND
- Total: 12.000.000 VND/month

Method:
- Lấy dữ liệu sao kê 3–6 tháng gần nhất.
- Chuẩn hóa giao dịch theo nhóm chi tiêu.
- Phân biệt nhu cầu thiết yếu và chi tiêu có thể điều chỉnh.
- Xác định nhóm chi tiêu lớn, đều đặn và có khả năng được ưu đãi.

Key message: Thẻ phù hợp nhất tối ưu hóa hành vi chi tiêu vốn có, không khiến bạn chi tiêu nhiều hơn.

Visual: animated donut chart or treemap, with category labels and total.

### Slide 15 — Card combo optimization

**Headline:** Tối ưu giá trị ròng, không chạy theo tỷ lệ cashback cao nhất

Formula:
**Lợi ích ròng năm = Tổng cashback/benefit thực nhận − Tổng phí thẻ liên quan**

Illustrative annual comparison:
- Card A: Benefit 3.000.000 VND; fees 300.000 VND; net +2.700.000 VND.
- Card B: Benefit 2.000.000 VND; fees 200.000 VND; net +1.800.000 VND.
- Card C: Benefit 160.000 VND; fees 300.000 VND; net −140.000 VND.

Conclusion in this example:
- Card A + Card B: +4.500.000 VND/year.
- Card C: negative net value; review whether other benefits justify keeping it.

Selection rules:
- Map spending categories to cards with matching benefits.
- Avoid redundant benefits.
- Include annual fees, foreign transaction fees, fee waivers, and cashback caps.
- Calculate based on actual usage, not maximum advertised value.

Key message: A good combo maximizes net benefit and reduces management complexity.

Visual: A/B/C cards with net-value bars; combine A+B into a highlighted portfolio. Mark values as illustrative.

### Slide 16 — Eligibility

**Headline:** Được duyệt hay không phụ thuộc hồ sơ và chính sách từng ngân hàng

Nine possible factors or application routes:
1. Hợp đồng lao động và thời gian làm việc.
2. Chứng minh thu nhập: lương, sao kê hoặc nguồn thu hợp lệ khác theo yêu cầu.
3. Lịch sử quan hệ tín dụng và thanh toán.
4. Đăng ký chuyển đổi/đăng ký thẻ dựa trên quan hệ tín dụng hiện có tại ngân hàng khác, nếu ngân hàng có chương trình phù hợp.
5. Thẻ có tài sản bảo đảm bằng tiền gửi/tiết kiệm.
6. Số lượng thẻ và tổng nghĩa vụ tín dụng hiện tại.
7. Tỷ lệ nghĩa vụ nợ trên thu nhập (DTI) hoặc chỉ tiêu tương đương theo cách đánh giá của ngân hàng.
8. Nghề nghiệp/nhóm khách hàng thuộc chương trình liên kết hoặc chính sách riêng.
9. Khách hàng Priority/Private hoặc phân khúc ưu tiên, nếu có chính sách cấp thẻ tương ứng.

Caveats:
- Đây không phải checklist bắt buộc chung cho mọi ngân hàng.
- Không có một ngưỡng utilization hoặc DTI duy nhất bảo đảm được duyệt.
- Hồ sơ cần đáp ứng tiêu chí riêng của từng sản phẩm và ngân hàng.

Key message: Chuẩn bị hồ sơ đúng và chọn đúng sản phẩm quan trọng hơn việc nộp nhiều đơn cùng lúc.

Visual: four clusters: Income, Credit profile, Existing relationship, Product policy. Avoid fake approval score.

### Slide 17 — Credit limit and utilization

**Headline:** Hạn mức cao không đồng nghĩa nên sử dụng hết

Definitions:
- Credit limit: Hạn mức tín dụng được cấp.
- Outstanding balance: Dư nợ đang ghi nhận.
- Utilization: Tỷ lệ dư nợ so với hạn mức theo cách đo tại một thời điểm hoặc kỳ báo cáo.

Example:
- Hạn mức 100.000.000 VND; dư nợ 10.000.000 VND → 10%.
- Dư nợ 30.000.000 VND → 30%.
- Dư nợ 70.000.000 VND → 70%.

Management principles:
- Giữ dư nợ ở mức có thể thanh toán đầy đủ.
- Không dùng hạn mức như phần thu nhập bổ sung.
- Dưới 30% thường được dùng như mốc tham khảo trong quản trị utilization, không phải quy tắc CIC chính thức hay ngưỡng duyệt chung tại Việt Nam.
- Ngân hàng có thể xem xét tổng dư nợ, thu nhập, lịch sử trả nợ và nghĩa vụ tín dụng khác.

Key message: Hạn mức là năng lực vay được cấp, không phải ngân sách để tiêu dùng.

Visual: premium 3D ring/gauge at 10%, 30%, 70%. Label 30% as a reference heuristic.

### Slide 18 — Safe use and security

**Headline:** Tối ưu quyền lợi chỉ có ý nghĩa khi kiểm soát được rủi ro

Five financial rules:
1. Thanh toán 100% dư nợ sao kê đúng hạn khi có thể.
2. Bật trích nợ tự động hoặc nhắc thanh toán, đồng thời kiểm tra tài khoản nguồn.
3. Giữ utilization ở mức phù hợp với khả năng chi trả; dưới 30% có thể dùng làm mốc tham khảo, không phải quy tắc bắt buộc.
4. Tránh rút tiền mặt và tránh dịch vụ đảo nợ/đáo hạn không chính thức.
5. Chỉ chi tiêu bằng thẻ cho khoản tiền bạn đã có kế hoạch và khả năng thanh toán.

Seven security rules:
1. Không cung cấp OTP, PIN hoặc mật khẩu cho người gọi/nhắn tin.
2. Không đọc OTP cho bất kỳ ai tự xưng là nhân viên ngân hàng.
3. Chỉ nhập OTP trong luồng xác thực chính thức do chính bạn chủ động khởi tạo.
4. Không để lộ số thẻ, ngày hết hạn và CVC/CVV.
5. Bật thông báo giao dịch và kiểm tra biến động bất thường.
6. Khóa thẻ hoặc tắt tính năng thanh toán online/quốc tế khi không cần, nếu ngân hàng hỗ trợ.
7. Không bấm link lạ; chủ động gọi số hotline chính thức khi nghi ngờ bị lừa đảo.

Key message: Ngân hàng có thể có quy trình xác thực hợp lệ, nhưng bạn không được tiết lộ OTP cho người khác qua điện thoại, tin nhắn hoặc chat.

Visual: left side five financial principles; right side security shield and grouped security actions. Keep all seven security rules readable, perhaps reveal in two groups.

### Slide 19 — Closing

**Headline:** THẺ TÍN DỤNG LÀ CÔNG CỤ

Statement:
**Đòn bẩy hay gánh nặng — phụ thuộc vào cách bạn sử dụng.**

Three reminders:
- Hiểu cơ chế trước khi sử dụng.
- Tính lợi ích ròng sau phí và điều kiện.
- Thanh toán đúng hạn, bảo vệ thông tin thẻ.

Final rule:
**Chỉ quẹt thẻ cho khoản chi mà bạn đã có khả năng thanh toán.**

Q&A

Visual: return to the opening card motif, now calm and controlled. Strong typography. No commercial CTA.

## 9. Data visualization and accuracy requirements

- Use only the numerical examples provided in this prompt.
- Clearly label all examples as illustrative.
- Do not imply a cashback rate, interest rate, fee, or approval criterion is universal.
- Do not fabricate real bank names, card products, card benefits, MCC codes, or regulatory thresholds.
- Do not invent current CIC group thresholds.
- Do not claim credit card use automatically increases CIC score.
- Do not present 30% utilization as an official CIC rule.
- Do not claim every minimum payment scenario accrues interest in precisely the same way. Preserve the bank-terms caveat.
- Use VND formatting consistently: `12.000.000 VND`.
- Use decimal/percentage formatting consistently.
- Ensure the cashback example is mathematically correct:
  - 5,000,000 × 5% = 250,000 VND theoretical cashback.
  - Monthly cap = 200,000 VND.
  - Actual cashback = 200,000 VND.
  - Effective cashback rate = 4%.
- Ensure minimum-payment illustrative arithmetic is correct:
  - 10,000,000 × 30% × 36 / 365 ≈ 295,890 VND.
- Ensure annual net-value example is correct:
  - A = 3,000,000 − 300,000 = +2,700,000.
  - B = 2,000,000 − 200,000 = +1,800,000.
  - C = 160,000 − 300,000 = −140,000.
  - A + B = +4,500,000 VND/year.
- Ensure monthly spending totals 12,000,000 VND.

## 10. Timing and pacing

The talk lasts 30 minutes. Keep slide density and animation duration appropriate.

Suggested allocation:
- Slides 1–2: 1 minute
- Slides 3–7: 7 minutes
- Slides 8–10: 5 minutes
- Slides 11–13: 5 minutes
- Slides 14–16: 6 minutes
- Slides 17–18: 4 minutes
- Slide 19: 2 minutes

Do not force the presenter to wait for long animations. The total duration of any slide-entry animation should generally remain under 1.5 seconds before all essential content is visible.

## 11. Quality assurance checklist

Before considering the implementation complete, verify:

### Content
- [ ] Exactly 19 slides.
- [ ] Correct order and chapter divisions.
- [ ] No missing content or caveats.
- [ ] All calculations correct.
- [ ] All illustrative examples labelled.
- [ ] No fabricated bank-specific or regulatory claims.
- [ ] Vietnamese text and diacritics correct.

### Presentation behavior
- [ ] One slide at a time in Presentation Mode.
- [ ] Overview Mode shows all slides.
- [ ] Keyboard controls work.
- [ ] Reveal steps work and do not accidentally skip content.
- [ ] Interactive cards work with mouse, touch, and keyboard.
- [ ] Fullscreen works where supported.
- [ ] No unwanted page scrolling.

### Visual quality
- [ ] Strong visual variation across slides.
- [ ] Consistent typography and spacing.
- [ ] 16:9 aspect ratio preserved.
- [ ] No text overflow or clipping.
- [ ] Charts and labels remain readable.
- [ ] 3D is selective and supports meaning.
- [ ] No generic template-like repetition.

### Performance and accessibility
- [ ] 3D scenes lazy-loaded.
- [ ] Only active slide's 3D scene renders.
- [ ] WebGL fallback exists.
- [ ] Reduced-motion preference respected.
- [ ] Focus states and keyboard navigation usable.
- [ ] No console errors.
- [ ] No hydration mismatch.
- [ ] No missing assets or broken navigation.

## 12. Final instruction

Build the complete application. Prioritize visual quality, clarity, factual discipline, and presentation reliability.

Do not return only a plan, wireframe, static mockup, or code snippets. Implement the actual working slide presentation with all 19 slides and the interaction model described above.
