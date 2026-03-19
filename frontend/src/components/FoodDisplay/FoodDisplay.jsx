import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
// import {food}

const FoodDisplay = ({ category }) => {

  const { foodlist, backendUrl } = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {console.log(foodlist)
        }
        {foodlist
          .filter(item => category === "All" || item.category === category)
          .map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={`${backendUrl}/images/${item.image}`}
            />
          ))
        }

      </div>
    </div>

  )
}

export default FoodDisplay
