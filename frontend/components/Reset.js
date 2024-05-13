import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [reset, { data, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  const Serror = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;
  console.log(error);
  return (
    <Form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        await reset().catch(console.error);
        resetForm();
      }}
    >
      <Error error={error || Serror} />
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Password updated successfully</p>
        )}
        <h2>Reset your Password</h2>
        <label htmlFor="email">
          Email
          <input
            name="email"
            type="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  );
}
