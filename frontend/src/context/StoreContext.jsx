import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { api } from "../api";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItem] = useState({});
    const [token,setToken] = useState("");
    const [foodlist,setFoodList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_API_URL;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItem((prev)=>({...prev, [itemId]:1}))
        }
        else {
            setCartItem((prev)=>({...prev, [itemId]: prev[itemId]+1}))
        }
        if (token) {
            await api.post("/api/cart/add",{itemId}, {headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItem((prev) => ({...prev, [itemId]: prev[itemId]-1}));
        if (token) {
            await api.post("/api/cart/remove",{itemId},{headers:{token}})
        }
    }


    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product)=> product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }


    const fetchFoodList = async () => {
        const response = await api.get("/api/food/list");
        setFoodList(response.data.data);
    }

    const loadCartData = async (token) => {
        const response = await api.post("/api/cart/get",{},{headers:{token}});
        setCartItem(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList()
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])

    // useEffect(() => {
    //     async function loadData() {
    //       await fetchFoodList();
    //       if (localStorage.getItem("token")) {
    //         const token = localStorage.getItem("token");
    //         setToken(token);
    //         await loadCartData(token);
    //       }
    //       setIsLoading(false);
    //     }
    //     loadData();
    //   }, []);

    const contextValue = {
        foodlist,
        cartItems,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        backendUrl
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;