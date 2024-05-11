import UpdateProduct from '../components/UpdateProduct';

export default function UpdatepPage({ query }) {
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}
