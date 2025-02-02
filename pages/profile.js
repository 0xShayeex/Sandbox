import React, { useState } from "react";
import ConnectWallet from "../components/accessories/connectwallet";
import Footer from '../components/accessories/footer'
import Navbars from '../components/accessories/navbar'
import styles from '../styles/Home.module.css'
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import JobsPosted from "../components/profile/jobsposted";


const handleSubmit = async (event) => {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault()


  // Get data from the form.
  const data = {
    email: event.target.email.value,
    username: event.target.username.value,
    wallet: event.target.wallet.value,
    discord: event.target.discord.value,
    twitter: event.target.twitter.value,

  }

  // Send the data to the server in JSON format.
  const JSONdata = JSON.stringify(data)

  // API endpoint where we send form data.
  const endpoint = '/api/profile'

  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: 'POST',
    // Tell the server we're sending JSON.
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata,
  }

  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options)

  // Get the response data from server as JSON.
  // If server returns the name submitted, that means the form works.
  const result = await response.json()
  console.log(result)
  console.log(data)
}


const fetcher = (...args) => fetch(...args).then((res) => res.json())


const Profile = () => {
  const { data: session } = useSession()
  const { connect, publicKey } = useWallet()

  const { data, error } = useSWR('/api/profileapplications', fetcher)
  const appsSent = []
  const appsReceived = []
  

    const filterAppsSent = () =>  {
      
        for(let i=0; i < data.data.length; ++i){
          console.log(data.data[i])
          if(session){
            if(data.data[i].email == session.user.email){
              appsSent.push(data.data[i])
            }
          }
              
             }
             console.log(appsSent)
    }
  

  const filterAppsReceived = () => {

    for(let i=0; i < data.data.length; ++i){
    console.log(data.data[i])
    if(session){
      if(data.data[i].ownerEmail == session.user.email){
        appsReceived.push(data.data[i])
      }
    }
        
        }
        console.log(appsReceived)
  
  }

  const userData = ""

    const userDataCollect = () => {

      for(let i=0; i < data.data.length; ++i){
          if(data.data[i].email == session.user.email){
             userData = (data.data[i])
          }
      
      }
    }
  

if (error) return <div>Failed to load</div>
if (!session || !data) return <div>Magic is loading...</div>
console.log(data)

  return (
    <div className={styles.container}>
      {userDataCollect()}
      {filterAppsSent()}
      {filterAppsReceived()}
      

      <Navbars />
      <br></br>

      <h3>Welcome {session ? session.user.email : ""}!</h3>
          


          <hr></hr>

<div className="appsSent">
<h3>Applications Sent!</h3>
<Row xs={1} md={4} className="g-4">
      {Array.from({ length: appsSent.length }).map((_, idx) => (
        // eslint-disable-next-line react/jsx-key
        <Col>
          <Card>
           
            <Card.Body>
              <Card.Title>{appsSent[idx].jobTitle}</Card.Title>
              <Card.Text>
              Employer Email: {appsSent[idx].ownerEmail ? appsSent[idx].ownerEmail : "--"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
</div>
<hr></hr>

<div className="appsReceived">
<h3>Applications Received!</h3>
<Row xs={1} md={4} className="g-4">
      {Array.from({ length: appsReceived.length }).map((_, idx) => (
        // eslint-disable-next-line react/jsx-key
        <Col>
          <Card>
           
            <Card.Body>
              <Card.Title>{appsReceived[idx].jobTitle}</Card.Title>
              <Card.Text>
              Applicant Email: {appsReceived[idx].email ? appsReceived[idx].email : "--"}
              <br></br>
              Introduction: {appsReceived[idx].intro ? appsReceived[idx].intro : "--"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
</div>
<hr></hr>

<JobsPosted/>

      <div className="profilePage">
        <div className="username">
        <h3>Update Profile!</h3>
          <form
            name="editprofile"
            onSubmit={handleSubmit}
          >

            <input type="hidden" id="wallet" name="wallet" value={publicKey && publicKey.toString()} />
            <input type="hidden" id="email" name="email" value={session.user.email} />
            <input type="hidden" id="twitter" name="twitter" value={userData && userData.twitter} />
            <input type="hidden" id="discord" name="discord" value={userData && userData.discord} />
            <label htmlFor="username"><h6>Change your username:</h6></label>
            <br></br>
            <input id="username" type="text" name="username" />
            <button type="submit" className="editusername">Save</button>
          </form>
        </div>


        <div className="walletDiv">
          <div className="profileWallet">
            <h6>Connect your Solana Wallet:</h6>
          </div>
          <div className="profileWallet">
            <div className="walletSave">
            <ConnectWallet />
              </div>
            <div className="walletSave">
            <form
              name="editprofile"
              onSubmit={handleSubmit}

            >
              <input type="hidden" id="wallet" name="wallet" value={publicKey && publicKey.toString()} />
              <input type="hidden" id="email" name="email" value={session.user.email} />
              <input type="hidden" id="username" name="username" value={userData && userData.username} />
            <input type="hidden" id="discord" name="discord" value={userData && userData.discord} />
            <input type="hidden" id="twitter" name="twitter" value={userData && userData.twitter} />
    
              <br></br>
              <button type="submit" className="editwallet">Save</button>
            </form>
              
              </div>
           
          </div>
        </div>


        <div className="connectsocials">

          <div>
            <form
              name="editprofile"
              onSubmit={handleSubmit}

            >
              <input type="hidden" id="wallet" name="wallet" value={publicKey && publicKey.toString()} />
              <input type="hidden" id="email" name="email" value={session.user.email} />
              <input type="hidden" id="username" name="username" value={userData && userData.username } />
            <input type="hidden" id="discord" name="discord" value={userData && userData.discord} />
              <label htmlFor="username"><h6>Change Twitter @:</h6></label>
              <br></br>
              <input id="twitter" type="text" name="twitter" />
              <button type="submit" className="edittwitter">Save</button>
            </form>
          </div>
          <div>
            <form
              name="editprofile"
              onSubmit={handleSubmit}

            >
              <input type="hidden" id="wallet" name="wallet" value={publicKey && publicKey.toString()} />
              <input type="hidden" id="email" name="email" value={session.user.email} />
              <input type="hidden" id="twitter" name="twitter" value={userData && userData.twitter } />
            <input type="hidden" id="username" name="username" value={userData && userData.username} />
              <br></br>
              <label htmlFor="username"><h6>Change Discord (User#1010):</h6></label>
              <br></br>
              <input id="discord" type="text" name="discord" />
              <button type="submit" className="editdiscord">Save</button>
            </form>
          </div>

        </div>
      </div>




      <Footer />


    </div>
  );
}

export default Profile;