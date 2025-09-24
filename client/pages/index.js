const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in as {currentUser.email}</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

export default LandingPage;
