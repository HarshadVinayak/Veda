"use client";

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async ({
  amount,
  email,
  userId,
  tier,
}: {
  amount: number;
  email: string;
  userId: string;
  tier: string;
}) => {
  const isLoaded = await loadRazorpay();

  if (!isLoaded) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'Veda App',
    description: `Upgrade to ${tier} Tier`,
    image: 'https://veda-app.vercel.app/logo.png',
    handler: async function (response: any) {
      // Step 14 Task 5: Verify payment on backend
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          userId,
          tier
        })
      });

      if (res.ok) {
        alert('Payment Successful! Your tier has been updated.');
        window.location.reload();
      } else {
        alert('Payment verification failed.');
      }
    },
    prefill: {
      email: email,
    },
    theme: {
      color: '#4F46E5', // Indigo-600
    },
  };

  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};
