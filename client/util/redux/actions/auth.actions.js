const SAVEAUTH = 'SAVEAUTH';
const DESTROYAUTH = 'DESTROYAUTH';

const saveAuth = auth => ({
  type: 'SAVEAUTH',
  user: auth.user,
  token: auth.token
});

const destroyAuth = () => ({
  type: 'DESTROYAUTH'
});

export {
  SAVEAUTH,
  DESTROYAUTH,
  saveAuth,
  destroyAuth
};
