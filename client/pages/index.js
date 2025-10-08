import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  // Ensure tickets is always an array
  const ticketsArray = Array.isArray(tickets) ? tickets : [];
  
  const ticketList = ticketsArray.map(ticket => {
  return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    )
  });

  return (
    <div>
      <h1>Tickets</h1>
      {ticketsArray.length === 0 ? (
        <p>No tickets available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
            </thead>
            <tbody>
              {ticketList}
            </tbody>
            </table>
      )}
    </div>  
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  try {
    const { data } = await client.get('/api/tickets');
    
    // Handle different possible response structures
    if (Array.isArray(data)) {
      return { tickets: data };
    } else if (data && Array.isArray(data.tickets)) {
      return { tickets: data.tickets };
    } else {
      return { tickets: [] };
    }
  } catch (error) {
    console.error('Error fetching tickets:', error.message);
    return { tickets: [] };
  }
};  

export default LandingPage;
