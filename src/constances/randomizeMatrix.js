import * as THREE from 'three'

export const randomizeMatrix = (function () {
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  return function (matrix, position_, i) {
      // console.log(i)
      // console.log(position_)
      // console.log(position_)
      position.x = position_.x;
      position.z = position_.z;
      // position.x = Math.random() * 500 - 250
      // position.z = Math.random() * 500 - 250
      position.y = 0;

      rotation.x = 0;
      rotation.y = 0;
      rotation.z = 0;

      quaternion.setFromEuler(rotation);

      scale.x = scale.y = scale.z = 1;

      matrix.compose(position, quaternion, scale);
  };
})();