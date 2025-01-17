import { useEffect, useState, useRef } from "react";
import { Auth, Tokens, Configuration } from "ordercloud-javascript-sdk";

interface Item {
  ID: string; // Product ID
  Name: string; // Product Name
  Price: number; // Product Price
  Image: any;
  [key: string]: any; // Allow other optional fields
}

const useSingleProduct = (slug: string) => {
  console.log(slug, 'slug inside the hook')
  const [token, setToken] = useState<string>("");
  const [product, setProduct] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const apiCalled = useRef<boolean>(false);

  const clientSecret = "aeiTWwmVaocTPcqkEpFiInyNGRdOYHAwomzOn8ID3G3C90fsl0aXVp5zfRqI";
  const clientId = "C37C1808-34A1-4E04-BE1D-D28CD50A1F31";

  // Authenticate and set the token
  const authenticateOrderCloud = async () => {
    try {
      Configuration.Set({
        baseApiUrl: "https://sandboxapi.ordercloud.io",
        timeoutInMilliseconds: 20000,
      });
      const authResponse = await Auth.ClientCredentials(clientSecret, clientId, ["FullAccess"]);

      Tokens.SetAccessToken(authResponse.access_token);
      setToken(authResponse.access_token);
    } catch (error: any) {
      setError("Error authenticating OrderCloud");
      console.error("Authentication error:", error.message || error);
    }
  };

  // Fetch product details
  const fetchProductDetails = async (authToken: string, slug: string) => {
    try {
      setLoading(true);
      setError(null);
      setProduct(null);

      const url = `https://sandboxapi.ordercloud.io/v1/products/${slug}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, 'data test inside hook')
      if (data) {
        setProduct({
          ID: data.ID,
          name: data.Name,
          price: data?.xp?.price,
          image: data?.xp?.image?.thumbnail,
          // Name: data.Name,
          // Price: data.Price,
          ...data, // Include other product fields if needed
        });
      } else {
        setError("No product found with the given slug");
      }
    } catch (error: any) {
      setError("Error fetching product data: " + error.message);
      console.error("Fetch product error:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize authentication on first render
  useEffect(() => {
    const initialize = async () => {
      if (!apiCalled.current) {
        apiCalled.current = true;
        await authenticateOrderCloud();
      }
    };

    initialize();
  }, []);

  // Fetch product data when token is set
  useEffect(() => {
    if (token && slug) {
      fetchProductDetails(token, slug);
    } else if (!slug) {
      setError("Slug is required to fetch product details");
    }
  }, [token, slug]);

  return {
    product,
    loading,
    error,
    // addItemToCart,
  };
};

export default useSingleProduct;