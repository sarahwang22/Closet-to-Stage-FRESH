//don't use this page, everything's on ItemPage I think

import React, {Component} from 'react'
import {compose} from 'recompose'

import { withFirebase } from '../Firebase';
import {withAuthorization} from '../Session'
import {withAuthentication} from '../Session'


const INITIAL_STATE={
  item:{
    itemName:'',
    description:'',
    color:null,
    size:'',
    //sleeveLength:'',
    quantity:'',
    brand:'',
    price:'',
    error: null,
  },
  userID: null,
}

class Form extends Component {
  constructor(props){
    super(props)  
    
    let cuid = this.props.firebase.currentUser().uid
    //console.log(cuid)
    this.state={...INITIAL_STATE, userID: cuid}

    console.log(this.state)
  }

  componentDidMount () {
    console.log(this.props.firebase.currentUser().uid)
  }

  onChange = event =>{
    const {item} = this.state
    this.setState({
        item:{
          ...this.state.item,
          [event.target.name]:event.target.value
        } 
    }) 

    /* console.log({...item})// will spread out item properties, then put {} on the out side
    console.log(item)// keeps the item obj as it is
    console.log({item})//will put item into an object with 'item' as a property */
    
  }

  onSumbit = event =>{
    const {item, userID} = this.state
    
    this.props.firebase.doAddItem({...item, userID})

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
const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(Form) //need to study compose

//export default withFirebase(Form) //deosn't stay logged in