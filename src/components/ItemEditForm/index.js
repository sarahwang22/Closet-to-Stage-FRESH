import React, {Component} from 'react'
import { compose } from 'recompose'

import {withFirebase} from '../Firebase'
import {withAuthorization} from '../Session'


class ItemEditForm extends Component {
    constructor(props){
        super(props)

        this.state = {
            editItem: props.item,
            //initialItem: props.item,
        }

    }

    onChange = event =>{
        this.setState({
            editItem:{
              ...this.state.editItem, //merging all the old parts of item with the edited properties of editItem obj
              [event.target.name]:event.target.value //name and value come from the form inputs
            } 
        }) 
        console.log(this.state)
    }

    onSubmit = event =>{
        const {editItem} = this.state
        const itemID = editItem.id
        //editItem is an object {id: , color: , ...}

        this.props.firebase.doEditItem(editItem, itemID)
        event.preventDefault()
    }

    render(){
        //console.log(this.state.editItem.id)
        //console.log(this.props.firebase.getDb())
        const {editItem} = this.state

        return(
            <form>
                 <input
                name="itemName"
                value={editItem.itemName}
                type="text"
                onChange={this.onChange}
                placeholder="itemName"
                />
                <br />
                <input
                name="description"
                value={editItem.description}
                type="text"
                onChange={this.onChange}
                placeholder="description"
                />
                <br />
                <input
                name="quantity" //make this have distinct numbers
                value={editItem.quantity}
                type="text"
                onChange={this.onChange}
                placeholder="quantity"
                />
                <br />
                <label htmlFor="color">color: </label>
                <input
                name="color"
                value={editItem.color}
                type="color"
                onChange={this.onChange}
                placeholder="color"
                />
                <br />
                <input
                name="size"
                value={editItem.size}
                type="text"
                onChange={this.onChange}
                placeholder="size, ex: M, 2"
                />
                <br />
                <label htmlFor="price">$</label>
                <input
                name="price"
                value={editItem.price}
                type="text"
                onChange={this.onChange}
                placeholder="00.00"
                />
                <br />
                <button onClick={this.onSubmit}> {/*spent 30 min realizing i spelled submit wrong. -_- */}
                    Change
                </button>
                <button>
                    Cancel
                </button>
                
            </form>
        )
    }
}
const condition = authUser => !! authUser

/*export default compose(
  withFirebase,
  withAuthorization(condition), 
)(ItemEditForm) */

export default withFirebase(ItemEditForm)
