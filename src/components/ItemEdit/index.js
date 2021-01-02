import React from 'react'

import ItemEditForm from '../ItemEditForm'

const ItemEdit = (props) =>{ 
    const item = props.item //fixed item.item

    const {itemName, brand, color, description, id, price, isListed} = item
   
    return(
        <div>
            {isListed? <h1>for sale</h1> : <h1>not for sale</h1>}
            <h3>{itemName}</h3>
            <div style={{backgroundColor:`${color}`}}>color : {color}</div>
            <h3>brand: {brand}</h3>
            <p>description: {description}</p>
            <h5>id: {id}</h5>
            <h4>price ${price}</h4>
            <button>Edit</button>
            <ItemEditForm item={item}/> 
        </div>
    )
}

export default ItemEdit