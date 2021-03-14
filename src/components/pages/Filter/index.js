import React, {Component} from 'react'
import {compose} from 'recompose'
import { withRouter} from 'react-router-dom'
//must use withRouter in order to use this.props.history.push("/path")

import {withFirebase} from '../../firebase'
import "./filter.css"

class Filter extends Component{
    constructor(props){
        super(props)
        this.state={
            filters:{
                type:{}, //type: {dress: true, top: false, ...}
                brand:{},
            },
        }
    }


    onClick = (spec) => (event) => { //can't push an item to state (can't mutate), should use concat
        // spec is type, brand, etc.
        const id = event.target.id
        const name = event.target.name

        const checkbox = document.getElementById(id)

        if(checkbox.checked) { // {list:{dress: true}}
            this.setState( {
                filters:{
                    ...this.state.filters, //used ... before new addition instead of after and worked
                    [spec]:{
                        ...this.state.filters[spec],
                        [name]: true
                    },
                }
                }
            )
        }
        else{
            this.setState({ // {list:{dress: false}}
                filters:{
                    ...this.state.filters,
                    [spec]:{
                        ...this.state.filters[spec],
                        [event.target.name]: false
                    },     
                }  
            })
        }

        console.log('old state: ',this.state)
      
    }

    onSubmit = (event) => { //happens everytime you click submit
        /*
            brand(spec): (specObj){
                costco(key): true(value),
                capezio: false,
            }

            querySpec ==> ['costco']

         */
        let itemsList = [];
        let promises = [];

        Object.entries(this.state.filters).map(([spec, specObj]) =>{//for every spec and its specObj, loops through brands:{}, type:

            let querySpec =[];

            Object.entries(specObj).map(([key,value]) => {
                if(value) //if dress: true
                    querySpec.push(key)
    
                //querySpec is an array that holds all of the specs want to query for,
                //within a certain field, like brand or type
            })

            //queries with filter arrays
            //where('brand', 'in', [costco, capezio, ...])
            if(querySpec.length > 0){
                let promise = this.props.firebase.items().where(spec,'in', querySpec)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc=>{
                        if(doc.data().isListed){
                            const found = itemsList.some(il => il.itemID === doc.id)

                            if(!found){
                                itemsList.push({itemID: doc.id, ...doc.data()})
                            } 
                        } 
                    })
                }) 
                promises.push(promise)  
            }}
        )// after everythings been looped through and filtitemsids is unique

        console.log('onSubmit state: ',this.state)

        Promise.all(promises).then(() => {
            this.props.handleSearchResultsChange(itemsList)
        })

        event.preventDefault()
        
    }

    routeChange = () => { //just for testing
        //<Link to="/new/page"></Link>
        const {filters: {brand:{capezio}, type:{dress}}} = this.state //testing things out, this doesn't actually work

        this.props.history.push(`/items/${capezio}/${dress}`) //better than Redirect (which doesn't work here anyway)
    }

    doFirebase = () => {
        const {filtItemsIDs} = this.state

        this.props.firebase.where('id', 'in', filtItemsIDs).get().then(snapshot => {

        })
    }

    render(){
        return(
            <div className="filter">
                <form>
                    {/* <button onClick={this.routeChange}> New Path (router test)</button> */}
                    <h5>type</h5>
                    <div className="selector">
                        <label htmlFor="dress">dress</label>
                        <input className="type" type="checkbox" id="dress" name="dress" value="dress"  onClick={this.onClick("type")}/>
                    </div>
                    <div className="selector">
                        <label htmlFor="bottom">bottom</label>
                        <input className="type" type="checkbox" id="bottom" name="bottom" value="bottom" onClick={this.onClick("type")}/>
                    </div>
                    <div className="selector">
                        <label htmlFor="top">top</label>
                        <input className="type" type="checkbox" id="top" name="top" value="top" onClick={this.onClick("type")}/>
                    </div>
                     
                    <h5>brand</h5>
                    <div className="selector">
                        <label htmlFor="costco">costco</label>
                        <input type="checkbox" id="coscto" name="costco" value="costco" onClick={this.onClick("brand")}/>
                    </div>
                    <div className="selector">
                        <label htmlFor="capezio">capezio</label>
                        <input type="checkbox" id="capezio" name="capezio" value="capezio" onClick={this.onClick("brand")}/>
                    </div>

                    <button onClick={this.onSubmit}>Submit</button>
                </form>
            </div>
        )
    }
}


export default compose( //have to use compose to use both withRouter and withFirebase (something about props)
    withRouter,
    withFirebase
) (Filter)

