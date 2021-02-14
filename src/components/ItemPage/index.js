import React, {Component} from 'react'
import {Link} from "react-router-dom"

import {withFirebase} from '../Firebase'
import SearchBar from '../SearchBar'
import Filter from '../Filter'

import "./itempage.css"

class ItemPageBase extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: false,
            itemsList:[], //the list of items
            error: null,
        }
    }

    handleSearchResultsChange = (itemsList) => { //pass this to Filter
        this.setState({itemsList})
        console.log(this.state)
    }

    componentDidMount(){ //work on uploading only a few items to each page
          this.props.firebase.items() // this. referes to element it's called upon
            .where('isListed','==',true)
            .get()
            .then(snapshot => { //TODO .get().then
                let itemsList = [];

                snapshot.forEach(doc => {
                    console.log(doc.id, '=>',doc.data())

                    itemsList.push({itemID:doc.id, ...doc.data()})
                    
                })

                this.setState({itemsList})
            })

    }

    componentWillUnmount() {
        //this.unsubscribe(); don't need, since .get() instead of .onSnapshot
    }

    render(){
        const {itemsList} = this.state

        return(
            <div>
                {/*loading status, make sure to change componentdidmount too*/}
                <SearchBar />
                <Filter handleSearchResultsChange = {this.handleSearchResultsChange}/> {/*changes state in ItemPage*/}
                <ItemsList items = {itemsList}/>
            </div>
        )
    }
}

const ItemsList = (props) =>(
    
    <div className="itemslist"> {/*className vs class is React convention*/}
        <ul>
            {props.items.map(item=>( //map uses ()
                <li key={item.itemID}>
                    <Item item={item}/>
                </li>
            ))}
        </ul>
    </div>
) 

const Item=(props)=>{
    //console.log(item.itemID)
    /* {itemName: , color: , itemID: ,} */
    return(
        <div className="item">
            <h2>itemName: {props.item.itemName}</h2>
            <p>type: {props.item.type}</p>
            <p>brand: {props.item.brand}</p>
            <h3 style={{backgroundColor:`${props.item.color}`}}>color: {props.item.color} </h3>
            <h5>itemID: {props.item.itemID}</h5> 
            <p>userID: {props.item.userID} [prof pic]</p>
            <Link to={{pathname: `/items/${props.item.itemID}`}}>view</Link>
        </div>
        
    )
}

const ItemPage = withFirebase(ItemPageBase)

export default ItemPage
