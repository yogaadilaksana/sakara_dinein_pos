export async function checkPaymentStatus(orderId) {
    try {
      const response = await fetch('/api/order/checkPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
    //   src/app/api/order/checkPayment/route.js
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to check payment status:', error);
      throw error;
    }
  }