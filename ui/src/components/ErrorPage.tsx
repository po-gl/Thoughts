import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import './styles/ErrorPage.css';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page">
      <h1>Error!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {isRouteErrorResponse(error) &&
        <p>
          <i>{error.status}: {error.statusText || error.data.message}</i>
        </p>
      }
    </div>
  );
}

export default ErrorPage;
