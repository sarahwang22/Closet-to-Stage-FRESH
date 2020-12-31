import React, {Component} from 'react'

import {withFirebase} from '../Firebase'

class ItemEditForm extends Component {
    constructor(props){
        super(props)

        this.state = {
            item: props.item,
            //initialItem: props.item,
        }

    }

    onChange = event =>{
        this.setState({
            item:{
              ...this.state.item,
              [event.target.name]:event.target.value
            } 
        }) 
        console.log(this.state)
    }

    onSubmit = event =>{
        this.props.firebase.doEditItem()
    }

    render(){
        console.log(this.state.item)
        const {item,} = this.state

        return(
            <form>
                 <input
                name="itemName"
                value={item.itemName}
                type="text"
                onChange={this.onChange}
                placeholder="itemName"
                />
                <br />
                <input
                name="description"
                value={item.description}
                type="text"
                onChange={this.onChange}
                placeholder="description"
                />
                <br />
                <input
                name="quantity" //make this have distinct numbers
                value={item.quantity}
                type="text"
                onChange={this.onChange}
                placeholder="quantity"
                />
                <br />
                <label htmlFor="color">color: </label>
                <input
                name="color"
                value={item.color}
                type="color"
                onChange={this.onChange}
                placeholder="color"
                />
                <br />
                <input
                name="size"
                value={item.size}
                type="text"
                onChange={this.onChange}
                placeholder="size, ex: M, 2"
                />
                <br />
                <label htmlFor="price">$</label>
                <input
                name="price"
                value={item.price}
                type="text"
                onChange={this.onChange}
                placeholder="00.00"
                />
                <br />
                <button onClick={this.onSumbit}>
                    Change
                </button>
                <button>
                    Cancel
                </button>
                
            </form>
        )
    }
}

export default withFirebase(ItemEditForm)// need withFirebase?
