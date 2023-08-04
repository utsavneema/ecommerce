import React from 'react'
// import Frontproduct from './Frontproduct'
import { baseUrl, priceFormat } from '../helpers'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'


const Card = (props) => {
  const navigate = useNavigate()
  const { productId,  price} = props; 

  const cardDetail = (id) => {
    navigate(`/detail/${id}`);
  };

  const cardClick = () => {
    cardDetail(productId);
  };

  // const addtoCart = ();

  return (
    <div>
<div >  
            <div className='card ' style={{ width: '250px', height: '310px',margin:5,display:'flex', backgroundColor:'#cbcbcb' }}>
          
            <div className='card-body justify-content-center' onClick={cardClick}>

               <img className="card-img-top px-5 py-1" src={baseUrl+`/images/${props.image}`} style={{ width: '250px', height: '150px' }} alt="image" />
               <h5 >{props.name}</h5> 
               <p>{priceFormat()}{price}</p>
               {/* {price && (
            <p>{priceFormat()} {price}</p>
          )} */}
               {/* <Button variant="dark"> + </Button> */}
              </div>
             </div>
            
 
         </div>

         
    </div>
    
            
  )
}

export default Card