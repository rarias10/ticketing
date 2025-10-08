import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { 
      orderId: order.id 
    },
    onSuccess: () => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);


  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Ticket: {order.ticket.title}</p> 
      <p>Price: ${order.ticket.price}</p>
      {timeLeft > 0 ? (
        <p>Time left to pay: {timeLeft} seconds</p>
      ) : (
        <p>Order expired</p>
      )}
      {errors}
      {timeLeft > 0 && order.status !== 'complete' && (
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY || "pk_test_51SFIIC1hYYzb5YYEYUVbHDysYYUGYodOQIdOYl8UazZldEn7aifMR5GHxRWOfYgkyvuguWdwyOa2TARgtHAQmepI00nvYQjwtv"}
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
      )}
    </div>
  );
}   


OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;