import Relay from 'react-relay';
import UserList from './UserListComponent';

export default Relay.createContainer(UserList, {
  initialVariables: {
    numUsersToShow: 10,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Admin{
        id
        email
        users(first:$numUsersToShow) {
          edges {
            node {
              id
              email
              name
              isPhoneValid
              phoneNumber
              profileImageUrl
              identificationImageUrl
              createdAt
            }
          }
        }
      }
    `
  }
});
