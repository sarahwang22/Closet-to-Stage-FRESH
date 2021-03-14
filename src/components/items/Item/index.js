import React from 'react'

import {withFirebase} from '../../firebase'
import MessageBox from '../MessageBox'

class Item extends React.Component {
    constructor(props){
        super(props)
        const id = this.props.match.params.itemID //takes itemID from the Route in App
        //https://stackoverflow.com/questions/48084981/how-can-i-get-a-variable-from-the-path-in-react-router

        this.state = {
            id, //sets {id: id}
         
        }
       
    }

    componentDidMount () {
        const {id} = this.state //gets id value from state

        const itemRef = this.props.firebase.item(id) //gets reference for item with an id of {id}

        itemRef.get()
            .then(doc=>{
                this.setState({...doc.data()}) //destructures the object returened by doc.data(), ids merge to one 
                console.log(this.state)
            })
    }

    render(){
        const {id, type, brand, color} = this.state

        return(
            <div>
                <h1>{id}</h1>
                <h2>{type}</h2>
                <h2>{color}</h2>
                <h2>{brand}</h2>
                <MessageBox id={id}/>

            </div>
        )
    } 
}


export default withFirebase(Item)