import PageTitle from '../components/PageTitle';
import Button from '../components/Button';

function NotFound() {
  return (
    <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center space-y-8">
      <PageTitle>404 Page Not Found</PageTitle>
      <Button to="/">Go Back</Button>
    </div>
  );
}

export default NotFound;