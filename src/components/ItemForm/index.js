//don't use this page, everything's on ItemPage I think

import React, {Component} from 'react'

import {withFirebase} from '../Firebase'
import withAuthentication from '../Session/withAuthentication'

const INITIAL_STATE={
  item:{
    itemName:'',
    description:'',
    color:'',
    size:'',
    //sleeveLength:'',
    quantity:'',
    brand:'',
    price:'',
    error: null,
  }
}

class Form extends Component {
  constructor(props){
    super(props)    
    this.state={...INITIAL_STATE}
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

  onSumbit = event =>{
    const {item} = this.state

    const cuid = this.props.firebase.currentUser().uid

    this.props.firebase.doAddItem(item, cuid)

    this.setState({...INITIAL_STATE})
  
    event.preventDefault()
  }

  onClear = event =>{
    this.setState({...INITIAL_STATE})
  }

  render(){
    const {item, error} = this.state;

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
          Add
        </button>
        <button onClick={this.onClear}>
          Clear
        </button>
        <p>{error && `${error}`}</p>
      </form>
      
      )
  }
}

export default withAuthentication(withFirebase(Form))