import {
  refs
} from './firebase';

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
  return refs.user.root.orderByKey().on('child_added')
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
};
