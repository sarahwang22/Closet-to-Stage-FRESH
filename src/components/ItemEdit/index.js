import React from 'react'

import ItemEditForm from '../ItemEditForm'

const Item = (props) =>{ 
    
    const item = props.item.item //should go back and fix so it's not item.item
    console.log(item)
    const color = item.color
    return(
        <div>
            <h3>{item.itemName}</h3>
            <div style={{backgroundColor:`${color}`}}>color : {color}</div>
            <p>{item.description}</p>
            <h5>${item.price}</h5>
            <button>Edit</button>
            <ItemEditForm item={item}/>
        </div>
    )
}

export default Item