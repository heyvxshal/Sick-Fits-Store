import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import ErrorMessage from '../../components/ErrorMessage';
import OrderStyles from '../../components/styles/OrderStyles';
import formatMoney from '../../lib/formatMoney';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order: Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrderPage({ query }) {
  console.log(query);
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id: query.id },
  });

  if (loading) return <p>Loading</p>;
  if (error) return <ErrorMessage error={error} />;

  const { order } = data;

  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - {order.id}</title>
      </Head>

      <h2>Total: {formatMoney(order.total)}</h2>
      <hr />
      <p>
        <span>Order Id:</span>
        <span>{order.id} </span>
      </p>
      <p>
        <span>Payment Id:</span>
        <span> {order.charge} </span>
      </p>

      <p>
        <span>Total Items:</span>
        <span>{order.items.length} </span>
      </p>

      <div className="items">
        {order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.title} />
            <div className="item-details">
              <h2>{item.name} </h2>
              <p>{item.description} </p>
              <p>
                Price: {formatMoney(item.price)} x {item.quantity}
              </p>
              <p>Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}
