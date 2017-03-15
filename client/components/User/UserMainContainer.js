import Relay from 'react-relay';
import UserMain from './UserMainComponent';

export default Relay.createContainer(UserMain, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Admin{
        id
        email
      }
    `
  }
});
