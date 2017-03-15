import bcrypt from 'bcrypt';

import {
  admin,
  refs,
  defaultSchema,
} from '../database/firebase';

const saltRounds = 10;

// class User {
//   constructor(user) {
//     this.id = user.id;
//     this.name = user.name;
//     this.email = user.email;
//   }
// }

// class Feature {
//   constructor(id, name, description, url) {
//     this.id = id;
//     this.name = name;
//     this.description = description;
//     this.url = url;
//   }
// }

// const lvarayut = new User(1, 'Varayut Lerdkanlayanawat', 'lvarayut', 'https://github.com/lvarayut/relay-fullstack');
// const features = [
//   new Feature(1, 'React', 'A JavaScript library for building user interfaces.', 'https://facebook.github.io/react'),
//   new Feature(2, 'Relay', 'A JavaScript framework for building data-driven react applications.', 'https://facebook.github.io/relay'),
//   new Feature(3, 'GraphQL', 'A reference implementation of GraphQL for JavaScript.', 'http://graphql.org'),
//   new Feature(4, 'Express', 'Fast, unopinionated, minimalist web framework for Node.js.', 'http://expressjs.com'),
//   new Feature(5, 'Webpack', 'Webpack is a module bundler that packs modules for the browser.', 'https://webpack.github.io'),
//   new Feature(6, 'Babel', 'Babel is a JavaScript compiler. Use next generation JavaScript, today.', 'https://babeljs.io'),
//   new Feature(7, 'PostCSS', 'PostCSS. A tool for transforming CSS with JavaScript.', 'http://postcss.org'),
//   new Feature(8, 'MDL', 'Material Design Lite lets you add a Material Design to your websites.', 'http://www.getmdl.io')
// ];

/*
* Add feature in memory
*/

// let curFeatures = 9;
// function addFeature(name, description, url) {
//   const newFeature = new Feature(curFeatures, name, description, url);
//   features.push(newFeature);
//   newFeature.id = curFeatures;
//   curFeatures += 1;
//   return newFeature;
// }

const adminObj = { id: 0, email: 'admin@yetta.com', name: 'defaultAdmin' };

// / TODO : Impl admin auth system.
function getAdmin() {
  return adminObj;
}

// / TODO : Impl query by connection args.

// get user list by connectionArgs.
function getUsers() {
  return refs.user.root.orderByKey().once('value')
    .then(snap => Object.values(snap.val()));
}

// get user by id.
function getUser(id) {
  return refs.user.root.child(id).once('value')
    .then(snap => snap.val());
    // .then(snap => Object.values(snap.val()));
}

// get Order by connectionArgs.
function getOrders() {
  return null;
}

// get Order by id.
// function getOrder(id) {
//   return null;
// }


function getNodes() {
  return null;
}

// function getNode(id) {
//   return null;
// }

function createUser(name, email, password) {
  return new Promise((resolve, reject) => {
    admin.auth().createUser({
      email,
      emailVerified: false,
      password,
      displayName: name,
      disabled: false
    })
      .then(createdUser => refs.user.root.child(createdUser.uid).set({
        id: createdUser.uid,
        email,
        password: bcrypt.hashSync(password, saltRounds),
        name,
        ...defaultSchema.user.root
      })
          .then(() => refs.user.userQualification.child(createdUser.uid).set({
            ...defaultSchema.user.orderQualification
          }))
          .then(() => refs.user.runnerQualification.child(createdUser.uid).set({
            ...defaultSchema.user.runnerQualification
          })))
      .then(() => resolve({ name, email, password }))
      .catch(reject);
  });
}


// function getFeature(id) {
//   return features.find(w => w.id === id);
// }
//
// function getFeatures() {
//   return features;
// }

export {
  // User,
  getAdmin,
  getUsers,
  getUser,
  getOrders,
  // getOrder,
  getNodes,
  // getNode,
  createUser,
};
