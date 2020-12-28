import React, {Component} from 'react'

import {withFirebase} from '../Firebase'
import { AuthUserContext, withAuthorization } from '../Session'

import "./itempage.css"

const ItemPage =()=>{
    return(
        <div>
            <h3>Items Page</h3>
             <Items />
        </div>
    )
}
class ItemPageBase extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: false,
            items:[], //the list of items
            item:"", //the one in the input
            color:"",
            error: null,
        }
    }
    componentDidMount(){
        const itemsRef = this.props.firebase.items()
        const snapshot = itemsRef.get()
        
        console.log(snapshot)

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
        //this.props.firebase.users().unsub();
    }
    onChange = event =>{
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    onSubmit= event =>{
        const {item, color} = this.state

        var cuid = this.props.firebase.currentUser().uid

        this.props.firebase.doAddItem(item, color, cuid)

        this.setState({item:"",color:"",})//makes the inputs clear  

        event.preventDefault()//??? but the other way doens't work edit: () when {} return statemnt in firebase apis

    }
    render(){
        const {item, color, items, error} = this.state
        return(
            <div>
                {/*loading status, make sure to change componentdidmount too*/}
                <form onSubmit={this.onSubmit}>
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
                    <button type="submit">Add Item</button>
                </form>
                <p>{error && `${error}`}</p>
                {<ItemsList items = {items}/>}
            </div>
        )
    }
}

const ItemsList = ({items}) =>(
    <div className="itemslist"> {/*className vs class is React convention*/}
        <ul>
            {items.map(item=>( //map uses ()
                <Item item={item}/>
            ))}
        </ul>
       
    </div>
) 

const Item=({item})=>{
    return(
        <div className="item">
            <span > 
                {item.itemId} {/* just to show how to get the ID */}
                <strong>{item.itemName}, {item.color} </strong>
            </span>
            
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