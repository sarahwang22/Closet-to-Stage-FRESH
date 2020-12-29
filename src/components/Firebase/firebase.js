import firebase from 'firebase/app'; //what's the diff btwn this and 'app'
import 'firebase/auth' //is this right? they used this.auth instead
import 'firebase/firestore'


//console.log(process.env.REACT_APP_API_KEY) //restart local program to see env changes


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };
  
  class Firebase {
      constructor(){
        firebase.initializeApp(firebaseConfig) //app.init

        this.auth = firebase.auth() //app.auth()
        this.db = firebase.firestore() //app.database
      }
      //*** Auth API ***
      doCreateUserWithEmailAndPassword = (email, password) =>
          this.auth.createUserWithEmailAndPassword(email, password)
      
      doSignInWithEmailAndPassword =(email, password) =>
          this.auth.signInWithEmailAndPassword(email, password)
      
      doSignOut = () =>
          this.auth.signOut();
      
      doPasswordReset = email =>
          this.auth.sendPasswordResetEmail(email)
      
      doPasswordUpdate = password =>
          this.auth.currentUser.updatePassword(password) //why cureentUser???
      
          //**User API */

        user = uid =>
            this.db.doc(`users/${uid}`)// ` denotes string literal ${} is how you put js in string literals
        //but wait, could you have said('users/'+uid)???
        users = () => 
            this.db.collection('users')

        currentUser = () =>
            this.auth.currentUser;

        userItems = (uid) => 
            this.db.collection('users').doc(uid).collection('items')
        //*Item API 

        item = uid =>
            this.db.doc(`items/${uid}`)
        
        items = () =>
            this.db.collection('items') //creates a Ref
        //use parenthsis, not curly quotes for returning
        
        doAddItem = (item, uid) => {
           this.db.collection('items').add ({item})

            //var itemKey = itemRef.key //ref can refer to a push(), but not push().set()
            //console.log("item key "+itemKey)

            this.db.collection('users/' + uid +'/items').add({ 
                item,
            })  
        }

        /*Account API */

        getUserItems = () => {
            return(
                <div></div>
            )
        }

        //*** Merge Auth and DB User Api */

        onAuthUserListener = (next, fallback) => { //can this be turned into a promise?
            this.auth.onAuthStateChanged(authUser => { //onAuthStateChanged accepts a user
                if(authUser) { //user is signed in
                    const promise = this.user(authUser.uid).get() //returns Promise<QuerySnapshot>
                    
                    promise.then(snapshot => { //could also get rid of 'promise' and go directly to '.then'
                        const dbUser = snapshot.data()
                        const roles = dbUser.roles

                        if(!roles){
                            dbUser.roles= {}
                        }

                        //do you really need to merge? test later
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser
                        }

                        //console.log(dbUser)
                        //console.log(authUser)

                    })
                    next(authUser)

                } else { //user is not authenticated/authorized
                    fallback();
                }
            })
        }

        //*Get Current User */

        currentUser = () =>(
            this.auth.currentUser
        )
           
        
        
            
  }

  export default Firebase