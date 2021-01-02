import React, {Component} from 'react'

import {withFirebase} from '../Firebase'
import SearchBar from '../SearchBar'
import Filter from '../Filter'

//import { AuthUserContext, withAuthorization } from '../Session'

import "./itempage.css"

const ItemPage =()=>{
    return(
        <div>
            <h3>Items Page</h3>
            <SearchBar />
            <Filter />
            <Items />
        </div>
    )
}
class ItemPageBase extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: false,
            itemsList:[], //the list of items
            error: null,
        }
    }
    componentDidMount(){ //work on uploading only a few items to each page
          this.unsubscribe = this.props.firebase.items() // this. referes to element it's called upon
            .where('isListed','==',true)
            .onSnapshot(snapshot => {
                let itemsList = [];

                snapshot.forEach(doc => {
                    console.log(doc.id, '=>',doc.data())
                    itemsList.push({itemID:doc.id, ...doc.data()})
                    console.log(itemsList)
                })

                this.setState({
                    itemsList,
                })
            })

        // this.props.firebase.items().on("value", snapshot=> { //stick to either arrow functions or function() ortherwise run-time will be messed up
        //     const itemsObject = snapshot.val();

        //     if(itemsObject){ //!!!DONT FORGET to always check NULL
        //         const itemsList = Object.keys(itemsObject).map(key => ({
        //             ...itemsObject[key], //what does the spread operator do?
        //             itemId: key,
        //         }))
        //         this.setState({
        //             items: itemsList,
        //         })
        //     } 
        //     else {
        //         this.setState({items: null}) //??? need
        //     } 
        // })
    }

    componentWillUnmount() {
        this.unsubscribe();
        //this.props.firebase.users().unsub();
    }

    render(){
        const {itemsList} = this.state
        return(
            <div>
                {/*loading status, make sure to change componentdidmount too*/}
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
        </div>
    )
}

const Items = withFirebase(ItemPageBase)

export default ItemPage

// import React, {Component} from 'react'
// //import {compose} from 'recompose'

// //import {withAuthorization} from '../Session'
// //err maybe din't need???
// import {withFirebase} from '../Firebase'



// const ItemPage = ()=>{
//     <div>
//         <h1>Item Page</h1>
        
//         <Items />
//     </div>
// }

// class ItemsBase extends Component { //we use a class bc the lifecycle methods will self update :)
//     constructor(props){
//         super(props)

//         this.state= {
//             item:'',
//             color:'',
//             loading: false,
//             items: [],
//         }
//     }

//     componentDidMount() {
//         this.setState({loading: true})

//         this.props.firebase.items().on('value', snapshot => { //don't understand .items() ??? //doesn't it need a database?
            
//             const itemObject = snapshot.val()

//             if (itemObject) {
//                 //convert items list from snapshot
//                 const itemList = Object.keys(itemObject).map(key=>({
//                     ...itemObject[key],
//                     uid: key,
//                 }))

//                 this.setState({
//                     loading:false,
//                     items: itemList,
//                 })
//             }
//             else {
//                 this.setState({items: null, loading: false})
//             }
//         })
//     }

//     componentWillUnmount() {
//         this.props.firebase.items().off();
//     }

//     onChange = event => {
//         this.setState({[event.target.name]:event.target.value})
//     }

//     onCreateItem = event =>{
//         this.props.firebase.items().push({
//             item: this.state.item,
//             color: this.state.color,
//         })

//         this.setState({item:'',color:''})

//         event.preventDefault()
//     }

//     render() {
//         const {item, color, items, loading} = this.state;

//         return(
//             <div>
//                 {loading && <p>Loading...</p>}
                
//                 {items? 
//                     <ItemsList items = {items} />
//                 : 
//                     <div>There are no items</div>
//                 } 
//                 <form onSubmit={this.onCreateItem}>
//                     <input
//                     type="text"
//                     onChange={this.onChange}
//                     value={item}
//                     placeholder="item"
//                     />
//                     <input
//                     type="text"
//                     onChange={this.onChange}
//                     value={color}
//                     placeholder="color"
//                     />
//                     <button type="submit">Add Item</button>
//                 </form>
//             </div>
//         )
//     }
// }

// const ItemsList = ({items}) => (
//         <ul>
//             {items.map(item=> {
//                 <Item key = {item.uid} item ={item} />
//             })}
//         </ul>
// )
  

// const Item = ({item}) =>(
//     <li>
//         <strong>{item.userId}</strong> {item.text} {/*where do these .userID .text come from?*/}
//     </li>
// )

// const Items = withFirebase(ItemsBase)

// export default ItemPage //needs authoriztaion i think!!!