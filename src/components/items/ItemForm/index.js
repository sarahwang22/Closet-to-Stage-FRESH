//don't use this page, everything's on ItemPage I think

import React, {Component} from 'react'
import {compose} from 'recompose'

import { withFirebase } from '../../firebase';
import {withAuthorization} from '../../auth/Session'



const INITIAL_STATE={
  item:{
    itemName:'',
    type:'', //turn into a suggester input later
    description:'',
    color:'',
    size:'',
    //sleeveLength:'',
    quantity:'',
    brand:'',
    price:'',
    isListed: false, //or should it be false initially?
    error: null,
    imageAsFile:'',
    imageAsUrl:'',
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
    
    this.setState({
        item:{
          ...this.state.item,
          [event.target.name]:event.target.value
        } 
    }) 
    
  }

  onSumbit = event =>{
    const {item, userID} = this.state
    
    this.props.firebase.doAddItem({...item, userID, isListed: true})

    this.setState({...INITIAL_STATE})
    event.preventDefault()
  }

  onClear = event =>{
    this.setState({...INITIAL_STATE})
  }

  handleImageAsFile = (e) =>{
      const image = e.target.files[0]
      this.setState({
        
      })
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
          name="type"
          value={item.type}
          type="text"
          onChange={this.onChange}
          placeholder="type"
        />
        <br />
        <input
          name="brand"
          value={item.brand}
          type="text"
          onChange={this.onChange}
          placeholder="brand"
        />
        <input
          name="quantity" //make this have distinct numbers
          value={item.quantity}
          type="text"
          onChange={this.onChange}
          placeholder="quantity"
        />
        <br />
        <label htmlFor = "color">color: </label>
        <input
          name="color"
          value={item.color}
          type="color"
          onChange={this.onChange}
          placeholder="color"
        />
        <div className="color">
            <input type="checkbox" id="red"/>
            <input type="checkbox" id="orange"/>
            <input type="checkbox" id="yelllow"/>
            <input type="checkbox" id="green"/>
            <input type="checkbox" id="blue"/>
            <input type="checkbox" id="purple"/>
            <input type="checkbox" id="black"/>
            <input type="checkbox" id="tan"/>
            <input type="checkbox" id="white"/>
        </div>
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
        <br/>
        <input
          type="file"
          onChange ={this.handleImageAsFile}
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