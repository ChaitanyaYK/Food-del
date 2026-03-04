import React, { useEffect } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

    const { cartItems, foodlist, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);

    const { isLoading, ...rest } = useContext(StoreContext);

    if (isLoading) return <p>Loading cart...</p>;


    const navigate = useNavigate();
    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {/* {foodlist.map((item, index) => {
                    console.log("Cart items:", item); // Or whatever array you're mapping

                    if (cartItems[item._id] > 0) {
                        return (
                            <div className="cart-items-title cart-items-item">
                                <img src={url+"/images/"+item.image} alt="" />
                                <p>{item.name}</p>
                                <p>${item.price}</p>
                                <p>{cartItems[item._id]}</p>
                                <p>${item.price*cartItems[item._id]}</p>
                                <p onClick={()=>removeFromCart(item._id)} className='cross'>x</p>
                            </div>
                        )
                    }
                })} */}
                {foodlist && foodlist.length > 0 && foodlist.map((item) => {
                    if (!item || !item._id || !cartItems[item._id]) return null; // Skip undefined or malformed items

                    if (cartItems[item._id] > 0) {
                        return (
                            <div className="cart-items-title cart-items-item" key={item._id}>
                                <img src={url + "/images/" + item.image} alt={item.name} />
                                <p>{item.name}</p>
                                <p>${item.price}</p>
                                <p>{cartItems[item._id]}</p>
                                <p>${item.price * cartItems[item._id]}</p>
                                <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                            </div>
                        );
                    }

                    return null; // If cartItems[item._id] is 0 or falsy
                })}

            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivary Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>If you have a promo code, Enter it here</p>
                        <div className="cart-promocode-input">
                            <input type="text" placeholder='promo code' />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Cart
