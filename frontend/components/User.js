import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { func } from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`;

const User = props => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {payload => props.children(payload)}
  </Query>
);

// eslint-disable-next-line react/no-typos
User.propTypes = {
  children: func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
