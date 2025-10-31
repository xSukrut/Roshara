// app/about/shipping-returns/page.jsx
export const metadata = {
  title: "Shipping & Returns | Roshara",
  description: "Read Roshara’s shipping, returns, and exchange policy.",
};

export default function ShippingReturnsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 prose prose-gray">
      <h1>Shipping & Returns / Exchange Policy</h1>
      <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

      <h2>1. Shipping</h2>
      <ul>
        <li><strong>Processing:</strong> As we make our products with care, pay attention to every detail and everything is prepared to order, it takes 8-10 days to ship. <em>Sale periods may have slight delays.</em></li>
        <li><strong>Tracking:</strong> shared on dispatch via Email & WhatsApp.</li>
      </ul>

      <h2>2. Order Changes & Cancellations</h2>
      <ul>
        <li><strong>No cancellations/changes after placing an order.</strong> If unshipped, we’ll try to help but can’t guarantee.</li>
        <li>No modifications after shipment.</li>
        <li>We may cancel for stock/verification/technical reasons with refund or store credit (in the form of coupons).</li>
      </ul>

      <h2>3. Returns & Exchanges</h2>
      <ul>
        <li><strong>Window:</strong> Exchange within 3 days of delivery. Email <a href="mailto:roshara.official@gmail.com">roshara.official@gmail.com</a>.</li>
        <li><strong>Not eligible:</strong> Custom sizes, international orders.</li>
        <li><strong>Sale/COD orders:</strong> No bank refunds; exchange only (subject to availability).</li>
        <li><strong>One-time exchange only.</strong></li>
        <li>Items must be unused, unwashed, with original tags/packaging.</li>
      </ul>

      <h2>4. Refunds & Store Credit</h2>
      <ul>
        <li>Prepaid: refund to original method or store credit (where applicable).</li>
        <li>Sale/COD: exchange only; no bank refunds.</li>
        <li>COD fee (₹90) and shipping fees are non-refundable.</li>
      </ul>

      <h2>5. Reverse Shipping Charges</h2>
      <p><strong>No charge</strong> if wrong/defective item delivered by us. For size preference or dislike, a reverse pickup fee of <strong>₹100–₹150 per product</strong> applies.</p>

      <h2>6. How to Initiate a Return/Exchange</h2>
      <ol>
        <li>Or email us with order ID, reason and pictures (if applicable).</li>
        <li>After QC, we process exchange/store (as eligible) in 3–5 business days.</li>
      </ol>

      <h2>7. Important Reminders</h2>
      <ul>
        <li>No returns/exchanges for custom sizes.</li>
        <li>Sale periods can have slight dispatch delays.</li>
        <li>No changes/cancellations after shipment.</li>
        <li>International orders: no returns.</li>
      </ul>

      <p>For any help, write to <a href="mailto:roshara.official@gmail.com">roshara.official@gmail.com</a>. We’re happy to assist.</p>
    </main>
  );
}
