/**
 * Authoritative slide content — "Thẻ tín dụng: Hiểu luật chơi".
 *
 * Source of truth: docs/master-prompt.md §8 (slide-by-slide content) and §9
 * (accuracy requirements). Every number, caveat and "illustrative" label here
 * is deliberate:
 *   - Do not add financial, legal, regulatory or bank-specific facts.
 *   - Do not drop caveats. Visible copy may be shortened for layout, but the
 *     full text must stay available (the mobile reader renders all of it).
 *   - All example numbers are illustrative and must be labelled as such.
 *
 * Slide components should import strings from here rather than re-typing them.
 */

/* ────────────────────────────────────────────────────────────────────────── */
/* Chapters                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

export type ChapterId = "intro" | "understand" | "costs" | "cashback" | "combo" | "safety" | "closing";

export type Chapter = {
  id: ChapterId;
  /** 1–5 for the five content chapters, null for opening/closing. */
  number: number | null;
  title: string;
};

export const chapters: Record<ChapterId, Chapter> = {
  intro: { id: "intro", number: null, title: "Mở đầu" },
  understand: { id: "understand", number: 1, title: "Hiểu về thẻ" },
  costs: { id: "costs", number: 2, title: "Chi phí và rủi ro" },
  cashback: { id: "cashback", number: 3, title: "Cashback và MCC" },
  combo: { id: "combo", number: 4, title: "Tối ưu combo thẻ" },
  safety: { id: "safety", number: 5, title: "Sử dụng an toàn" },
  closing: { id: "closing", number: null, title: "Kết" },
};

/** Label used on illustrative examples across the deck. */
export const ILLUSTRATIVE_LABEL = "Ví dụ minh họa";

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 1 — Opening                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

export const opening = {
  headline: "THẺ TÍN DỤNG",
  subheadline: "Hiểu luật chơi. Tối ưu lợi ích. Kiểm soát rủi ro.",
  tags: ["Hoàn tiền (Cashback)", "MCC và phân loại giao dịch", "Tối ưu combo thẻ", "Chi phí, CIC và an toàn"],
  keyMessage: "Biết cách vận hành trước khi tìm cách tận dụng lợi ích.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 2 — Roadmap                                                           */
/* ────────────────────────────────────────────────────────────────────────── */

export const roadmap = {
  headline: "Từ hiểu thẻ đến sử dụng thẻ có chiến lược",
  chapters: [
    { number: 1, chapter: "understand", title: "Hiểu về thẻ", slides: "03–07" },
    { number: 2, chapter: "costs", title: "Chi phí và rủi ro", slides: "08–10" },
    { number: 3, chapter: "cashback", title: "Cashback và MCC", slides: "11–13" },
    { number: 4, chapter: "combo", title: "Tối ưu combo thẻ", slides: "14–16" },
    { number: 5, chapter: "safety", title: "Sử dụng an toàn", slides: "17–18" },
  ],
  keyMessage: "Hiểu cơ chế → hiểu chi phí → tối ưu lợi ích.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 3 — Debit vs Credit                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export const debitCredit = {
  headline: "Cùng là thẻ thanh toán, nhưng nguồn tiền khác nhau",
  debit: {
    label: "Debit",
    alias: "Thẻ ghi nợ",
    points: [
      "Chi tiêu từ số dư tài khoản của chủ thẻ.",
      "Giao dịch thường làm giảm số dư khả dụng ngay.",
      "Không phải khoản vay tín dụng quay vòng theo cơ chế thẻ tín dụng.",
    ],
    example: "Tài khoản có 10 triệu, thanh toán 2 triệu, số dư giảm tương ứng.",
    /** Illustrative: 10.000.000 − 2.000.000 = 8.000.000 */
    balanceBefore: 10_000_000,
    payment: 2_000_000,
    balanceAfter: 8_000_000,
  },
  credit: {
    label: "Credit",
    alias: "Thẻ tín dụng",
    points: [
      "Chi tiêu trong hạn mức tín dụng được tổ chức phát hành cấp.",
      "Phát sinh nghĩa vụ thanh toán với tổ chức phát hành.",
      "Là hình thức cấp tín dụng, có kỳ sao kê và hạn thanh toán.",
    ],
    example: "Hạn mức 50 triệu, thanh toán 2 triệu, chủ thẻ cần hoàn trả theo sao kê và điều khoản thẻ.",
    limit: 50_000_000,
    payment: 2_000_000,
    /** The 2.000.000 becomes an amount owed to the issuer. */
    amountOwed: 2_000_000,
  },
  keyMessage: "Credit card không phải tiền miễn phí. Đó là hạn mức tín dụng phải hoàn trả.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 4 — Transaction parties                                               */
/* ────────────────────────────────────────────────────────────────────────── */

export const transactionParties = {
  headline: "Một lần quẹt thẻ có nhiều bên cùng tham gia",
  actors: [
    { id: "cardholder", name: "Cardholder", description: "Chủ thẻ, người khởi tạo giao dịch." },
    { id: "merchant", name: "Merchant", description: "Đơn vị bán hàng hoặc cung cấp dịch vụ." },
    { id: "acquirer", name: "Acquirer", description: "Ngân hàng/tổ chức thanh toán phục vụ đơn vị chấp nhận thẻ." },
    { id: "network", name: "Card Network", description: "Mạng lưới thanh toán như Visa, Mastercard, JCB, Napas." },
    { id: "issuer", name: "Issuer", description: "Ngân hàng/tổ chức phát hành thẻ cho chủ thẻ." },
  ],
  flowTitle: "Luồng giao dịch (đơn giản hóa)",
  flow: [
    "Chủ thẻ thanh toán tại Merchant.",
    "Merchant gửi dữ liệu giao dịch qua Acquirer.",
    "Giao dịch được định tuyến qua Card Network đến Issuer để xác thực/phê duyệt.",
    "Kết quả phản hồi về Merchant.",
    "Clearing và settlement diễn ra theo quy trình của các bên.",
  ],
  /** Authorization (request → response) is distinct from clearing/settlement. */
  phases: {
    authorization: "Xác thực/phê duyệt",
    response: "Phản hồi kết quả",
    clearing: "Clearing và settlement",
  },
  detailsTitle: "Chi tiết quan trọng",
  details: [
    "Một ngân hàng có thể đồng thời là Issuer và Acquirer.",
    "MCC thường được gắn trong hệ thống chấp nhận thanh toán theo hoạt động kinh doanh và quy tắc mạng lưới.",
    "Cashback của thẻ do đơn vị cung cấp chương trình quyền lợi quy định, thường là Issuer trong chương trình cashback của thẻ.",
  ],
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 5 — Card networks                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export const cardNetworks = {
  headline: "Logo trên thẻ cho biết mạng lưới thanh toán, không nhất thiết là bên cho vay",
  /** Brand names only — render as plain typography, never imitate logos. */
  networks: ["Visa", "Mastercard", "JCB", "American Express", "UnionPay", "Napas"],
  rolesTitle: "Vai trò của mạng lưới",
  roles: [
    "Thiết lập tiêu chuẩn và quy tắc mạng lưới.",
    "Hỗ trợ định tuyến và xử lý giao dịch giữa các thành viên.",
    "Xây dựng hệ sinh thái chấp nhận thanh toán và dịch vụ đi kèm.",
  ],
  distinctionsTitle: "Cần phân biệt",
  distinctions: [
    "Issuer là bên phát hành thẻ và quản lý quan hệ tín dụng với chủ thẻ trong mô hình phổ biến.",
    "Card Network không đồng nghĩa với ngân hàng cấp hạn mức.",
    "American Express có những mô hình tích hợp mạng lưới và phát hành/thanh toán riêng, không đánh đồng hoàn toàn với Visa/Mastercard.",
  ],
  keyMessage: "Chọn thẻ cần nhìn cả ngân hàng phát hành, mạng lưới, quyền lợi và điều kiện thực tế.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 6 — Billing cycle                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export const billingCycle = {
  headline: "Ngày mua hàng quyết định bạn còn bao nhiêu thời gian để trả",
  exampleLabel: ILLUSTRATIVE_LABEL,
  events: [
    { id: "purchase", date: "05/03", label: "Ngày giao dịch" },
    { id: "statement", date: "25/03", label: "Ngày sao kê" },
    { id: "due", date: "10/04", label: "Hạn thanh toán" },
  ],
  /** 05/03 → 25/03 = 20 days; 25/03 → 10/04 = 16 days; total 36 days. */
  segments: [
    { from: "purchase", to: "statement", days: 20 },
    { from: "statement", to: "due", days: 16 },
  ],
  totalDays: 36,
  outcome:
    "Nếu thanh toán đầy đủ dư nợ sao kê đúng hạn và đáp ứng điều kiện miễn lãi: không phát sinh lãi cho giao dịch mua hàng đủ điều kiện theo điều khoản thẻ.",
  definitions: [
    { term: "Statement Date", description: "Ngày chốt các giao dịch vào kỳ sao kê." },
    { term: "Payment Due Date", description: "Hạn cuối thanh toán số tiền phải trả." },
    {
      term: "Interest-free period",
      description: "Khoảng thời gian tối đa có thể được miễn lãi cho giao dịch mua hàng đủ điều kiện.",
    },
  ],
  caveats: [
    "05/03 đến 10/04 là 36 ngày theo ví dụ này, không phải 45–55 ngày.",
    "Thời gian miễn lãi tối đa phụ thuộc lịch sao kê, hạn thanh toán và chính sách từng ngân hàng.",
    "Giao dịch càng gần ngày chốt sao kê thường có thời gian đến hạn thanh toán ngắn hơn giao dịch ngay sau ngày chốt.",
  ],
  keyMessage: "Không chỉ nhớ ngày thanh toán. Hãy hiểu ngày chốt sao kê và điều kiện miễn lãi.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 7 — Benefits                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

export const benefits = {
  headline: "Giá trị của thẻ không chỉ nằm ở cashback",
  items: [
    { id: "cashflow", title: "Dòng tiền", description: "Mua trước, thanh toán sau trong thời gian miễn lãi nếu đáp ứng điều kiện." },
    { id: "rewards", title: "Rewards", description: "Cashback, điểm thưởng hoặc dặm bay." },
    { id: "partners", title: "Ưu đãi đối tác", description: "Giảm giá tại nhà hàng, mua sắm, du lịch." },
    { id: "travel", title: "Travel benefits", description: "Phòng chờ sân bay, bảo hiểm du lịch theo điều kiện." },
    { id: "installment", title: "Installment", description: "Trả góp 0% hoặc ưu đãi chuyển đổi trả góp tùy chương trình." },
    {
      id: "credit-profile",
      title: "Credit profile",
      description: "Lịch sử thanh toán tốt có thể đóng góp tích cực vào hồ sơ tín dụng.",
    },
    { id: "welcome", title: "Welcome gifts", description: "Quà hoặc ưu đãi mở thẻ, thường mang tính thời điểm." },
  ],
  caveats: [
    "Không phải thẻ nào cũng có đầy đủ quyền lợi.",
    "Quyền lợi phụ thuộc hạng thẻ, ngân hàng, đối tác, mức chi tiêu và điều khoản tại thời điểm sử dụng.",
    "Sử dụng thẻ không tự động làm tăng điểm CIC.",
  ],
  keyMessage: "Đánh giá quyền lợi theo giá trị thực nhận và điều kiện đi kèm.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 8 — Minimum payment trap                                              */
/* ────────────────────────────────────────────────────────────────────────── */

export const minimumPayment = {
  headline: "Trả tối thiểu không có nghĩa là đã trả đủ",
  full: {
    label: "Full statement payment",
    title: "Thanh toán toàn bộ dư nợ sao kê",
    description: "Có thể duy trì điều kiện miễn lãi cho giao dịch mua hàng đủ điều kiện.",
  },
  minimum: {
    label: "Minimum payment",
    title: "Thanh toán tối thiểu",
    description:
      "Phần dư nợ còn lại tiếp tục chịu lãi và có thể làm mất thời gian miễn lãi theo điều khoản ngân hàng.",
  },
  calculationTitle: "Phép tính minh họa",
  calculation: {
    balance: 10_000_000,
    annualRate: 0.3,
    days: 36,
    /** 10.000.000 × 30% × 36 / 365 = 295.890,41 → ≈ 295.890 VND */
    interest: 295_890,
    inputs: [
      { label: "Dư nợ giả định", value: "10.000.000 VND" },
      { label: "Lãi suất giả định", value: "30%/năm" },
      { label: "Thời gian giả định", value: "36 ngày" },
    ],
    formula: "10.000.000 × 30% × 36 / 365 ≈ 295.890 VND",
  },
  caveats: [
    "Đây chỉ là phép tính minh họa theo dư nợ cố định và cách tính đơn giản.",
    "Lãi thực tế phụ thuộc ngày hạch toán từng giao dịch, số dư thực tế, cách tính lãi và điều khoản từng ngân hàng.",
    "Thanh toán tối thiểu giúp tránh bị xem là không thanh toán theo yêu cầu tối thiểu, nhưng không phải chiến lược tối ưu chi phí.",
  ],
  keyMessage: "Mục tiêu nên là thanh toán 100% dư nợ sao kê đúng hạn.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 9 — 10 cost categories                                                */
/* ────────────────────────────────────────────────────────────────────────── */

export type FeeGroupId = "common" | "conditional";

export const fees = {
  headline: "Đừng chỉ nhìn cashback. Hãy đọc biểu phí",
  groups: [
    { id: "common" as FeeGroupId, title: "Phổ biến / thường gặp" },
    { id: "conditional" as FeeGroupId, title: "Tùy điều kiện / dịch vụ" },
  ],
  /**
   * `qualifier` keeps the spec's conditions verbatim. `check` is the card's
   * back face: a "what to check" prompt taken from the checklist below —
   * never a fee amount (amounts are product-specific and must not be invented).
   */
  items: [
    { n: 1, group: "common" as FeeGroupId, name: "Phí thường niên", qualifier: null, check: "Kiểm tra điều kiện miễn/hoàn phí thường niên." },
    { n: 2, group: "common" as FeeGroupId, name: "Lãi suất thẻ tín dụng", qualifier: null, check: "Kiểm tra lãi suất trong biểu phí và điều khoản sản phẩm." },
    { n: 3, group: "common" as FeeGroupId, name: "Phí thanh toán chậm", qualifier: null, check: "Đọc biểu phí và điều khoản sản phẩm; theo dõi hạn thanh toán." },
    { n: 4, group: "common" as FeeGroupId, name: "Phí rút tiền mặt", qualifier: null, check: "Đọc biểu phí và điều khoản sản phẩm trước khi rút tiền mặt bằng thẻ." },
    { n: 5, group: "common" as FeeGroupId, name: "Phí giao dịch ngoại tệ", qualifier: null, check: "Kiểm tra phí ngoại tệ trong biểu phí." },
    {
      n: 6,
      group: "conditional" as FeeGroupId,
      name: "Phí đóng thẻ sớm hoặc phí chấm dứt trong thời gian cam kết",
      qualifier: "nếu có",
      check: "Hỏi rõ điều kiện chấm dứt trong thời gian cam kết (nếu có).",
    },
    {
      n: 7,
      group: "conditional" as FeeGroupId,
      name: "Phí chuyển đổi trả góp hoặc phí quản lý trả góp",
      qualifier: null,
      check: "Kiểm tra phí trả góp trước khi chuyển đổi.",
    },
    {
      n: 8,
      group: "conditional" as FeeGroupId,
      name: "Phí bảo hiểm thẻ/khoản vay liên quan",
      qualifier: "nếu đăng ký hoặc áp dụng",
      check: "Hỏi rõ dịch vụ nào là tự nguyện.",
    },
    {
      n: 9,
      group: "conditional" as FeeGroupId,
      name: "Phí SMS/thông báo dịch vụ",
      qualifier: "tùy ngân hàng và gói",
      check: "Hỏi rõ dịch vụ nào là tự nguyện.",
    },
    {
      n: 10,
      group: "conditional" as FeeGroupId,
      name: "Phí vượt hạn mức",
      qualifier: "nếu sản phẩm và chính sách có áp dụng",
      check: "Kiểm tra sản phẩm và chính sách có áp dụng hay không.",
    },
  ],
  checklistTitle: "Checklist",
  checklist: [
    "Đọc biểu phí và điều khoản sản phẩm.",
    "Kiểm tra điều kiện miễn/hoàn phí thường niên.",
    "Kiểm tra lãi suất, phí trả góp và phí ngoại tệ.",
    "Hỏi rõ dịch vụ nào là tự nguyện.",
    "Không mặc định mọi ngân hàng đều thu cả 10 loại phí.",
  ],
  flipHint: "Chạm hoặc nhấn Enter để lật thẻ",
  keyMessage: "Phí phải được kiểm tra theo đúng sản phẩm và biểu phí.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 10 — CIC                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

export const cic = {
  headline: "Lịch sử trả nợ là một phần quan trọng của hồ sơ tín dụng",
  aboutTitle: "CIC",
  about: [
    "Trung tâm Thông tin tín dụng Quốc gia Việt Nam thu thập và cung cấp thông tin tín dụng theo phạm vi, quy định áp dụng.",
    "Tổ chức tín dụng có thể sử dụng dữ liệu tín dụng khi đánh giá hồ sơ vay hoặc cấp tín dụng.",
  ],
  principlesTitle: "Nguyên tắc",
  principles: [
    "Trả nợ đúng hạn giúp duy trì lịch sử thanh toán tốt.",
    "Quá hạn có thể ảnh hưởng đến phân loại nợ và đánh giá tín dụng.",
    "Mức độ ảnh hưởng phụ thuộc số ngày quá hạn, tình trạng khoản nợ, quy định phân loại và dữ liệu được cập nhật.",
  ],
  /** Shown as a "do not oversimplify" box. No day thresholds or debt groups may be visualised. */
  oversimplifyTitle: "Tránh đơn giản hóa",
  oversimplify: [
    "Không khẳng định “dưới 10 ngày luôn an toàn”.",
    "Không khẳng định mọi trường hợp quá hạn 10 ngày đều tự động có cùng kết quả CIC.",
    "Việc phân loại nhóm nợ cần đối chiếu quy định hiện hành và tình trạng khoản vay cụ thể.",
  ],
  actionsTitle: "Hành động",
  actions: [
    "Theo dõi ngày đến hạn.",
    "Bật nhắc thanh toán hoặc trích nợ tự động.",
    "Kiểm tra báo cáo tín dụng định kỳ qua kênh chính thức.",
  ],
  keyMessage: "Đừng để một khoản thanh toán nhỏ trở thành vấn đề trong lịch sử tín dụng.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 11 — Cashback types                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export const cashbackTypes = {
  headline: "Hoàn tiền thường được kích hoạt theo ba cách",
  types: [
    {
      id: "mcc",
      n: 1,
      title: "Theo MCC/ngành hàng",
      example: "Ví dụ: siêu thị, ăn uống, xăng dầu, giáo dục.",
      note: "Điều kiện dựa trên mã phân loại giao dịch và quy tắc ngân hàng.",
    },
    {
      id: "channel",
      n: 2,
      title: "Theo kênh giao dịch",
      example: "Ví dụ: giao dịch online, thanh toán qua ứng dụng hoặc website.",
      note: "Không phải mọi giao dịch qua app đều được tính giống nhau; phải đọc định nghĩa “online” trong thể lệ.",
    },
    {
      id: "merchant",
      n: 3,
      title: "Theo merchant/đối tác cụ thể",
      example: "Ví dụ: Shopee, Grab hoặc chuỗi bán lẻ cụ thể.",
      note: "Có thể yêu cầu đúng merchant, kênh thanh toán, thời gian hoặc mã ưu đãi.",
    },
  ],
  keyMessage: "Cần hiểu điều kiện kích hoạt cashback, không chỉ nhìn phần trăm quảng cáo.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 12 — MCC                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

export const mcc = {
  headline: "Cùng một số tiền, mã MCC khác nhau có thể tạo ra quyền lợi khác nhau",
  definitionTitle: "Định nghĩa",
  definition:
    "MCC (Merchant Category Code) là mã gồm 4 chữ số dùng để phân loại nhóm ngành nghề/hoạt động của đơn vị chấp nhận thẻ trong hệ thống thanh toán.",
  impactTitle: "Tác động",
  impact: [
    "Ngân hàng có thể dùng MCC để xác định giao dịch có thuộc nhóm được cashback hay không.",
    "MCC thường được gắn trong quy trình chấp nhận thanh toán bởi Acquirer/payment processor theo hoạt động kinh doanh và quy tắc mạng lưới.",
    "Nếu MCC thực tế không thuộc nhóm được ưu đãi, giao dịch có thể không được hoàn tiền dù người dùng cảm nhận đó là ngành hàng được quảng cáo.",
  ],
  examplesTitle: "Ví dụ",
  examples: [
    "Cửa hàng bán thực phẩm có thể được phân loại theo nhóm siêu thị/cửa hàng tạp hóa tùy mô hình và cách đăng ký.",
    "Giao dịch trên nền tảng trung gian có thể được ghi nhận theo merchant hoặc đơn vị xử lý thanh toán, không nhất thiết theo sản phẩm cuối cùng.",
  ],
  caveatsTitle: "Lưu ý",
  caveats: [
    "Không có danh sách MCC “chắc chắn được cashback” áp dụng cho mọi ngân hàng.",
    "Điều kiện cuối cùng phụ thuộc thể lệ Issuer và cách giao dịch được ghi nhận.",
  ],
  /** Diagram labels. Never show real MCC codes — use masked digits (e.g. "MCC ••••"). */
  diagram: {
    transaction: "Giao dịch",
    sameAmount: "Cùng một số tiền",
    classification: "Phân loại MCC",
    maskedCode: "MCC ••••",
    eligible: "Thuộc nhóm được cashback",
    notEligible: "Không thuộc nhóm được ưu đãi",
  },
  keyMessage: "Cashback phụ thuộc dữ liệu giao dịch thực tế, không chỉ phụ thuộc thứ bạn mua.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 13 — Cashback terms                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export const cashbackTerms = {
  headline: "“Hoàn tiền đến X%” không đồng nghĩa mọi giao dịch đều được hoàn X%",
  filtersTitle: "Ba bộ lọc",
  filters: [
    {
      n: 1,
      term: "Minimum spend",
      title: "Chi tiêu tối thiểu",
      question: "Có yêu cầu chi tiêu tối thiểu theo giao dịch hoặc theo kỳ không?",
    },
    { n: 2, term: "Monthly cap", title: "Mức hoàn tối đa", question: "Số tiền hoàn tối đa mỗi tháng/kỳ là bao nhiêu?" },
    {
      n: 3,
      term: "Excluded MCC/transaction types",
      title: "MCC/loại giao dịch bị loại trừ",
      question: "Nhóm giao dịch nào bị loại trừ?",
    },
  ],
  exclusionsTitle: "Ví dụ loại trừ cần kiểm tra",
  exclusions: [
    "Nạp ví điện tử hoặc nạp tiền.",
    "Chuyển tiền và giao dịch tương đương tiền mặt.",
    "Thuế, phí, bảo hiểm, học phí.",
    "Rút tiền mặt.",
    "Giao dịch bị hủy, hoàn hoặc đảo ngược.",
  ],
  exampleTitle: ILLUSTRATIVE_LABEL,
  example: {
    eligibleSpend: 5_000_000,
    advertisedRate: 0.05,
    cap: 200_000,
    /** 5.000.000 × 5% = 250.000 (theoretical) → clipped by the cap to 200.000 */
    theoretical: 250_000,
    actual: 200_000,
    /** 200.000 / 5.000.000 = 4% */
    effectiveRate: 0.04,
    rows: [
      { label: "Chi tiêu đủ điều kiện", value: "5.000.000 VND" },
      { label: "Tỷ lệ quảng cáo", value: "5%" },
      { label: "Cashback tối đa", value: "200.000 VND" },
    ],
    formula: "min(5.000.000 × 5%, 200.000) = 200.000 VND",
    actualLabel: "Cashback thực nhận",
    effectiveLabel: "Tỷ lệ hoàn tiền hiệu dụng",
    theoreticalLabel: "Cashback lý thuyết",
  },
  keyMessage: "Đánh giá cashback bằng số tiền thực nhận sau khi áp dụng tất cả điều kiện.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 14 — Spending analysis                                                */
/* ────────────────────────────────────────────────────────────────────────── */

export const spending = {
  headline: "Chọn thẻ từ dữ liệu chi tiêu, không chọn từ quảng cáo",
  chartTitle: "Chi tiêu minh họa mỗi tháng",
  categories: [
    { id: "grocery", label: "Siêu thị", amount: 4_000_000 },
    { id: "dining", label: "Ăn uống", amount: 3_000_000 },
    { id: "online", label: "Online", amount: 2_000_000 },
    { id: "transport", label: "Di chuyển", amount: 1_000_000 },
    { id: "other", label: "Khác", amount: 2_000_000 },
  ],
  /** 4 + 3 + 2 + 1 + 2 = 12 (million VND) */
  total: 12_000_000,
  totalLabel: "Tổng",
  totalSuffix: "/tháng",
  methodTitle: "Phương pháp",
  method: [
    "Lấy dữ liệu sao kê 3–6 tháng gần nhất.",
    "Chuẩn hóa giao dịch theo nhóm chi tiêu.",
    "Phân biệt nhu cầu thiết yếu và chi tiêu có thể điều chỉnh.",
    "Xác định nhóm chi tiêu lớn, đều đặn và có khả năng được ưu đãi.",
  ],
  keyMessage: "Thẻ phù hợp nhất tối ưu hóa hành vi chi tiêu vốn có, không khiến bạn chi tiêu nhiều hơn.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 15 — Card combo optimization                                          */
/* ────────────────────────────────────────────────────────────────────────── */

export const combo = {
  headline: "Tối ưu giá trị ròng, không chạy theo tỷ lệ cashback cao nhất",
  formula: {
    result: "Lợi ích ròng năm",
    benefit: "Tổng cashback/benefit thực nhận",
    fees: "Tổng phí thẻ liên quan",
    full: "Lợi ích ròng năm = Tổng cashback/benefit thực nhận − Tổng phí thẻ liên quan",
  },
  comparisonTitle: "So sánh minh họa theo năm",
  labels: { benefit: "Lợi ích", fees: "Phí", net: "Ròng" },
  cards: [
    { id: "A", name: "Thẻ A", benefit: 3_000_000, fees: 300_000, net: 2_700_000 },
    { id: "B", name: "Thẻ B", benefit: 2_000_000, fees: 200_000, net: 1_800_000 },
    { id: "C", name: "Thẻ C", benefit: 160_000, fees: 300_000, net: -140_000 },
  ],
  /** A + B = 2.700.000 + 1.800.000 = 4.500.000 */
  portfolio: { cards: ["A", "B"], name: "Thẻ A + Thẻ B", net: 4_500_000, suffix: "/năm" },
  conclusionTitle: "Kết luận trong ví dụ này",
  conclusions: [
    "Thẻ A + Thẻ B: +4.500.000 VND/năm.",
    "Thẻ C: giá trị ròng âm; cân nhắc liệu các quyền lợi khác có đủ lý do để tiếp tục giữ thẻ hay không.",
  ],
  rulesTitle: "Nguyên tắc chọn",
  rules: [
    "Gắn từng nhóm chi tiêu với thẻ có quyền lợi phù hợp.",
    "Tránh quyền lợi trùng lặp.",
    "Tính cả phí thường niên, phí giao dịch ngoại tệ, điều kiện miễn phí và mức trần cashback.",
    "Tính theo mức sử dụng thực tế, không theo giá trị tối đa được quảng cáo.",
  ],
  keyMessage: "Combo tốt tối đa hóa lợi ích ròng và giảm độ phức tạp khi quản lý.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 16 — Eligibility                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export type EligibilityClusterId = "income" | "credit" | "relationship" | "policy";

export const eligibility = {
  headline: "Được duyệt hay không phụ thuộc hồ sơ và chính sách từng ngân hàng",
  intro: "9 yếu tố hoặc hướng đăng ký có thể được xem xét",
  clusters: [
    { id: "income" as EligibilityClusterId, title: "Thu nhập", term: "Income" },
    { id: "credit" as EligibilityClusterId, title: "Hồ sơ tín dụng", term: "Credit profile" },
    { id: "relationship" as EligibilityClusterId, title: "Quan hệ hiện có", term: "Existing relationship" },
    { id: "policy" as EligibilityClusterId, title: "Chính sách sản phẩm", term: "Product policy" },
  ],
  factors: [
    { n: 1, cluster: "income" as EligibilityClusterId, text: "Hợp đồng lao động và thời gian làm việc." },
    { n: 2, cluster: "income" as EligibilityClusterId, text: "Chứng minh thu nhập: lương, sao kê hoặc nguồn thu hợp lệ khác theo yêu cầu." },
    { n: 3, cluster: "credit" as EligibilityClusterId, text: "Lịch sử quan hệ tín dụng và thanh toán." },
    {
      n: 4,
      cluster: "relationship" as EligibilityClusterId,
      text: "Đăng ký chuyển đổi/đăng ký thẻ dựa trên quan hệ tín dụng hiện có tại ngân hàng khác, nếu ngân hàng có chương trình phù hợp.",
    },
    { n: 5, cluster: "policy" as EligibilityClusterId, text: "Thẻ có tài sản bảo đảm bằng tiền gửi/tiết kiệm." },
    { n: 6, cluster: "credit" as EligibilityClusterId, text: "Số lượng thẻ và tổng nghĩa vụ tín dụng hiện tại." },
    {
      n: 7,
      cluster: "income" as EligibilityClusterId,
      text: "Tỷ lệ nghĩa vụ nợ trên thu nhập (DTI) hoặc chỉ tiêu tương đương theo cách đánh giá của ngân hàng.",
    },
    {
      n: 8,
      cluster: "policy" as EligibilityClusterId,
      text: "Nghề nghiệp/nhóm khách hàng thuộc chương trình liên kết hoặc chính sách riêng.",
    },
    {
      n: 9,
      cluster: "relationship" as EligibilityClusterId,
      text: "Khách hàng Priority/Private hoặc phân khúc ưu tiên, nếu có chính sách cấp thẻ tương ứng.",
    },
  ],
  caveats: [
    "Đây không phải checklist bắt buộc chung cho mọi ngân hàng.",
    "Không có một ngưỡng utilization hoặc DTI duy nhất bảo đảm được duyệt.",
    "Hồ sơ cần đáp ứng tiêu chí riêng của từng sản phẩm và ngân hàng.",
  ],
  keyMessage: "Chuẩn bị hồ sơ đúng và chọn đúng sản phẩm quan trọng hơn việc nộp nhiều đơn cùng lúc.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 17 — Credit limit & utilization                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export const utilization = {
  headline: "Hạn mức cao không đồng nghĩa nên sử dụng hết",
  definitions: [
    { term: "Credit limit", description: "Hạn mức tín dụng được cấp." },
    { term: "Outstanding balance", description: "Dư nợ đang ghi nhận." },
    {
      term: "Utilization",
      description: "Tỷ lệ dư nợ so với hạn mức theo cách đo tại một thời điểm hoặc kỳ báo cáo.",
    },
  ],
  exampleTitle: ILLUSTRATIVE_LABEL,
  limit: 100_000_000,
  levels: [
    { balance: 10_000_000, ratio: 0.1 },
    { balance: 30_000_000, ratio: 0.3 },
    { balance: 70_000_000, ratio: 0.7 },
  ],
  /** Must always accompany the 30% mark. */
  referenceNote: "Mốc tham khảo — không phải quy tắc CIC chính thức",
  principlesTitle: "Nguyên tắc quản lý",
  principles: [
    "Giữ dư nợ ở mức có thể thanh toán đầy đủ.",
    "Không dùng hạn mức như phần thu nhập bổ sung.",
    "Dưới 30% thường được dùng như mốc tham khảo trong quản trị utilization, không phải quy tắc CIC chính thức hay ngưỡng duyệt chung tại Việt Nam.",
    "Ngân hàng có thể xem xét tổng dư nợ, thu nhập, lịch sử trả nợ và nghĩa vụ tín dụng khác.",
  ],
  keyMessage: "Hạn mức là năng lực vay được cấp, không phải ngân sách để tiêu dùng.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 18 — Safe use & security                                             */
/* ────────────────────────────────────────────────────────────────────────── */

export const security = {
  headline: "Tối ưu quyền lợi chỉ có ý nghĩa khi kiểm soát được rủi ro",
  financialTitle: "5 nguyên tắc tài chính",
  financialRules: [
    "Thanh toán 100% dư nợ sao kê đúng hạn khi có thể.",
    "Bật trích nợ tự động hoặc nhắc thanh toán, đồng thời kiểm tra tài khoản nguồn.",
    "Giữ utilization ở mức phù hợp với khả năng chi trả; dưới 30% có thể dùng làm mốc tham khảo, không phải quy tắc bắt buộc.",
    "Tránh rút tiền mặt và tránh dịch vụ đảo nợ/đáo hạn không chính thức.",
    "Chỉ chi tiêu bằng thẻ cho khoản tiền bạn đã có kế hoạch và khả năng thanh toán.",
  ],
  securityTitle: "7 nguyên tắc bảo mật",
  /** Revealed in two groups: OTP/credentials (1–4), then monitoring & controls (5–7). */
  securityGroups: [
    { id: "credentials", title: "Bảo vệ OTP và thông tin thẻ", rules: [1, 2, 3, 4] },
    { id: "controls", title: "Theo dõi và kiểm soát", rules: [5, 6, 7] },
  ],
  securityRules: [
    "Không cung cấp OTP, PIN hoặc mật khẩu cho người gọi/nhắn tin.",
    "Không đọc OTP cho bất kỳ ai tự xưng là nhân viên ngân hàng.",
    "Chỉ nhập OTP trong luồng xác thực chính thức do chính bạn chủ động khởi tạo.",
    "Không để lộ số thẻ, ngày hết hạn và CVC/CVV.",
    "Bật thông báo giao dịch và kiểm tra biến động bất thường.",
    "Khóa thẻ hoặc tắt tính năng thanh toán online/quốc tế khi không cần, nếu ngân hàng hỗ trợ.",
    "Không bấm link lạ; chủ động gọi số hotline chính thức khi nghi ngờ bị lừa đảo.",
  ],
  keyMessage:
    "Ngân hàng có thể có quy trình xác thực hợp lệ, nhưng bạn không được tiết lộ OTP cho người khác qua điện thoại, tin nhắn hoặc chat.",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide 19 — Closing                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

export const closing = {
  headline: "THẺ TÍN DỤNG LÀ CÔNG CỤ",
  statement: "Đòn bẩy hay gánh nặng — phụ thuộc vào cách bạn sử dụng.",
  reminders: [
    "Hiểu cơ chế trước khi sử dụng.",
    "Tính lợi ích ròng sau phí và điều kiện.",
    "Thanh toán đúng hạn, bảo vệ thông tin thẻ.",
  ],
  finalRule: "Chỉ quẹt thẻ cho khoản chi mà bạn đã có khả năng thanh toán.",
  qa: "Q&A",
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/* Slide index — order, chapter and short title for navigation/overview       */
/* ────────────────────────────────────────────────────────────────────────── */

export type SlideIndexEntry = { number: number; id: string; chapter: ChapterId; title: string };

export const slideIndex: readonly SlideIndexEntry[] = [
  { number: 1, id: "opening", chapter: "intro", title: "Thẻ tín dụng" },
  { number: 2, id: "roadmap", chapter: "intro", title: "Lộ trình" },
  { number: 3, id: "debit-credit", chapter: "understand", title: "Debit và Credit" },
  { number: 4, id: "transaction-parties", chapter: "understand", title: "Các bên trong giao dịch" },
  { number: 5, id: "card-networks", chapter: "understand", title: "Mạng lưới thanh toán" },
  { number: 6, id: "billing-cycle", chapter: "understand", title: "Chu kỳ sao kê" },
  { number: 7, id: "benefits", chapter: "understand", title: "Quyền lợi của thẻ" },
  { number: 8, id: "minimum-payment", chapter: "costs", title: "Bẫy thanh toán tối thiểu" },
  { number: 9, id: "fees", chapter: "costs", title: "10 loại chi phí" },
  { number: 10, id: "cic", chapter: "costs", title: "CIC và lịch sử tín dụng" },
  { number: 11, id: "cashback-types", chapter: "cashback", title: "Ba cách kích hoạt cashback" },
  { number: 12, id: "mcc", chapter: "cashback", title: "MCC" },
  { number: 13, id: "cashback-terms", chapter: "cashback", title: "Điều kiện cashback" },
  { number: 14, id: "spending", chapter: "combo", title: "Phân tích chi tiêu" },
  { number: 15, id: "combo", chapter: "combo", title: "Tối ưu combo thẻ" },
  { number: 16, id: "eligibility", chapter: "combo", title: "Điều kiện được duyệt" },
  { number: 17, id: "utilization", chapter: "safety", title: "Hạn mức và utilization" },
  { number: 18, id: "security", chapter: "safety", title: "Sử dụng an toàn" },
  { number: 19, id: "closing", chapter: "closing", title: "Kết" },
];
