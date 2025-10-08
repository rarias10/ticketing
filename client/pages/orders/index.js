const OrderIndex = ({ orders, currentUser }) => {
  return (
    <div> 
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <a href={`/orders/${order.id}`}>Order {order.id}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
} 


export default OrderIndex;