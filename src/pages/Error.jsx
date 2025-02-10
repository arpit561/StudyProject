import React from 'react'
import { MdError } from "react-icons/md";

const Error = () => {
  return (
    <div className='flex flex-col justify-center items-center text-3xl text-caribbeangreen-400 mt-[40vh]'>
      Error - 404 Not found
      <br />
      <MdError size={50}/>
    </div>
  )
}

export default Error
