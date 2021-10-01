import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { getCart, placeOrder } from "../redux/actions/dataActions";
import Spinner from "../util/spinner/spinner";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import MyButton from "../util/MyButton";

//custom-hook
import useForm from "../hooks/forms";

import CartItem from "../components/CartItem";
import {Label} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  title: {
    margin: "40px 0px 20px 128px",
    display: "inline-block",
    marginRight: "40%",
  },
  spaceTypo: {
    display: "flex",
    justifyContent: "space-between",
  },
  address: {
    "& > *": {
      margin: theme.spacing(4),
      width: "25ch",
    },
  },
  checkoutButton: {
    backgroundColor: "#1266f1",
    color: "white",
    marginBottom: 20,
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
    "&:disabled": {
      color: "#bfbfbf",
    },
  },
}));

const Cart = (props) => {
  const [step, setStep] = useState(1);

  const dispatch = useDispatch();
  const classes = useStyles();
  const { loading, cart, price } = useSelector((state) => state.data);
  const { errors } = useSelector((state) => state.UI);
  const history = useHistory();

  let deliveryCharge = 0;
  //let convenienceCharge = 0;
  let cartPresent = Array.isArray(cart) && cart.length > 0;
  let cartItems = cartPresent ? cart.length : 0;

  let streetError = null;
  let aptError = null;
  let localityError = null;
  let zipError = null;
  let phoneNoError = null;

  if (price !== 0) deliveryCharge = 20;
  //if(price !== 0 ) convenienceCharge = 20
  //change all delivery charge to convenience charge?

  const handlePlaceOrder = () => {
    const userData = {
      reservedFor: inputs.reservedFor,
      phoneNo: inputs.phoneNo,
      dateTime: inputs.dateTime,
      orderType: inputs.orderType,
    };
    console.log({ userData })
    dispatch(placeOrder(userData, history));
  };

  const { inputs, handleInputChange } = useForm({
    orderType: 'later',
  });

  useEffect(() => {
    console.log("in useEffect cart");
    dispatch(getCart());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (errors) {
    for (let error of errors) {
      if (error.msg.includes("10 digit phone")) phoneNoError = error.msg;
      if (error.msg.includes("Zipcode cannot")) zipError = error.msg;
      if (error.msg.includes("Locality cannot")) localityError = error.msg;
      if (error.msg.includes("Apartment name cannot")) aptError = error.msg;
      if (error.msg.includes("Street cannot")) streetError = error.msg;
    }
  }
//lets add a choice here between delivery /order for now /order for later with a select component maybe?
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (

        // {orderNow ? (
        //   <div>
        //   </div>
        // ) : (
        //   <div>
        //   </div>
        // ) }



        <>
          <Typography variant="h5" className={classes.title}>
            {step === 1 && `Cart (${cartItems} Items)`}
            {step === 2 && "Delivery Details"}
          </Typography>
          {step === 2 && (
            <MyButton tip="Go Back" onClick={prevStep}>
              <KeyboardBackspaceIcon />
            </MyButton>
          )}
          <Grid container direction="row" spacing={2}>
            <Grid item sm={1} />
            <Grid item sm={7}>
              {cartPresent &&
                step === 1 &&
                cart.map((item) => (
                  <CartItem {...item} key={item.itemId._id} />
                ))}
              {step === 2 && (
                <form>
                  <Typography
                    variant="body2"
                    component="p"
                    style={{ margin: "10px 10px 2px 10px" }}
                  >
                    Details:
                  </Typography>
                  <TextField
                    id="phoneNo"
                    name="phoneNo"
                    label="Contact Number"
                    className={classes.textField}
                    type="number"
                    onChange={handleInputChange}
                    value={inputs.phoneNo}
                    helperText={phoneNoError}
                    error={phoneNoError ? true : false}
                    fullWidth
                    required
                  />
                  <div className={classes.address}>
                    <label>
                      Order Now
                      <input
                        name="orderType"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={'now'}
                        required
                        type={'radio'}
                      />
                    </label>
<label>
  Order Later
  <input
    name="orderType"
    className={classes.textField}
    onChange={handleInputChange}
    value={'later'}
    required
    defaultChecked={true}
    type={'radio'}
  />
</label>

                  </div>
  
                  {
                      inputs.orderType === 'later' &&
                        <>
                      <TextField
                        id="reservedFor"
                        name="reservedFor"
                        label="Table Reservation for"
                        className={classes.textField}
                        onChange={handleInputChange}
                        value={inputs.reservedFor}
                        fullWidth
                        required
                        type={'number'}
                      />
                      <TextField
                        id="dateTime"
                        name="dateTime"
                        label="Date and Time of Dine-in"
                        className={classes.textField}
                        type="datetime-local"
                        onChange={handleInputChange}
                        value={inputs.dateTime}
                        fullWidth
                        required
                      />
                        </>
                    }

                </form>
              )}
            </Grid>
            <Grid item sm={3}>
              <Paper
                className={classes.paper}
                style={{ backgroundColor: "#faf7f7" }}
                elevation={4}
              >
                <div style={{ marginLeft: 20, marginRight: 20 }}>
                  <br />
                  <Typography gutterBottom variant="h5" noWrap>
                    {step === 1 && "Total Amount"}
                    {step === 2 && "Order Summary"}
                    <br />
                    <br />
                  </Typography>
                  {step === 1 && (
                    <Typography variant="body2" color="textPrimary">
                      <div className={classes.spaceTypo}>
                        <span>Initial amount</span>
                        <span>Rs. {price}</span>
                      </div>
                      <br />
                      <br />
                      <div className={classes.spaceTypo}>
                        <span>Convenience Charge</span>
                        <span>Rs. {deliveryCharge}</span>
                      </div>
                      <br />
                    </Typography>
                  )}
                  {step === 2 &&
                    cart.map((item) => {
                      return (
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          key={item.itemId._id}
                        >
                          <div className={classes.spaceTypo}>
                            <span>{item.itemId.title}</span>
                            <span>
                              Rs.
                              {item.itemId.price} x {item.quantity}
                            </span>
                          </div>
                          <br />
                        </Typography>
                      );
                    })}
                  <hr />
                  <Typography gutterBottom variant="h5" noWrap>
                    <div className={classes.spaceTypo}>
                      <span>Grand Total</span>
                      <span>Rs. {price + deliveryCharge}</span>
                    </div>
                    <br />
                  </Typography>
                  {step === 1 && (
                    <Button
                      fullWidth
                      className={classes.checkoutButton}
                      disabled={price === 0}
                      onClick={nextStep}
                    >
                      Proceed to Checkout
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      fullWidth
                      className={classes.checkoutButton}
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </Button>
                  )}
                </div>
              </Paper>
            </Grid>
            <Grid item sm={1} />
          </Grid>
        </>
      )}
    </>
  );
};

export default Cart;



// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';
// import MenuItem from '@material-ui/core/MenuItem';

// const orderTypes = [
//   {
//     value: 'D',
//     label: 'Delivery',
//   },
//   {
//     value: 'ON',
//     label: 'Order for now',
//   },
//   {
//     value: 'ON',
//     label: 'Order for later',
//   }

// ];

// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& .MuiTextField-root': {
//       margin: theme.spacing(1),
//       width: '25ch',
//     },
//   },
// }));

// export default function MultilineTextFields() {
//   const classes = useStyles();
//   const [orderType, setOrderType] = React.useState('EUR');

//   const handleChange = (event) => {
//     setOrderType(event.target.value);
//   };

//   return (
//     <form className={classes.root} noValidate autoComplete="off">
//       <div>
//         <TextField
//           id="standard-select-orderType"
//           select
//           label="Select"
//           value={orderType}
//           onChange={handleChange}
//           helperText="Please select your orderType"
//         >
//           {orderTypes.map((option) => (
//             <MenuItem key={option.value} value={option.value}>
//               {option.label}
//             </MenuItem>
//           ))}
//         </TextField>
//       </div>
//     </form>
//   );
// }


 /*import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const orderTypes = [
  {
    value: 'D',
    label: 'Delivery',
  },
  {
    value: 'ON',
    label: 'Order for now',
  },
  {
    value: 'ON',
    label: 'Order for later',
  }

];

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function MultilineTextFields() {
  const classes = useStyles();
  const [orderType, setOrderType] = React.useState('EUR');

  const handleChange = (event) => {
    setOrderType(event.target.value);
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="standard-select-orderType"
          select
          label="Select"
          value={orderType}
          onChange={handleChange}
          helperText="Please select your orderType"
        >
          {orderTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </form>
  );
}
        


        https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time%20%20%20
        https://material-ui.com/components/text-fields/#select
        
        
        */