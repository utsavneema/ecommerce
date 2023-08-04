import React from 'react'
import Navbarr from './Navbar'

const Brands = () => {
  return (
    <Navbarr>
        <h2>List of all Brands available</h2>
    </Navbarr>
    
  )
}

export default Brands

// validations
// setError('');

//     const validateEmail = (email) => {
//       const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//       return emailRegex.test(email);
//     };

//     const validatePassword = (mobile) => {
//       const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;;
//       return passwordRegex.test(password);
//     };

//     if (name.trim() === '') {
//       setError('Username cannot be blank.');
//       return;
//     } else if (!validateEmail(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     } else if (!validatePassword(password)) {
//       setError('Please enter a valid password');
//       return;
//     }