import React from 'react'
import '../App.css';
function Notification({message, success}) {
  if (message == null) {
    return null
  }
  return (
    <div>
      <p className={success ? 'notification' : 'error'} >
      {message}
      </p>
    </div>
  )
}

export default Notification