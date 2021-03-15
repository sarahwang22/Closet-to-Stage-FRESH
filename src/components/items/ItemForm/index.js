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
    imageAsUrl: {
      imgUrl: ''
    },
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
    const {item, userID, imageAsFile} = this.state
      event.preventDefault()
    console.log('start of upload')

    if(imageAsFile === ''){
      console.error('not an image file')
    }

    const uploadTask = this.props.firebase.doAddImage(imageAsFile.name, imageAsFile)
      
      uploadTask.on('state-changed',
        (snapshot) => {
          
          console.log(snapshot)
        }, (err) => {

          console.log(err)
        }, () => {

          this.props.firebase.images().child(imageAsFile.name).getDownloadURL()
            .then(fireBaseUrl => {
              
              this.setState({
                imageAsUrl: {
                  ...this.state.imageAsUrl,
                  imgUrl: fireBaseUrl,
                }
              })
            })
        }
      )
      
      this.props.firebase.doAddItem({...item, userID, isListed: true})
        .then(()=>{
          console.log("added item")
        })
    
     
    
    
  }

  onClear = event =>{
    this.setState({...INITIAL_STATE})
  }

  handleImageAsFile = (e) =>{
      const image = e.target.files[0]

      this.setState({
        ...this.state,
          imageAsFile: image,
      })
  }

  render(){
    const {item, error, imageAsUrl} = this.state;

    return(
      <div>
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
      {imageAsUrl?<img src={imageAsUrl.imgUrl} alt="image tag"/> : <h1></h1>}
      </div>
      
      )
  }
}
const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(Form) //need to study compose

//export default withFirebase(Form) //deosn't stay logged in