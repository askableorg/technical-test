import { Link } from 'react-router-dom';

const Error404 = () => (
  <div className="content-narrow centered">
    <div className="stack text-centered padded">
      <h1>Page not found</h1>
      <Link to="/">Return home</Link>
    </div>
  </div>
);

export default Error404;
