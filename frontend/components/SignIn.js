import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          name
          id
          email
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;
export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,

    // Refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;
  return (
    <Form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        await signin();
        resetForm();
      }}
    >
      <Error error={error} />
      <fieldset>
        <h2>Sign Into Your Account</h2>
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
        <button type="submit">Sign In !</button>
      </fieldset>
    </Form>
  );
}
