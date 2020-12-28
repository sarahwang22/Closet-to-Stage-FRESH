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

  onSumbit = event =>{
    const {item, color} = this.state

    const cuid = this.props.firebase.currentUser().uid

    this.props.firebase.doAddItem(item, color, cuid)

    this.setState({INITIAL_STATE})
  
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