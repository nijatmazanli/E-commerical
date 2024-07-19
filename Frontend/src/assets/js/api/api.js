export const getData = async () => {
  try {
    const res = await axios("http://localhost:6688/products/all-products");
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // You can also throw a custom error or return an error object
    throw new Error("Failed to retrieve data."); // Example custom error
  }
};
