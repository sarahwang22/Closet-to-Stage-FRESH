import React from 'react'

import ItemEditForm from '../ItemEditForm'

const ItemEdit = (props) =>{ 
    
    const item = props.item //fixed
    console.log(item)
    const color = item.color
    return(
        <div>
            <h3>{item.itemName}</h3>
            <div style={{backgroundColor:`${color}`}}>color : {color}</div>
            <p>description: {item.description}</p>
            <h5>id: {item.id}</h5>
            <h4>price ${item.price}</h4>
            <button>Edit</button>
            <ItemEditForm item={item}/> 
        </div>
    )
}

export default ItemEdit