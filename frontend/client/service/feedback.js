"use server";

export const addFeedback = async (payload) => {
  try {
    const response = await fetch(
      `https://se100-techstore.onrender.com/feedback/${payload.product_id}`,
      {
        method: "POST",
        body: JSON.stringify({
          customer_id: payload.customer_id,
          feedback: payload.feedback,
          rating: payload.rating,
        }),
      }
    ); 
  } catch (error) {
    console.log(error)
  }
};
