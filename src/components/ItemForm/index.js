//don't use this page, everything's on ItemPage I think

import React, {Component} from 'react'

import {withFirebase} from '../Firebase'
import withAuthentication from '../Session/withAuthentication'

const INITIAL_STATE={
  item:'',
  color:'',
  error: null,
}

class Form extends Component {
  constructor(props){
    super(props)    
    this.state={...INITIAL_STATE}
  }

  onChange = event =>{
    this.setState({
        [event.target.name]:event.target.value
    }) 
  }

  // writeItemData(itemId, item, color){
  //   this.props.firebase.database().ref('items/'+itemId).set({
  //     item: item,
  //     color: color,
  //   })
  // }
  onSumbit = event =>{
    const {item, color} = this.state

    //const authUser = this.props.authUser


    this.props.firebase.doAddItem(item, color)
      // .catch(error=>{
      //   this.setState({error})
      // })
      // .then(()=>{
      //   this.setState({...INITIAL_STATE})
      // })
      // .catch(error=>{
      //   this.setState({error});
      // }) do you need any catches?
      
  
    event.preventDefault()
  }

  render(){
    const {item, color, error} = this.state;

    return(
      <form>
        <input
          name="item"
          value={item}
          type="text"
          onChange={this.onChange}
          placeholder="item"
        />
        <input
          name="color"
          value={color}
          type="text"
          onChange={this.onChange}
          placeholder="color"
        />
        <button onClick={this.onSumbit}>
          Add
        </button>
        {error && `${error}`}
      </form>
      )
  }
}

export default withAuthentication(withFirebase(Form))