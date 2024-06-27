import React from 'react'
import Image from '../../components/homepage/Image'
import Form from '../../components/homepage/Form'
import Footer from '../../components/homepage/Footer'

const Homepage = ({isLoggedIn}) => {
  return (
    <div>
      <div className="container my-5">
        <div className='mt-10'>
        <Image/>
        <Form/>
        </div>
      </div>    
      
      <Footer/>
      
    </div>
  )
}

export default Homepage
