// import { useEffect, useState } from "react";
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const PaypalButton = ({ planId }) => {
//   const navigate = useNavigate();

//   const createSubscription = (data, actions) => {
//     return actions.subscription.create({
//       plan_id: planId,
//     });
//   };

//   const onApprove = (data, actions) => {
//     console.log("Subscription ID:", data.subscriptionID);
//     navigate(`/subscription-success?subscription_id=${data.subscriptionID}`);
//   };

//   return (
//     <PayPalButtons
//       style={{
//         shape: "pill",
//         color: "gold",
//         layout: "vertical",
//         label: "subscribe",
//       }}
//       createSubscription={createSubscription}
//       onApprove={onApprove}
//     />
//   );
// };

// const SubscriptionSuccess = () => {
//   const [status, setStatus] = React.useState("Validating...");
//   const subscriptionID = new URLSearchParams(window.location.search).get(
//     "subscription_id"
//   );

//   useEffect(() => {
//     if (subscriptionID) {
//       axios
//         .post("http://localhost:8000/paypal/subscription/validate/", {
//           subscription_id: subscriptionID,
//         })
//         .then((response) => {
//           if (response.data.success) {
//             setStatus("Subscription is active");
//           } else {
//             setStatus("Subscription validation failed");
//           }
//         })
//         .catch((error) => {
//           console.error(
//             "There was an error validating the subscription!",
//             error
//           );
//           setStatus("Error validating subscription");
//         });
//     }
//   }, [subscriptionID]);

//   return (
//     <div>
//       <h1>Subscription Status</h1>
//       {subscriptionID ? (
//         <p>Subscription ID: {subscriptionID}</p>
//       ) : (
//         <p>No subscription ID found</p>
//       )}
//       <p>{status}</p>
//     </div>
//   );
// };

// function Checkout() {
//   const paypalOptions = {
//     "client-id": "YOUR_PAYPAL_CLIENT_ID",
//     vault: true,
//     intent: "subscription",
//   };

//   return (
//     <PayPalScriptProvider options={paypalOptions}>
//       <PaypalButton planId="P-5E8313409U4727601MZVTRRA" />
//     </PayPalScriptProvider>
//   );
// }

// export default Checkout;

import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const PayPalButton = () => {
  const navigate = useNavigate();

  const createSubscription = (data, actions) => {
    return actions.subscription.create({
      plan_id: "P-02326844BW3515740MZVUHYQ",
    });
  };

  const onApprove = (data, actions) => {
    console.log("Subscription ID:", data.subscriptionID);
    // You can add optional success message for the subscriber here
    alert(data.subscriptionID);
    // Optionally, navigate to a success page
    navigate(`/subscription-success?subscription_id=${data.subscriptionID}`);
  };

  return (
    <PayPalButtons
      style={{
        shape: "pill",
        color: "gold",
        layout: "vertical",
        label: "subscribe",
      }}
      createSubscription={createSubscription}
      onApprove={onApprove}
    />
  );
};

function Checkout() {
  const paypalOptions = {
    "client-id":
      "AXuL0ZkQj3k3MCxgQEt3-GTIs_n6otKI4gw9SivNJCkcqoTxf2PiB6FxPf_SuHTcIAjEXU3csJ3AzCQD",
    vault: true,
    intent: "subscription",
    "data-sdk-integration-source": "button-factory",
  };

  return (
    <div>
      <h1>Checkout</h1>
      <PayPalScriptProvider options={paypalOptions}>
        <div id="paypal-button-container-P-02326844BW3515740MZVUHYQ">
          <PayPalButton />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}

export default Checkout;
