import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";




const Products = () => {

  const { enqueueSnackbar } = useSnackbar();
  const [isLoading,setIsloading]=useState(false);
  const [productData, setproductData] = useState([]);
  const [debounceTimeout,setDebounceTimeout]=useState(null);
  const token=localStorage.getItem("token");
  const [items, setItems] = useState([]);



  

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setIsloading(true);
    try {let urldata = await axios.get(`${config.endpoint}/products`);
    setIsloading(false);

    let data=urldata.data;
    setproductData(data);
    console.log(productData);

    } catch (e) {
      setIsloading(false);

      
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
                console.log(e.response.message);}
      else {
        enqueueSnackbar("Something went wrong!", { variant: "error" });

        console.log("Something went wrong!");
      }
    }
  };


 
  
  // console.log(productData);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {let response = await axios.get(`${config.endpoint}/products/search?value=${text}`);

    let resData=response.data;
    setproductData(resData);
    } catch (e) {
      
      if (e.response && e.response.status === 404) {
        setproductData([]);
                }
      if (e.response && e.response.status === 500) {
                  enqueueSnackbar(e.response.data.message, { variant: "error" });
                          console.log(e.response.message);}
     
    }
    
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value=event.target.value;

    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }
    const timeout= setTimeout(async ()=>{await performSearch(value)},500)
    setDebounceTimeout(timeout);
  };

  const fetchAPICart = async (token) => {
    if(!token){
      return
    }
    try {

      let response = await axios.get(`${config.endpoint}/cart`,{

      headers:{Authorization: `Bearer ${token}`}
    });
    console.log(response.data);
    return response.data;

    } catch(e) {
        enqueueSnackbar("Could not fetch cart details", { variant: "error" });

        console.log(e.response);
      }
    
  };

  const isProductincart = (items,productId)=>{ 
    return items.findIndex((item)=>item.productId===productId)!==-1};


    

const addToCart=async (token,items,productId,productData,qty, options={preventDuplicate:false})=>{
    //If logged out, then ask them to login 
    if(!token){
      enqueueSnackbar("Please log in to add to carts!",{variant:"warning"})
      return; 
    }
//If loggedin , then add products to the cart

    if(options.preventDuplicate && isProductincart(items,productId)){
      enqueueSnackbar("item already in cart",{variant:"warning"})
      return; 

    }

    try {
      const response = await axios.post(`${config.endpoint}/cart`, {productId,qty}, {
        headers:{Authorization: `Bearer ${token}`}
      }
      );


      const cartItems=generateCartItemsFrom(response.data,productData);
      setItems(cartItems);
    } catch (e) {
      
      if (e.response) {
                  enqueueSnackbar(e.response.data.message, { variant: "error" });}
      else {
        enqueueSnackbar("Could not fetch products, check backend!", { variant: "error" });

      }
    }


    console.log("Added to cart",productId);
  };


  useEffect(() => {
    performAPICall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAPICart(token).then((cartData)=>generateCartItemsFrom(cartData,productData)).then((cartitems)=>setItems(cartitems));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productData]);

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

        <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          className:"search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{debounceSearch(e,debounceTimeout)}}
      />

      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{debounceSearch(e,debounceTimeout)}}

      />
       <Grid container>
         <Grid item className="product-grid" md={token? 9 : 12}>
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>

           {isLoading?(<Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress/>
        <h4>Loading Products...</h4>
       </Box>):(
       <Grid container spacing={3} paddingX="1rem" marginY="1rem">
       {productData.length?(productData.map((prod)=>(
           <Grid item xs={6}  md={3} key={prod._id}>
               <ProductCard  product={prod} handleAddToCart={async (e)=>{await addToCart(token,items,prod._id,productData,1,{preventDuplicate:true})}} />
            </Grid>
        ))):(<Box className="loading">
          <SentimentDissatisfied color="action"/>
          <h4 style={{color:"grey"}}>No Products Found</h4></Box>)};
          

        
      </Grid>)
      }
         </Grid> 
         {token?<Grid bgcolor="#E9F5E1"  xs={12}  md={3}><Cart products={productData}
  items={items} handleQuantity={addToCart}/></Grid>:null}
       
       </Grid>
 



     
        
      <Footer />
    </div>
  );
};

export default Products;
