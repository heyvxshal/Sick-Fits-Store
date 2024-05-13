import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [signup, { data, error }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: inputs,

    // Refetch the currently logged in user
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <Form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        await signup().catch(console.error);
        resetForm();
      }}
    >
      <Error error={error} />
      <fieldset>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link!</p>
        )}
        <h2>Reset Password</h2>
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

        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  );
}
