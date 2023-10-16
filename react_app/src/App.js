import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Home from './admin/Home';
import Product from './admin/Product';
import Addtags from './admin/Addtags';
import Brands from './admin/Brands';
import Productlist from './admin/Productlist';
import Order from './admin/Order';
import Mainhome from './admin/Mainhome';
import Tags from './admin/Tags';
import Register from './admin/Register';
import Edittags from './admin/Edittags';
import Editproduct from './admin/Editproduct';
import Category from './admin/Category';
import Addcategory from './admin/Addcategory';
import EditCategory from './admin/EditCategory';
import Frontlayout from './Front/Frontlayout';
import Frontproduct from './Front/Frontproduct';
import Carddetail from './Carddetail';
import Userpage from './Userpage';
import Cart from './Front/Cart';
import Adminpage from './admin/Adminpage';
import Orderdetail from './Orderdetail';
import Orderdetails from './admin/Orderdetails';
import PaymentForm from './paymentForm';
import Adminreport from './admin/Adminreport';
import EmailTemplate from './emailTemplate';


function App() {
  return (
    <BrowserRouter> 
    <Routes>
    <Route path = '/' element={<Frontproduct/>}></Route>
      <Route path = '/login' element = {<Mainhome/>}></Route> 
      <Route path = '/register' element = {<Register/>}></Route> 
      <Route path = '/admin/home' element = {<Home />}></Route>
      <Route path='/admin/product' element = {<Product/>}></Route>
      <Route path='/admin/brands' element = {<Brands/>}></Route>
      <Route path='/admin/productlist' element = {<Productlist/>}></Route>
      <Route path='/admin/tags' element = {<Tags/>}></Route>
      <Route path='/admin/order' element={<Order/>}></Route>
      <Route path='/admin/addtags' element={<Addtags/>}></Route>
      <Route path='/admin/edittags/:id' element={<Edittags/>}></Route>
      <Route path= '/admin/edit-product/:id' element = {<Editproduct/>}></Route>
      <Route path = '/admin/category' element = {<Category/>}></Route>
      <Route path = '/admin/add-category' element = {<Addcategory/>}></Route>
      <Route path='/admin/edit-category/:id' element={<EditCategory/>}></Route>
      <Route path = '/user' element={<Userpage/>}></Route>
      <Route path = '/admin/adminpage' element={<Adminpage/>}></Route>
      <Route path = '/front/cart' element={<Cart/>}></Route>
      <Route path = '/order-detail/:id' element={<Orderdetail/>}></Route>
      <Route path = '/admin/order-details/:id' element = {<Orderdetails/>}></Route>
      <Route path = '/paymentform' element={<PaymentForm/>}></Route>
      <Route path = '/admin/report' element={<Adminreport/>}></Route>
      <Route path = '/emailtemplate' element={<EmailTemplate/>}></Route>

      {/* <Route path = '/front/front-product' element={<Frontproduct/>}></Route> */}
      <Route path = '/detail/:id' element={<Carddetail/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}
// 21 pages
export default App;
