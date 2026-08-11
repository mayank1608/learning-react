import React from 'react'
import {Formik} from 'formik'
import { Subscriptions } from '@mui/icons-material'

function Registration() {
  return (
    <>
    <p align="center"><b>Registration Form</b>
     <div className="container">
      <Formik
       initialValues={
        {firstName:"enter first name",
        lastName:"enter last name", 
        gender:"",
        password:"",
        confirmpwd:"",
        email:"",
        phone:"",
        subscription:"",
        accept:""
        }}

        validate={(values)=>{
            const errors={} // Empty object
           
           if( !values.firstName)
             { errors.firstName="Required!";   }
           
           if( !values.lastName)
             { errors.firstName="Required!";   }

           if(!values.email)
           { errors.email="Required!";}
           else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
           { errors.email="Email id should be valid"}

             return errors;
           }
       }
       >
      { (formik)=> (
      <form onSubmit={formik.handleSubmit}>
        {console.log(formik)}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" className="form-control" name="firstName" 
          
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          <font color="red">{formik.errors.firstName}</font>
        </div>
        <div className="form-group mt-2">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" className="form-control" name="lastName" 
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
          />
        </div>
        <div className="form-group mt-2">
          <label>Gender</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="male"
              />
              <label className="form-check-label" for="male">
                Male
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="female"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.gender==='female'}
              />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="other"
                value="other"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.gender==='other'}

                
              />
              <label className="form-check-label" htmlFor="other">
                Other
              </label>
            </div>
          </div>
        </div>
        <div className="form-group mt-2">
          <label htmlFor="email">Email</label>
          <input type="text" className="form-control" name="email" 
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           value={formik.values.email}
          
          
          />
          <font color="red">{formik.errors.email}</font>
        </div>
        <div className="form-group mt-2">
          <label htmlFor="phone">Phone Number</label>
          <input type="number" className="form-control" name="phone" />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" name="password" />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
          />
        </div>

        <div className="form-group mt-2">
          <label htmlFor="confirmPassword">Subscription</label>
          <select className="form-control" name="subscription"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.subscription}
          
          >
            <option value="">Select</option>
            <option value="subscription-1">Free</option>
            <option value="subscription-2">Pro</option>
            <option value="subscription-3">Enterprise</option>
          </select>
        </div>

        <div className="form-group mt-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              
              id="termsAndCondtions"

            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.accept}
            />
            <label className="form-check-label" htmlFor="termsAndCondtions">
              Accept terms and conditions.
            </label>
          </div>
        </div>

        <div className="d-grid mt-2">
          <button type="submit" className="btn btn-primary btn-block">
            Sign Up
          </button>
        </div>
      </form>
    )}
      </Formik>  
    </div>
    </p>
    </>
  )
}

export default Registration
