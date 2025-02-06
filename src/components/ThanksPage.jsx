import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const ThanksPage = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;
  if (!orderData) {
    return (
      <div className="no-order">
        <p>No order details found!</p>
        <Link to="/">Home</Link>
      </div>
    );
  }

  return (
    <div className="thanks-page-wrapper">
      <div className="thanks-page">
        <h1>Thank You for Your Order!</h1>
        <h3>Order Summary</h3>
        <p>
          <strong>Name:</strong> {orderData.customer.name}
        </p>
        <p>
          <strong>Email:</strong> {orderData.customer.email}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹ {orderData.totalAmount}
        </p>
        <h4>Items:</h4>
        <ul>
          {orderData.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} x ₹ {item.price}
            </li>
          ))}
        </ul>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default ThanksPage;
